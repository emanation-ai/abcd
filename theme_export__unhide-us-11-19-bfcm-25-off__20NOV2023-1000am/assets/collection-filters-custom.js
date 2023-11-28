class CustomFilters extends HTMLElement {
    constructor(){
        super();
        this.filterData = [];
        this.body = document.querySelector('body');
        this.filterBanner = document.querySelector('.filter-style-2');
        this.drawer = this.querySelector('.coll-filter-drawer');
        this.overlay = this.querySelector('.coll-filter-overlay');
        this.openDrawer = this.querySelector('.coll-filters__btn-open-drawer');
        this.closeDrawer = this.querySelector('.coll-filter-drawer__close');
        this.formDrawer = this.querySelector('.coll-filter-drawer__form');
        this.seeResult = this.querySelector('.coll-filter-drawer__see-result');
        this.sortBy = this.querySelector('.coll-filters__select-sort');
        this.sortByHidden = this.querySelector('.coll-filters__select-sort-hidden');
        this.openDrawer && this.openDrawer.addEventListener('click', this.drawerOpen.bind(this));
        this.closeDrawer && this.closeDrawer.addEventListener('click', this.drawerClose.bind(this));
        this.seeResult && this.seeResult.addEventListener('click', this.drawerClose.bind(this));
        this.debouncedOnSubmit = debounce((event) => {
            this.onSubmitHandler(event);
        }, 500);
        this.formDrawer.addEventListener('input', this.debouncedOnSubmit.bind(this));
        this.sortBy.addEventListener('change', this.sortByFun.bind(this));
    }

    drawerOpen(){
        this.drawer.setAttribute('aria-hidden', false);
        this.overlay.setAttribute('aria-hidden', false);
        this.body.style.overflow = "hidden";
        document.querySelector('.coll-filters').style.zIndex = 999;
    }

    sortByFun(event){
        if(!event) return;
        let value = event.target.value;
        this.sortByHidden.querySelectorAll('option').forEach(item => {
            item.value === value ? item.setAttribute('selected', 'selected') : item.removeAttribute('selected');
        });
        this.formDrawer.addEventListener('click', this.debouncedOnSubmit.bind(this));
        this.formDrawer.click();
    }

    drawerClose(){
        this.drawer.setAttribute('aria-hidden', true);
        this.overlay.setAttribute('aria-hidden', true);
        this.body.style.overflow = null;
      document.querySelector('.coll-filters').style.zIndex = 50;
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