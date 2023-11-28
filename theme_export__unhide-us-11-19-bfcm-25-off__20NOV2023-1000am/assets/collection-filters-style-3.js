class CustomFilters extends HTMLElement {
    constructor(){
      super();
      this.filterData = [];
      this.body = document.querySelector('body');
      this.filterBanner = document.querySelector('.filter-style-3');              
      this.toggleDrawer = this.querySelectorAll('.coll-filter-drawer__item-header');        
      this.formDrawer = this.querySelector('.coll-filter-drawer__form');        
      this.sortBy = this.querySelectorAll('#sort-by .option_item');
      this.sortByHidden = this.querySelector('.coll-filters__select-sort-hidden');
      this.filterOptions = this.querySelectorAll('.filter-group-display input');
      this.reset = this.querySelectorAll('.reset_filter');
      
      this.mFilters = this.querySelector('.filter-triger');
      this.mFilterTriggers = this.querySelectorAll('.filter-option_item');
      this.mSortTrigger = this.querySelector('.sort-triger');
      this.mCloseFilter = this.querySelector('.filter-options-mobile .close-draw');
      this.mCloseSort = this.querySelector('#sort-by .close-draw');
      this.mBackFilters = this.querySelectorAll('.go-back-option');
      
      this.toggleDrawer.forEach(item => {
        item.addEventListener('click', this.drawerToggle.bind(this));
      });          
      this.debouncedOnSubmit = debounce((event) => {
        this.onSubmitHandler(event);
      }, 500);
      this.formDrawer.addEventListener('input', this.debouncedOnSubmit.bind(this));
      this.sortBy.forEach(item => {
        item.addEventListener('click', this.sortByFun.bind(this));
      });
      this.reset.forEach(item => {
        item.addEventListener('click', this.resetData.bind(this));
      });
      this.filterOptions.forEach(item => {
        item.addEventListener('change', this.displayData.bind(this));
      });
      
      this.mFilters.addEventListener('click', this.mFilterOpen.bind(this));
      this.mFilterTriggers.forEach(item => {
        item.addEventListener('click', this.mFilterTriggerFun.bind(this));
      });
      this.mSortTrigger.addEventListener('click', this.mSortTriggerFun.bind(this));
      this.mCloseFilter.addEventListener('click', this.mCloseFilterFun.bind(this));
      this.mCloseSort.addEventListener('click', this.mCloseSortFun.bind(this));
      this.mBackFilters.forEach(item => {
        item.addEventListener('click', this.mBackFiltersFun.bind(this));
      });
    }
  
    mBackFiltersFun(event){
      if(!event) return;
      if(window.innerWidth<769){
        let eleItem = event.target.closest('.filter-option-wrapper');      
        this.mFilters.click();
        eleItem.querySelector('.coll-filter-drawer__item-header').click();
      }
      
    }
  
    mFilterOpen(event){
      if(!event) return;
      let item = this.querySelector('.coll-filter-mobile');      
      item.classList.add('open');     
    }
  
    mFilterTriggerFun(event){
      if(!event) return;
      let eleItem = event.target.closest('.filter-option_item');
      let value = eleItem.getAttribute('value'); 
      this.querySelector('#'+value).classList.add('open');
      this.mCloseFilter.click();
    }
  
    mSortTriggerFun(event){
      if(!event) return;
      let item = this.querySelector('#sort-by');      
      item.classList.add('open');     
    }
    
    mCloseFilterFun(event){
      if(!event) return;
      let item = event.target.closest('.coll-filter-mobile');      
      if(item.classList.contains('open')) {
        item.classList.remove('open');        
      }      
    }
    
    mCloseSortFun(event){
      if(!event) return;
      let item = event.target.closest('.filter-option-wrapper');      
      if(item.classList.contains('open')) {
        item.classList.remove('open');        
      }      
    }

    drawerToggle(event){
      if(!event) return;
      let item = event.target.closest('.filter-option-wrapper');      
      if(item.classList.contains('open')) {
        item.classList.remove('open');        
      }
      else{ 
        if(this.querySelector('.filter-option-wrapper.open') == null){
          item.classList.add('open');          
        }
        else{
          this.querySelector('.filter-option-wrapper.open').classList.remove('open');
          item.classList.add('open');
        }
      }
    }

    sortByFun(event){
      if(!event) return;
      let eleItem = event.target.closest('.option_item');
      let value = eleItem.getAttribute('value');
      if(eleItem.classList.contains('selected')) return;
      else{
        this.querySelector('.option_item.selected').classList.remove('selected');
        eleItem.classList.add('selected');
        document.querySelector('#sort-by .selected-values').innerText = ': ' + eleItem.innerText;

      }
      this.sortByHidden.querySelectorAll('option').forEach(item => {
        item.value === value ? item.setAttribute('selected', 'selected') : item.removeAttribute('selected');
      });
      this.formDrawer.addEventListener('click', this.debouncedOnSubmit.bind(this));
      this.formDrawer.click();
    }
    resetData(event){
      if(!event) return;
      event.stopImmediatePropagation();
      let eleItem = event.target.closest('.filter-option-wrapper');
      let eleInputs = eleItem.querySelector('.filter-group-display');
      eleItem.querySelector('.selected-values').innerText = '';
      eleItem.classList.add('non-selected');
      if(eleInputs.getAttribute('filter-type') == 'list'){
        eleInputs.querySelectorAll('input[type=checkbox]:checked').forEach(item => {
          item.checked = false;
        });
      }
      else{
        eleInputs.querySelectorAll('input[type=number]').forEach(item => {
          item.value = '';
        });

      }        
      this.formDrawer.addEventListener('click', this.debouncedOnSubmit.bind(this));
      this.formDrawer.click();
    }
    displayData(event){
      if(!event) return;        
      let eleItem = event.target.closest('.filter-option-wrapper');
      let eleInputs = eleItem.querySelector('.filter-group-display');      
      if(eleInputs.getAttribute('filter-type') == 'list'){
        if(eleInputs.querySelectorAll('input[type=checkbox]:checked').length>0){
          let dataStr = '';
          eleInputs.querySelectorAll('input[type=checkbox]:checked').forEach(item => {
            dataStr == '' ? dataStr += item.value : dataStr += ', ' + item.value;
          });
          eleItem.querySelector('.selected-values').innerText = dataStr;
          eleItem.classList.remove('non-selected');        
        }
        else{
          eleItem.querySelector('.selected-values').innerText = '';
          eleItem.classList.add('non-selected');  
        }
      }
      else{
        if(eleInputs.querySelector('.filter-group-display__price-range-from input').value == '' && eleInputs.querySelector('.filter-group-display__price-range-to input').value){
          eleItem.querySelector('.selected-values').innerText = '';
          eleItem.classList.add('non-selected');  
        }
        else{          
          let dataStr = '';
          eleInputs.querySelectorAll('input').forEach(item => {
            let value = '';
            item.value == '' ? value = item.getAttribute('placeholder') : value = item.value;
            dataStr == '' ? dataStr += '$' + value : dataStr += ' - $' + value;
          });
          eleItem.querySelector('.selected-values').innerText = dataStr;
          eleItem.classList.remove('non-selected');     
        }

      }
    }
    

    onSubmitHandler(event) {
        event.preventDefault();
        const form = event.target.closest('form');
        const formData = new FormData(form);
        const searchParams = new URLSearchParams(formData).toString();
        this.renderPage(searchParams, event);
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

    renderSectionFromFetch(url) {
        fetch(url)
        .then(response => response.text())
        .then((responseText) => {
        const html = responseText;
        this.filterData = [...this.filterData, { html, url }];
        this.renderProductGrid(html);
        });
    }

    renderSectionFromCache(filterDataUrl) {
        const html = this.filterData.find(filterDataUrl).html;
        this.renderProductGrid(html);
    }

    renderProductGrid(html) {
        const innerHTML = new DOMParser()
          .parseFromString(html, 'text/html')
          .getElementById('CollectionProductGrid').innerHTML;
    
        document.getElementById('CollectionProductGrid').innerHTML = innerHTML;
        window.scrollTo(0, (this.filterBanner.offsetTop - 71));
    }

    updateURLHash(searchParams) {
        history.pushState({ searchParams }, '', `${window.location.pathname}${searchParams && '?'.concat(searchParams)}`);
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

customElements.define('custom-filters', CustomFilters);