document.querySelectorAll('.quick-view-badge a').forEach((item)=>{  
  item.addEventListener("click", function(event){
    var json_str = this.closest(".quick-view-badge").querySelector('.product_object').textContent;
    var json_option_str = this.closest(".quick-view-badge").querySelector('.product_option_object').textContent;
    var productItem = JSON.parse(json_str);
    var productOptions = JSON.parse(json_option_str);
    document.querySelector('.product-modal-quickview  ul.product__media-list ').innerHTML = '';
    var media_list = "";
    if(productItem.images.length>0){ 
      i = 0;     
      for (let image of productItem.images) {
        media_list+= '<li class="product__media-item grid__item slider__slide" data-media-id="modal_quick_view-'+productItem.media[i].id+'"><div class="product__media media" style="padding-top: 90%;"><img src="'+image+'" alt=""></div></li>'
        i++;
      }
      document.querySelector('.product-modal-quickview  ul.product__media-list').innerHTML = media_list;
    }
    if(productItem.images.length==1){
      document.querySelector("#ModalquickView slider-component .slider-buttons").classList.add('hidden');
    }else{
      document.querySelector("#ModalquickView slider-component .slider-buttons").classList.remove('hidden');
    }
    var price = this.closest(".card-wrapper").querySelector('#productPrice').innerHTML;
    document.querySelector('.product-modal-quickview  #productPrice').innerHTML = price;
    document.querySelector('.product-modal-quickview  .product__title').innerText = productItem.title;
    document.querySelector('.product-modal-quickview  .viewfullinfo').setAttribute('href','/products/'+productItem.handle);
    
    item_id = this.getAttribute('data-id');
    first_variant_id = this.getAttribute('variant_id');
    document.querySelector('#modal_quick_view .input_variant').value = first_variant_id;    
    
    document.querySelector(".product-modal-quickview  .variant_wrapper").setAttribute('data-url','/products/'+productItem.handle);
    document.querySelector(".product-modal-quickview  .variant_wrapper").innerHTML = '';
 
    var option_html = ''; 
    if(productItem.variants.length>1){ 
      document.querySelector('.product-modal-quickview  #preorderbunner').innerHTML = '';
      var variant_str = this.closest(".quick-view-badge").querySelector('.product_variant_object').textContent;
      var variant_meta_str = this.closest(".quick-view-badge").querySelector('.product_variants-meta').textContent;
      for(let option of productOptions){
        option_html+= ' <fieldset class="js product-form__input"><legend class="form__label">Choose a '+option.name+'</legend>';
        i=0;
        for(let value of option.values){
          var active='';
          i==0? active='checked="checked"' : '';
          option_html += '<input '+active+'  type="radio" id="modal_quick_view-'+option.name+'-'+i+'" name="'+ option.name +'" value="'+value +'" form="modal_quick_view">';
          if(option.name.toLocaleLowerCase() == 'color' || option.name.toLocaleLowerCase() == 'colour'){
            option_html += '<label for="modal_quick_view-'+option.name+'-'+i+'" class="bc_color_label"><span class="pd-colors__icon" data-color="'+ value.toLocaleLowerCase() +'"></span></label>';
          }else{
            option_html += '<label for="modal_quick_view-'+option.name+'-'+i+'">' +value +'</label>';
          }
          i++;
        }
        option_html += '</fieldset>';
      }
      option_html += '<script type="application/json">'+variant_str+'</script><script id="product-variants-metafields" type="application/json">'+variant_meta_str+'</script>';
      document.querySelector(".product-modal-quickview  .variant_wrapper").innerHTML = option_html;
      new VariantSelectsRender(document.querySelector("#ModalquickView .variant_wrapper"));
      variant_action();      
    }else{
      if(productItem.available){
        document.querySelector('.product-modal-quickview  #preorderbunner').innerHTML = '';
        document.querySelector("#modal_quick_view  button.product-form__submit").removeAttribute('disabled');
        document.querySelector("#modal_quick_view  button.product-form__submit span").innerText = 'Add to cart';
      }else{
        document.querySelector('.product-modal-quickview  #preorderbunner').innerHTML = `<div class="bc-order-wrapper">
                      <h2 class="title">Sold Out</h3>
                      <p class="message">Sorry, ${productItem.title} -  is sold out</p>
                    </div>`;
        document.querySelector("#modal_quick_view  button.product-form__submit").setAttribute('disabled',true);
        document.querySelector("#modal_quick_view  button.product-form__submit span").innerText = 'Sold out';
      }
    }
    
    new SliderComponentRender(document.querySelector("#ModalquickView slider-component"));
    event.preventDefault();
    document.getElementById("ModalquickView-trigger").click();
    
    
  });
})


function variant_action(){
  document.querySelectorAll('.product-modal-quickview .variant_wrapper input').forEach((item)=>{
    item.addEventListener("change", function(){
      new VariantSelectsRender(document.querySelector("#ModalquickView .variant_wrapper"));
    })
  })
  
}

class SliderComponentRender{
  constructor(element) {    
    this.slider = element.querySelector('ul');
    this.sliderItems = element.querySelectorAll('li');
    this.pageCount = element.querySelector('.slider-counter--current');
    this.pageTotal = element.querySelector('.slider-counter--total');
    this.prevButton = element.querySelector('button[name="previous"]');
    this.nextButton = element.querySelector('button[name="next"]');

    if (!this.slider || !this.nextButton) return;

    const resizeObserver = new ResizeObserver(entries => this.initPages());
    resizeObserver.observe(this.slider);

    this.slider.addEventListener('scroll', this.update.bind(this));
    this.prevButton.addEventListener('click', this.onButtonClick.bind(this));
    this.nextButton.addEventListener('click', this.onButtonClick.bind(this));
  }

  initPages() {
    if (!this.sliderItems.length === 0) return;
    this.slidesPerPage = Math.floor(this.slider.clientWidth / this.sliderItems[0].clientWidth);
    this.totalPages = this.sliderItems.length - this.slidesPerPage + 1;
    this.update();
  }

  update() {
    if (!this.pageCount || !this.pageTotal) return;
    this.currentPage = Math.round(this.slider.scrollLeft / this.sliderItems[0].clientWidth) + 1;

    if (this.currentPage === 1) {
      this.prevButton.setAttribute('disabled', true);
    } else {
      this.prevButton.removeAttribute('disabled');
    }

    if (this.currentPage === this.totalPages) {
      this.nextButton.setAttribute('disabled', true);
    } else {
      this.nextButton.removeAttribute('disabled');
    }

    this.pageCount.textContent = this.currentPage;
    this.pageTotal.textContent = this.totalPages;
  }

  onButtonClick(event) {
    event.preventDefault();
    const slideScrollPosition = event.currentTarget.name === 'next' ? this.slider.scrollLeft + this.sliderItems[0].clientWidth : this.slider.scrollLeft - this.sliderItems[0].clientWidth;
    this.slider.scrollTo({
      left: slideScrollPosition
    });
  }
}




class VariantSelectsRender{
  constructor(element) {
    this.element = element;   
    this.onVariantChange();
  }

  onVariantChange() {
    this.updateOptions();
    this.updateMasterId();
    this.toggleAddButton(true, '', false);
    this.updatePickupAvailability();

    if (!this.currentVariant) {
      this.toggleAddButton(true, '', true);
      this.setUnavailable();
    } else {
      this.updateMedia();
     // this.updateURL();
      this.updateVariantInput();
      this.renderProductInfo();
    }
  }

  updateOptions() {
    //this.options = Array.from(this.element.querySelectorAll('select'), (select) => select.value);
    const fieldsets = Array.from(this.element.querySelectorAll('fieldset'));
    this.options = fieldsets.map((fieldset) => {
       return Array.from(fieldset.querySelectorAll('input')).find((radio) => radio.checked).value;
    });
  }

  updateMasterId() {
    this.currentVariant = this.getVariantData().find((variant) => {
      return !variant.options.map((option, index) => {
        return this.options[index] === option;
      }).includes(false);
    });
    
    this.cuurentMetafield = this.getVariantMetafields().find(meta => meta[this.currentVariant.id] !== undefined);
    this.variantMetafield = this.cuurentMetafield[this.currentVariant.id];
  }

  updateMedia() {
    if (!this.currentVariant || !this.currentVariant?.featured_media) return;
    const newMedia = document.querySelector(
      `[data-media-id="modal_quick_view-${this.currentVariant.featured_media.id}"]`
    );
    if (!newMedia) return;
    const parent = newMedia.parentElement;
    parent.prepend(newMedia);
    window.setTimeout(() => { parent.scroll(0, 0) });
  }

  updateURL() {
    if (!this.currentVariant) return;
    window.history.replaceState({ }, '', this.element.getAttribute('data-url')+`?variant=${this.currentVariant.id}`);
  }

  updateVariantInput() {
    const productForms = document.querySelectorAll(`#modal_quick_view, #product-form-installment`);
    productForms.forEach((productForm) => {
      const input = productForm.querySelector('input[name="id"]');
      input.value = this.currentVariant.id;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }

  updatePickupAvailability() {
    const pickUpAvailability = document.querySelector('pickup-availability');
    if (!pickUpAvailability) return;

    if (this.currentVariant?.available) {
      pickUpAvailability.fetchAvailability(this.currentVariant.id);	
    } else {
      pickUpAvailability.removeAttribute('available');
      pickUpAvailability.innerHTML = '';
    }
  }

  renderProductInfo() {
    fetch(this.element.getAttribute('data-url')+`?variant=${this.currentVariant.id}`)
      .then((response) => response.text())
      .then((responseText) => {
        const id = `price-modal_quick_view`;
        const html = new DOMParser().parseFromString(responseText, 'text/html')
        const destination = document.getElementById(id);
        const source = html.querySelector('.bc-product-price-wrapper');
        if (source && destination) destination.innerHTML = source.innerHTML;

      document.getElementById(`price-modal_quick_view`)?.classList.remove('visibility-hidden');
      if(this.currentVariant.available){ 
        this.toggleAddButton(false, variantStrings.addToCart);
        document.getElementById('preorderbunner').innerHTML = '';
        document.getElementById('bc-order-id').innerHTML = '';
        
      } else { 
        this.toggleAddButton(true, variantStrings.soldOut);
        let htmlNew = `<div class="bc-order-wrapper">
                      <h2 class="title">Sold Out</h3>
                      <p class="message">Sorry, ${this.currentVariant?.name.replace(this.currentVariant?.title, '')} is sold out in size ${this.currentVariant?.title}.</p>
                    </div>`;
        document.getElementById('preorderbunner').innerHTML = htmlNew;
      }
      if(this.variantMetafield?.type !== undefined && this.variantMetafield?.inventory_quantity < 1 && this.currentVariant.available ){
        const type = this.variantMetafield?.type.split('_').join(' ');
        let html = `<div class="bc-order-wrapper"><h2 class="title">${type}</h3>`;
        if(this.variantMetafield?.type === 'pre_order'){
          html += `<p class="message">FYI, ${this.currentVariant.name} ${this.variantMetafield?.pre_order}.</p>${this.getPreOrderModal(this.variantMetafield?.pre_order_expected_date)}`;
          document.getElementById('bc-order-id').innerHTML = `<input type="hidden" name="pre" value="order">
                                <input type="hidden" name="pre_order_announcement" value="${this.variantMetafield?.pre_order}">
                                <input type="hidden" name="pre_order_expected_date" value="${this.variantMetafield?.pre_order_expected_date}">`;
          this.toggleAddButton(false, type);
        } else if (this.variantMetafield?.type === 'coming_soon'){
          const monthNames = ["","January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
          const customDate = this.variantMetafield?.pre_order_expected_date.split('-');
          html += customDate 
          ? `<p class="message">Launches ${monthNames[customDate[1]]} ${customDate[2]}th</p>`
          : '';
          document.getElementById('bc-order-id').innerHTML = '';
        } else {
          html += `<p class="message">Sorry, ${this.currentVariant?.name.replace(this.currentVariant?.title, '')} is sold out in size ${this.currentVariant?.title}.</p>`;
          document.getElementById('bc-order-id').innerHTML = '';
          this.setUnavailable();
        }
        html += `</div>`;
        document.getElementById('preorderbunner').innerHTML = html;
      }

    });
  }

  toggleAddButton(disable = true, text, modifyClass = true) {
    const addButton = document.getElementById(`modal_quick_view`)?.querySelector('[name="add"]');
    if (!addButton) return;

    if (disable) {
      addButton.setAttribute('disabled', true);
      addButton.classList.add('bc-sold-out');
      if (text) addButton.querySelector('span.product-form__submit-label').textContent = text;
    } else {
      addButton.removeAttribute('disabled');
      addButton.classList.remove('bc-sold-out');
      addButton.querySelector('span.product-form__submit-label').textContent = text;
    }

    if (!modifyClass) return;
  }

  setUnavailable() {
    const addButton = document.getElementById(`product-form-modal_quick_view`)?.querySelector('[name="add"]');
    if (!addButton) return;
    addButton.textContent = window.variantStrings.unavailable;
    document.getElementById(`price-modal_quick_view`)?.classList.add('visibility-hidden');
  }

  getVariantData() {
    this.variantData = this.variantData || JSON.parse(this.element.querySelector('[type="application/json"]').textContent);
    return this.variantData;
  }

  getVariantMetafields() {
    this.variantMetafields = this.variantMetafields || JSON.parse(this.element.querySelector("#product-variants-metafields").textContent);
    return this.variantMetafields;
  }

  getPreOrderModal(date){
    let preOrderModal = `<modal-opener class="product-popup-modal__opener no-js-hidden" data-modal="#PopupModal-preorder">
        <button id="ProductPopup-preorder" class="product-popup-modal__button link bc-pre-order-learn" type="button" aria-haspopup="dialog">Learn more here</button>
        </modal-opener>
        <modal-dialog id="PopupModal-preorder" class="product-popup-modal">
        <div role="dialog" aria-modal="true" class="product-popup-modal__content" tabindex="-1">
        <button id="ModalClose-preorder" type="button" class="product-popup-modal__toggle" aria-label="Close">
        <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" role="presentation" class="icon icon-close" fill="none" viewBox="0 0 18 17">
        <path d="M.865 15.978a.5.5 0 00.707.707l7.433-7.431 7.579 7.282a.501.501 0 00.846-.37.5.5 0 00-.153-.351L9.712 8.546l7.417-7.416a.5.5 0 10-.707-.708L8.991 7.853 1.413.573a.5.5 0 10-.693.72l7.563 7.268-7.418 7.417z" fill="currentColor">
        </path></svg>
        </button>
        <h2>SPECIAL ORDERS</h2>
        <p>Any order that has a specific ship out date will ship out close to that date. If you order anything else that is currently in stock (does not say ships out on ${date} date) it will ship immediately and the remaining items will ship out when we receive them in our warehouse in a separate package. Please email us if you have any questions.</p>
        </div>
        </modal-dialog>`;
     return preOrderModal;
  }

}
