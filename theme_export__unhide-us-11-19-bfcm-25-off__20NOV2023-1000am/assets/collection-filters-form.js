class CollectionFiltersForm extends HTMLElement {
  constructor() {
    super();
    this.filterData = [];
    this.onActiveFilterClick = this.onActiveFilterClick.bind(this);

    this.debouncedOnSubmit = debounce((event) => {
      // event.target.closest('form').classList.add('disabled');
      this.onSubmitHandler(event);
    }, 500);

    this.querySelector('form').addEventListener('input', this.debouncedOnSubmit.bind(this));
    window.addEventListener('popstate', this.onHistoryChange.bind(this));

    this.bindActiveFacetButtonEvents();
  }

  onSubmitHandler(event) {
    event.preventDefault();
    const form = event.target.closest('form');
    if(event.target.getAttribute('data-type') !== null){
      const formData = new FormData(form);
      const searchParams = new URLSearchParams(formData).toString();
      const searchPramsObject = new URLSearchParams(formData);
      var searchTags = "/";
      searchPramsObject.forEach(function(value,key){
        if(key !="sort_by" && key.indexOf('filter.v.option')<0){
          if(searchTags == '/'){
            searchTags = searchTags + value;
          }else{
            searchTags =  searchTags + "+" + value;
          }
        }
      });      
      this.updateURLHash(searchParams, searchTags, true)
      this.renderPage(searchParams, event);
    } else {
      const formData = new FormData(form);
      const searchParams = new URLSearchParams(formData).toString();
      this.renderPage(searchParams, event);
    }
  }

  onActiveFilterClick(event) {
    event.preventDefault();

    if(event.target.getAttribute('data-type') !== null){
      const tagParams = event.target.getAttribute('data-type');
      if(tagParams == "clear_all"){
        window.location.href = event.target.href;
      }else{
        const urlTagParams = tagParams !== 'clear_all' ?
          window.location.pathname.indexOf('+' + tagParams) !== -1
          ? window.location.pathname.replace('+' + tagParams, '') 
          : window.location.pathname.indexOf('/' + tagParams + '+') !== -1 
            ? window.location.pathname.replace(tagParams + '+', '')
            : window.location.pathname.replace('/' + tagParams, '')
          : event.target.href
        history.pushState({ urlTagParams }, '', `${urlTagParams}`);
        this.toggleActiveFacets();
        this.renderPage(new URL(event.target.href).searchParams.toString());
        event.target.remove();        
      }
      
    } else {
      this.toggleActiveFacets();
      this.renderPage(new URL(event.target.href).searchParams.toString());
    }
    document.querySelector(".bc-collection-page-fillters input[value='"+event.target.getAttribute('data-value')+"']").checked = false;
    document.querySelector(".bc-collection-page-fillters input[value='"+event.target.getAttribute('data-value')+"']").parentElement.parentElement.classList.remove('active')
    document.querySelector(".mobile-facets input[value='"+event.target.getAttribute('data-value')+"']").checked = false;
  }

  onHistoryChange(event) {
    const searchParams = event.state?.searchParams || '';
    this.renderPage(searchParams, null, false);
  }

  toggleActiveFacets(disable = true) {
    document.querySelectorAll('.js-facet-remove').forEach((element) => {
      element.classList.toggle('disabled', disable);
    });
  }

  renderPage(searchParams, event, updateURLHash = true) {
    const sections = this.getSections();
    document.getElementById('CollectionProductGrid').querySelector('.collection').classList.add('loading');
    sections.forEach((section) => {
      const url = `${window.location.pathname}?section_id=${section.section}&${searchParams}`;
      const filterDataUrl = element => element.url === url;

      this.filterData.some(filterDataUrl) ?
        this.renderSectionFromCache(filterDataUrl, section, event) :
        this.renderSectionFromFetch(url, section, event);
    });

    if (updateURLHash) this.updateURLHash(searchParams);
  }

  renderSectionFromFetch(url, section, event) {
    fetch(url)
      .then(response => response.text())
      .then((responseText) => {
        const html = responseText;
        this.filterData = [...this.filterData, { html, url }];
        this.renderFilters(html, event);
        this.renderProductGrid(html);
      });
  }

  renderSectionFromCache(filterDataUrl, section, event) {
    const html = this.filterData.find(filterDataUrl).html;
    this.renderFilters(html, event);
    this.renderProductGrid(html);
  }

  renderProductGrid(html) {
    const innerHTML = new DOMParser()
      .parseFromString(html, 'text/html')
      .getElementById('CollectionProductGrid').innerHTML;

    document.getElementById('CollectionProductGrid').innerHTML = innerHTML;
  }

  renderFilters(html, event) {
    const parsedHTML = new DOMParser().parseFromString(html, 'text/html');

    const facetDetailsElements =
      parsedHTML.querySelectorAll('#CollectionFiltersForm .js-filter, #CollectionFiltersFormMobile .js-filter');
    const matchesIndex = (element) => element.dataset.index === event?.target.closest('.js-filter')?.dataset.index
    const facetsToRender = Array.from(facetDetailsElements).filter(element => !matchesIndex(element));
    const countsToRender = Array.from(facetDetailsElements).find(matchesIndex);

    facetsToRender.forEach((element) => {
     // document.querySelector(`.js-filter[data-index="${element.dataset.index}"]`).innerHTML = element.innerHTML;
    });

    this.renderActiveFacets(parsedHTML);
    // this.renderMobileElements(parsedHTML);

    if (countsToRender) this.renderCounts(countsToRender, event.target.closest('.js-filter'));
  }

  renderActiveFacets(html) {
      const activeFacetElementSelectors = ['.active-facets-mobile', '.active-facets-desktop'];

      activeFacetElementSelectors.forEach((selector) => {
        const activeFacetsElement = html.querySelector(selector);
        if (!activeFacetsElement) return;
        document.querySelector(selector).innerHTML = activeFacetsElement.innerHTML;
      })

      this.bindActiveFacetButtonEvents();
      this.toggleActiveFacets(false);
  }

  renderMobileElements(html) {
    const mobileElementSelectors = ['.mobile-facets__open', '.mobile-facets__count'];

    mobileElementSelectors.forEach((selector) => {
      document.querySelector(selector).innerHTML = html.querySelector(selector).innerHTML;
    });

    document.getElementById('CollectionFiltersFormMobile').closest('menu-drawer').bindEvents();
  }

  renderCounts(source, target) {
    const countElementSelectors = ['.count-bubble','.facets__selected'];
    countElementSelectors.forEach((selector) => {
      const targetElement = target.querySelector(selector);
      const sourceElement = source.querySelector(selector);

      if (sourceElement && targetElement) {
        target.querySelector(selector).outerHTML = source.querySelector(selector).outerHTML;
      }
    });
  }

  bindActiveFacetButtonEvents() {
    document.querySelectorAll('.js-facet-remove').forEach((element) => {
      element.addEventListener('click', this.onActiveFilterClick, { once: true });
    });
  }

  updateURLHash(searchParams, tagParams, removeTag = false) {
    const basic_url = "/" + window.location.pathname.split('/')[1] + "/" + window.location.pathname.split('/')[2];
    const urlTagParams =  basic_url + tagParams;
    console.log("aa-"+urlTagParams);  
    tagParams !== undefined 
      ? history.pushState({ searchParams }, '', `${urlTagParams}${searchParams && '?'.concat(searchParams)}`)
      : history.pushState({ searchParams }, '', `${window.location.pathname}${searchParams && '?'.concat(searchParams)}`)
    setTimeout(() => { document.getElementById('CollectionFiltersForm').classList.remove('disabled'); }, 500);
  }

  getSections() {
    return [
      {
        id: 'main-collection-product-grid',
        section: document.getElementById('main-collection-product-grid').dataset.id,
      }
    ]
  }
}

customElements.define('collection-filters-form', CollectionFiltersForm);

class PriceRange extends HTMLElement {
  constructor() {
    super();
    this.querySelectorAll('input')
      .forEach(element => element.addEventListener('change', this.onRangeChange.bind(this)));

    this.setMinAndMaxValues();
  }

  onRangeChange(event) {
    this.adjustToValidValues(event.currentTarget);
    this.setMinAndMaxValues();
  }

  setMinAndMaxValues() {
    const inputs = this.querySelectorAll('input');
    const minInput = inputs[0];
    const maxInput = inputs[1];
    if (maxInput.value) minInput.setAttribute('max', maxInput.value);
    if (minInput.value) maxInput.setAttribute('min', minInput.value);
    if (minInput.value === '') maxInput.setAttribute('min', 0);
    if (maxInput.value === '') minInput.setAttribute('max', maxInput.getAttribute('max'));
  }

  adjustToValidValues(input) {
    const value = Number(input.value);
    const min = Number(input.getAttribute('min'));
    const max = Number(input.getAttribute('max'));

    if (value < min) input.value = min;
    if (value > max) input.value = max;
  }
}

customElements.define('price-range', PriceRange);


function selectOnlyThis(id,name){
  var myCheckbox = document.getElementsByName(name);

  if(id.getAttribute('data-type') !== null){
    if(id.checked){
      Array.prototype.forEach.call(myCheckbox,function(el){
        el.checked = false;
        document.querySelectorAll('.'+name+' li.active').forEach((el) => {el.classList.remove('active')});
      });
      id.checked = true;
      id.parentElement.parentElement.classList.add('active');
    }else{
      Array.prototype.forEach.call(myCheckbox,function(el){
        el.checked = false;
        document.querySelectorAll('.'+name+' li.active').forEach((el) => {el.classList.remove('active')})
      });    
    }
  }else{
    if(id.checked){
      id.parentElement.parentElement.classList.add('active');
    }else{
      id.parentElement.parentElement.classList.remove('active');
    }
  }
  
}