class DetailsModal extends HTMLElement {
  constructor() {
    super();
    
    this.detailsContainer = this.querySelector('details');
    this.summaryToggle = this.querySelector('summary');

    this.detailsContainer.addEventListener(
      'keyup',
      (event) => event.code.toUpperCase() === 'ESCAPE' && this.close()
    );
    this.summaryToggle.addEventListener(
      'click',
      this.onSummaryClick.bind(this)
    );
    this.querySelector('button[type="button"]').addEventListener(
      'click',
      this.close.bind(this)
    );

    this.detailsContainer.querySelector('#Search-In-Modal') && this.detailsContainer.querySelector('#Search-In-Modal').addEventListener('input', this.reqSearch.bind(this));

    this.summaryToggle.setAttribute('role', 'button');
    this.summaryToggle.setAttribute('aria-expanded', 'false');
    this.menuDrawer = document.querySelector('[aria-controls="menu-drawer"]');

  }

  reqSearch(event){

    const resultWrapper = document.querySelector('.bc-search-result-wrapper');
    if(!event.target.value || !event.target.value.trim() || !resultWrapper) return;
    resultWrapper.classList.add('loading');
    fetch(`/search/suggest.json?q=${event.target.value}&resources[type]=product&resources[tag]=tops&resources[options][fields]=title,product_type,variants.title`)
    .then(response => response.json())
    .then(suggestions => this.renderSearch(suggestions, event.target.value))
    .catch(error => console.error(error))
    .finally(() => {
      resultWrapper.classList.remove('loading');
    });

  }

  renderSearch(data, val){

    let htmlContent = document.querySelector('.bc-search-result-wrapper');
    let htmlInnerContent = document.querySelector('.bc-search-result-inner-wrapper');

    if(!data.resources.results.products.length){
      htmlContent.classList.add('no-result'); 
      htmlContent.classList.remove('have-result');
      return;
    }

    htmlContent.classList.add('have-result');
    htmlContent.classList.remove('no-result');
    
    let result_count = data.resources.results.products.length;
    let hide_tags ="";
    if(this.querySelector('.search-modal__form').hasAttribute('aria-hide-tags')){
      hide_tags = this.querySelector('.search-modal__form').getAttribute('aria-hide-tags').split('|');       
    }

    console.log(data.resources.results.products);
    let htmlItem = ``;
    let view_btn_class = document.querySelector('.bc-search-result-wrapper').getAttribute('data_btn_class');
    data.resources.results.products.forEach(product => {
      for(i=0;i<hide_tags.length;i++){
        if(product.tags.includes(hide_tags[i])){
          console.log('skip');
          result_count --;
          return;
        } 
      }      
      htmlItem += `<div class="bc-cart__item"><div class="card-wrapper">`;
      htmlItem += `<div class="bc-cart__image-wrapper">
                    <a href="${product.url}">
                      <img class="bc-cart__image-img" src="${product.featured_image.url || "//cdn.shopify.com/shopifycloud/shopify/assets/no-image-100-c91dd4bdb56513f2cbf4fc15436ca35e9d4ecd014546c8d421b1aece861dfecf_55x70.gif"}" alt="${ product.featured_image.alt | "Product Image"}" width="155"/>
                    </a>
                  </div>`;
      htmlItem += `<div class="bc-cart__info-wrapper">
                    <a href="${product.url}">
                      <div class="caption-with-letter-spacing light bc-cart__vendor" style="display:none">${product.vendor}</div>
                      <h3 class="bc-cart__title">${product.title}</h3>
                      <div class="bc-cart__price-and-properties">
                        <div class="bc-cart__price-wrapper">
                          <span class="bc-cart__price">${Shopify.formatMoney(product.price)}</span>
                        </div>
                      </div>
                      <div class="card-button-wrapper" style="display:none">
                        <div class="card-view-wrapper">
                          <span class="card-view-product ${view_btn_class}">View Product</span>
                        </div>
                      </div>
                    </a>`;
      htmlItem += `</div></div></div>`;
    }); 
    if(!result_count){
      htmlContent.classList.add('no-result'); 
      htmlContent.classList.remove('have-result');
      return;
    }
    let htmlItem1 = `<div class="bc-cart__result-count">${ result_count } RESULTS</div>`;   
    htmlInnerContent.innerHTML = htmlItem1+htmlItem;

  }

  isOpen() {
    return this.detailsContainer.hasAttribute('open');
  }


  onSummaryClick(event) {
    event.preventDefault();
    event.target.closest('details').hasAttribute('open')
      ? this.close()
      : this.open(event);
  }

  onBodyClick(event) {
    if (!this.contains(event.target)) this.close(false);
  }

  open(event) {
    
    this.menuDrawer && this.menuDrawer.getAttribute('aria-expanded') === 'true' ? this.menuDrawer.click() : null;
    this.onBodyClickEvent =
      this.onBodyClickEvent || this.onBodyClick.bind(this);
    event.target.closest('details').setAttribute('open', true);
    document.body.addEventListener('click', this.onBodyClickEvent);

    trapFocus(
      this.detailsContainer.querySelector('[tabindex="-1"]'),
      this.detailsContainer.querySelector('input:not([type="hidden"])')
    );
  }

  close(focusToggle = true) {
    removeTrapFocus(focusToggle ? this.summaryToggle : null);
    this.detailsContainer.removeAttribute('open');
    document.body.removeEventListener('click', this.onBodyClickEvent);
  }
}

customElements.define('details-modal', DetailsModal);
