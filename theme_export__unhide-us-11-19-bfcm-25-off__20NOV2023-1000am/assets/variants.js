class UpsellVariantSelects extends HTMLElement {
    constructor() {
      super();
      this.addEventListener('change', this.onVariantChange);
      this.onVariantChange();
    }
  
    onVariantChange() {
      this.updateOptions();
      this.updateMasterId();
      this.toggleAddButton(true, '', false);      
  
      if (!this.currentVariant) {
        this.toggleAddButton(true, '', true);
        this.setUnavailable();
      } else {        
        this.updateVariantInput();
        this.renderProductInfo();
      }      
    }
  
    updateOptions() {
      this.options = Array.from(this.querySelectorAll('select'), (select) => select.value);      
    }
  
    updateMasterId() {
      this.currentVariant = this.getVariantData().find((variant) => {
        return !variant.options.map((option, index) => {
          return this.options[index] === option;
        }).includes(false);
      });
      if(!this.currentVariant) return;
      this.cuurentMetafield = this.getVariantMetafields().find(meta => meta[this.currentVariant.id] !== undefined);
      this.variantMetafield = this.cuurentMetafield[this.currentVariant.id];
    }
  
    updateVariantInput() {
      const productForms = document.querySelectorAll(`#upsell-${this.dataset.section}`);
      productForms.forEach((productForm) => {
        const input = productForm.querySelector('input[name="id"]');
        input.value = this.currentVariant.id;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      });
    }    
  
    renderProductInfo() {
      fetch(`${this.dataset.url}?variant=${this.currentVariant.id}&section_id=${this.dataset.tsection}`)
        .then((response) => response.text())
        .then((responseText) => {
          const id = `price-${this.dataset.tsection}`;
          const html = new DOMParser().parseFromString(responseText, 'text/html')
          const destination = this.closest('.j-upsell-info').querySelector('#'+id);
          const source = html.getElementById(id);
          if (source && destination) destination.innerHTML = source.innerHTML;
  
        this.closest('.j-upsell-info').querySelector('#'+id)?.classList.remove('visibility-hidden');
        if(this.currentVariant.available){ 
          this.toggleAddButton(false, variantStrings.addToCart);
          this.closest('.j-upsell-variant-wraper').querySelector('#preorderbunner').innerHTML = '';
          this.closest('.j-upsell-variant-wraper').querySelector('#bc-order-id').innerHTML = '';          
        } else { 
          this.toggleAddButton(true, variantStrings.soldOut);
          let htmlNew = `<div class="bc-order-wrapper sold-out-card">
                        <h2 class="title">Sold Out</h3>
                        <p class="message">Sorry, ${this.currentVariant?.name.replace(this.currentVariant?.title, '')} is sold out in size ${this.currentVariant?.title}.</p>
                      </div>`;
          this.closest('.j-upsell-variant-wraper').querySelector('#preorderbunner').innerHTML = htmlNew;          
        }         
        if(this.variantMetafield?.type !== undefined && this.variantMetafield?.inventory_quantity < 1 && this.currentVariant.available){
          const type = this.variantMetafield?.type.split('_').join(' ');
          let html = `<div class="bc-order-wrapper"><h2 class="title">${type}</h3>`;
          if(this.variantMetafield?.type === 'pre_order'){
            if(this.variantMetafield?.pre_order_inventory_quantity*1 > 0){
              html += `<p class="message">${this.currentVariant.name} ${this.variantMetafield?.pre_order}.</p>${this.getPreOrderModal(this.variantMetafield?.pre_order_expected_date)}`;
              this.closest('.j-upsell-variant-wraper').querySelector('#bc-order-id').innerHTML = `<input type="hidden" name="pre" value="order">
                                    <input type="hidden" name="pre_order_announcement" value="${this.variantMetafield?.pre_order}">
                                    <input type="hidden" name="pre_order_expected_date" value="${this.variantMetafield?.pre_order_expected_date}">`;
              this.toggleAddButton(false, type); 
            }else{
              html =`<div class="bc-order-wrapper sold-out-card">
                        <h2 class="title">Sold Out</h3>
                        <p class="message">Sorry, ${this.currentVariant?.name.replace(this.currentVariant?.title, '')} is sold out in size ${this.currentVariant?.title}.</p>`;
              
              this.toggleAddButton(true, variantStrings.soldOut);
            }
          } else if (this.variantMetafield?.type === 'coming_soon'){
            const monthNames = ["","January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            const customDate = this.variantMetafield?.pre_order_expected_date.split('-');
            const currentYear = new Date().getFullYear();
            let launchDate = '';
            if(customDate[0]*1 == currentYear){
                launchDate = monthNames[customDate[1]*1] + ' ' + customDate[2]+'th';
            }else{
                launchDate = monthNames[customDate[1]*1] +' '+customDate[2]+'th, ' + customDate[0];
            }
            html += customDate 
            ? `<p class="message">Launches ${launchDate}</p>`
            : '';
            this.closest('.j-upsell-variant-wraper').querySelector('#bc-order-id').innerHTML = '';
          } else {
            html += `<p class="message">Sorry, ${this.currentVariant?.name.replace(this.currentVariant?.title, '')} is sold out in size ${this.currentVariant?.title}.</p>`;
            this.closest('.j-upsell-variant-wraper').querySelector('#bc-order-id').innerHTML = '';
            this.setUnavailable();
          }
          html += `</div>`;
          this.closest('.j-upsell-variant-wraper').querySelector('#preorderbunner').innerHTML = html;
        }
  
      });
    }
  
    toggleAddButton(disable = true, text, modifyClass = true) {      
      const addButton = this.closest('.j-upsell-variant-wraper')?.querySelector('[name="add"]');
      if (!addButton) return;
  
      if (disable) {
        addButton.setAttribute('disabled', true);
        addButton.classList.add('bc-sold-out');
        if (text) addButton.querySelector('span').textContent = text;
      } else {
        addButton.removeAttribute('disabled');
        addButton.classList.remove('bc-sold-out');
        if (text) addButton.querySelector('span').textContent = text;
      }
  
      if (!modifyClass) return;
    }
  
    setUnavailable() {
      const addButton = this.closest('.j-upsell-variant-wraper')?.querySelector('[name="add"]');
      if (!addButton) return;
      addButton.querySelector('span').textContent = window.variantStrings.unavailable;
      document.getElementById(`price-${this.dataset.section}`)?.classList.add('visibility-hidden');
    }
  
    getVariantData() {
      this.variantData = this.variantData || JSON.parse(this.querySelector('[type="application/json"]').textContent);
      return this.variantData;
    }
  
    getVariantMetafields() {
      this.variantMetafields = this.variantMetafields || JSON.parse(this.querySelector("#product-variants-metafields").textContent);
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
  
  customElements.define('upsell-variant-selects', UpsellVariantSelects);
  
class VariantSelects extends HTMLElement {
    constructor() {
      super();
      this.addEventListener('change', this.onVariantChange);
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
        this.updateURL();
        this.updateVariantInput();
        this.renderProductInfo();
      }      
    }

    updateStikcyButton() {
      document.querySelector('.js-sticky-atc').innerHTML = document.querySelector('.product-form__buttons .product-form__submit').innerHTML; 
      document.querySelectorAll(".product-form__input input[type='radio']:checked + label").forEach((item,index)=>{
        document.querySelector('.sticky-options-wraper:nth-child('+(1+index)+') .selected-value').innerHTML = item.innerHTML;
      });
    }
  
    updateOptions() {
      this.options = Array.from(this.querySelectorAll('select'), (select) => select.value);      
    }
  
    updateMasterId() {
      this.currentVariant = this.getVariantData().find((variant) => {
        return !variant.options.map((option, index) => {
          return this.options[index] === option;
        }).includes(false);
      });
      if(!this.currentVariant) return;
      this.cuurentMetafield = this.getVariantMetafields().find(meta => meta[this.currentVariant.id] !== undefined);
      this.variantMetafield = this.cuurentMetafield[this.currentVariant.id];
    }
  
    updateMedia() {
      if (!this.currentVariant || !this.currentVariant?.featured_media) return; 
      if(this.closest('.main-product-section').querySelector('.product__media-wrapper').getAttribute('update-media')){           
        if(this.closest('.main-product-section').querySelector('.product__media-wrapper').getAttribute('data-sample-alt').indexOf('/') > 0){
          if(this.closest('.main-product-section').querySelectorAll('.product__media-item[data-variant-option="'+this.currentVariant.title.replaceAll('"','')+'"]').length == 0) return;
          this.closest('.main-product-section').querySelectorAll('.product__media-item:not(.hidden)').forEach(item=>{
            item.classList.add('hidden');
          });
          this.closest('.main-product-section').querySelectorAll('.product__media-item[data-variant-option="'+this.currentVariant.title.replaceAll('"','')+'"]').forEach(item=>{
            item.classList.remove('hidden');
          })
        }else{
          this.closest('.main-product-section').querySelectorAll('.product__media-item:not(.hidden)').forEach(item=>{
            item.classList.add('hidden');
          });
          if(this.currentVariant.option1){
            this.closest('.main-product-section').querySelectorAll('.product__media-item[data-variant-option="'+this.currentVariant.option1.replaceAll('"','')+'"]').forEach(item=>{
              item.classList.remove('hidden');
            });
          }
          if(this.currentVariant.option2){
            this.closest('.main-product-section').querySelectorAll('.product__media-item[data-variant-option="'+this.currentVariant.option2.replaceAll('"','')+'"]').forEach(item=>{
              item.classList.remove('hidden');
            })
          }
        }
      } 
      // const newMedia = document.querySelector(
      //   `[data-media-id="${this.dataset.section}-${this.currentVariant.featured_media.id}"]`
      // );
      // if (!newMedia) return;
      // const parent = newMedia.parentElement;
      // parent.prepend(newMedia);
      //window.setTimeout(() => { parent.scroll(0, 0) });
    }
  
    updateURL() {
      if (!this.currentVariant || this.dataset.updateUrl === 'false') return;
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set("variant", this.currentVariant.id);
      window.history.replaceState({ path: newUrl.toString() }, "", newUrl.toString());
    }
  
    updateVariantInput() {
      const productForms = this.closest('.product__info-container ').querySelectorAll(`#product-form-${this.dataset.section}, #product-form-installment`);
      productForms.forEach((productForm) => {
        const input = productForm.querySelector('input[name="id"]');
        input.value = this.currentVariant.id;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      });
    }
  
    updatePickupAvailability() {
      const pickUpAvailability = this.closest('.product__info-container ').querySelector('pickup-availability');
      if (!pickUpAvailability) return;
  
      if (this.currentVariant?.available) {
        pickUpAvailability.fetchAvailability(this.currentVariant.id);	
      } else {
        this.closest('.product__info-container ').querySelector('.pickup-card-wrapper').classList.remove('available');
        pickUpAvailability.removeAttribute('available');
        pickUpAvailability.innerHTML = '';
      }
    }
  
    renderProductInfo() {
      fetch(`${this.dataset.url}?variant=${this.currentVariant.id}&section_id=${this.dataset.section}`)
        .then((response) => response.text())
        .then((responseText) => {
          const id = `price-${this.dataset.section}`;
          const html = new DOMParser().parseFromString(responseText, 'text/html')
          const destination = document.getElementById(id);
          const source = html.getElementById(id);
          if (source && destination) destination.innerHTML = source.innerHTML;
  
        document.getElementById(`price-${this.dataset.section}`)?.classList.remove('visibility-hidden');
        if(this.currentVariant.available){ 
          this.toggleAddButton(false, variantStrings.addToCart);
          this.closest('.product__info-container ').querySelector('#preorderbunner').innerHTML = '';
          this.closest('.product__info-container ').querySelector('#bc-order-id').innerHTML = '';  
          
          if(this.variantMetafield?.inventory_quantity < 50 ){
            this.closest('.product__info-container ').querySelector('.harry-up-note').innerText = "This color is selling fast, get yours today!";
          }else{
            this.closest('.product__info-container ').querySelector('.harry-up-note').innerText = "";
          }
        } else { 
          this.toggleAddButton(true, variantStrings.soldOut);
          let htmlNew = `<div class="bc-order-wrapper sold-out-card">
                        <h2 class="title">Sold Out</h3>
                        <p class="message">Sorry, ${this.currentVariant?.name.replace(this.currentVariant?.title, '')} is sold out in size ${this.currentVariant?.title}.</p>
                      </div>`;
          this.closest('.product__info-container ').querySelector('#preorderbunner').innerHTML = htmlNew; 
          //this.closest('.product__info-container ').querySelector('.harry-up-note').innerText = "Expected to ship week of Sept 28!";
        }
        
        if(this.variantMetafield?.type !== undefined && this.variantMetafield?.inventory_quantity < 1 && this.currentVariant.available){
          const type = this.variantMetafield?.type.split('_').join(' ');
          let html = `<div class="bc-order-wrapper"><h2 class="title">${type}</h3>`;
          if(this.variantMetafield?.type === 'pre_order'){
            if(this.variantMetafield?.pre_order_inventory_quantity*1 > 0){
              html += `<p class="message">${this.currentVariant.name} ${this.variantMetafield?.pre_order}.</p>${this.getPreOrderModal(this.variantMetafield?.pre_order_expected_date)}`;
              this.closest('.product__info-container ').querySelector('#bc-order-id').innerHTML = `<input type="hidden" name="pre" value="order">
                                    <input type="hidden" name="pre_order_announcement" value="${this.variantMetafield?.pre_order}">
                                    <input type="hidden" name="pre_order_expected_date" value="${this.variantMetafield?.pre_order_expected_date}">`;
              this.toggleAddButton(false, type); 
            }else{
              html =`<div class="bc-order-wrapper sold-out-card">
                        <h2 class="title">Sold Out</h3>
                        <p class="message">Sorry, ${this.currentVariant?.name.replace(this.currentVariant?.title, '')} is sold out in size ${this.currentVariant?.title}.</p>`;
              this.closest('.product__info-container ').querySelector('.klaviyo-bis-trigger').style.display = "flex";
              this.toggleAddButton(true, variantStrings.soldOut);
            }
          } else if (this.variantMetafield?.type === 'coming_soon'){
            const monthNames = ["","January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            const customDate = this.variantMetafield?.pre_order_expected_date.split('-');
            const currentYear = new Date().getFullYear();
            let launchDate = '';
            if(customDate[0]*1 == currentYear){
                launchDate = monthNames[customDate[1]*1] + ' ' + customDate[2]+'th';
            }else{
                launchDate = monthNames[customDate[1]*1] +' '+customDate[2]+'th, ' + customDate[0];
            }
            html += customDate 
            ? `<p class="message">Launches ${launchDate}</p>`
            : '';
            this.closest('.product__info-container ').querySelector('#bc-order-id').innerHTML = '';
          } else {
            html += `<p class="message">Sorry, ${this.currentVariant?.name.replace(this.currentVariant?.title, '')} is sold out in size ${this.currentVariant?.title}.</p>`;
            this.closest('.product__info-container ').querySelector('#bc-order-id').innerHTML = '';
            this.setUnavailable();
          }
          html += `</div>`;
          this.closest('.product__info-container ').querySelector('preorderbunner').innerHTML = html;
        }

        if(document.querySelector('.js-sticky-atc')){
          this.updateStikcyButton();
        }
  
      });
    }
  
    toggleAddButton(disable = true, text, modifyClass = true) {      
      const addButton = document.getElementById(`product-form-${this.dataset.section}`)?.querySelector('[name="add"]');
      if (!addButton) return;
  
      if (disable) {
        addButton.setAttribute('disabled', true);
        addButton.classList.add('bc-sold-out');
        if (text) addButton.querySelector('span.product-form__submit-label').textContent = text;
      } else {
        addButton.removeAttribute('disabled');
        addButton.classList.remove('bc-sold-out');
        if (text) addButton.querySelector('span.product-form__submit-label').textContent = text;
      }
  
      if (!modifyClass) return;
    }
  
    setUnavailable() {
      const addButton = document.getElementById(`product-form-${this.dataset.section}`)?.querySelector('[name="add"]');
      if (!addButton) return;
      addButton.querySelector('span.product-form__submit-label').textContent = window.variantStrings.unavailable;
      document.getElementById(`price-${this.dataset.section}`)?.classList.add('visibility-hidden');
    }
  
    getVariantData() {
      this.variantData = this.variantData || JSON.parse(this.querySelector('[type="application/json"]').textContent);
      return this.variantData;
    }
  
    getVariantMetafields() {
      this.variantMetafields = this.variantMetafields || JSON.parse(this.querySelector("#product-variants-metafields").textContent);
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
  
  customElements.define('variant-selects', VariantSelects);
  
  class VariantRadios extends VariantSelects {
    constructor() {
      super();
    }
  
    updateOptions() {
      const fieldsets = Array.from(this.querySelectorAll('fieldset'));
      var option_index = 0;
      this.options = fieldsets.map((fieldset) => {
        if(fieldset.querySelector('.selected-value') != null){
            fieldset.querySelector('.selected-value').innerText = Array.from(fieldset.querySelectorAll('input')).find((radio) => radio.checked).value;              
            if(fieldset.getAttribute('product-option').indexOf('olor') >= 0 && this.closest('.main-product-section').querySelector('#media-option-style') != null){
               this.closest('.main-product-section').querySelector('#media-option-style').innerText = '.product__media-item.grid__item.alt-'+Array.from(fieldset.querySelectorAll('input')).find((radio) => radio.checked).value + '{display:block;}';
            }
            return Array.from(fieldset.querySelectorAll('input')).find((radio) => radio.checked).value;
        }
      });   
      
      if(fieldsets.length == 2){
        this.querySelectorAll('input').forEach(item=>{
          item.disabled = true;
        })
        const possibleVariants1 = this.getVariantData().filter(variant => variant.option1 === this.options[0])
        for (let index = 0; index < possibleVariants1.length; index++) {
          const variant = possibleVariants1[index]
          this.querySelector(`[value='${variant.option2}']`).disabled = false;                
        }
        const possibleVariants2 = this.getVariantData().filter(variant => variant.option2 === this.options[1])
        for (let index = 0; index < possibleVariants2.length; index++) {
          const variant = possibleVariants2[index]
          this.querySelector(`[value='${variant.option1}']`).disabled = false;                
        }
      }
    }
  }
  
  customElements.define('variant-radios', VariantRadios);

class BundleVariantSelects extends HTMLElement {
    constructor() {
      super();
      this.addEventListener('change', this.onVariantChange);
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
        this.updateURL();
        this.updateVariantInput();
        this.renderProductInfo();
      }
    }
  
    updateOptions() {
      this.options = Array.from(
        this.querySelectorAll('select'),
        (select) => select.value
      );
    }
  
    updateMasterId() {
      this.currentVariant = this.getVariantData().find((variant) => {
        return !variant.options
          .map((option, index) => {
            return this.options[index] === option;
          })
          .includes(false);
      });
      if (!this.currentVariant) return;
      this.cuurentMetafield = this.getVariantMetafields().find(
        (meta) => meta[this.currentVariant.id] !== undefined
      );
      this.variantMetafield = this.cuurentMetafield[this.currentVariant.id];
    }
  
    updateMedia() {
      if (!this.currentVariant || !this.currentVariant?.featured_media) return;
      if (
        this.closest('.main-product-section')
          .querySelector('.product__media-wrapper')
          .getAttribute('update-media')
      ) {
        if (
          this.closest('.main-product-section')
            .querySelector('#MediaGallery-'+this.dataset.section)
            .getAttribute('data-sample-alt')
            .indexOf('/') > 0
        ) {
          if (
            this.closest('.main-product-section').querySelector('#MediaGallery-'+this.dataset.section).querySelectorAll(
              '.product__media-item[data-variant-option="' +
                this.currentVariant.title.replaceAll('"', '') +
                '"]'
            ).length == 0
          )
            return;
          this.closest('.main-product-section').querySelector('#MediaGallery-'+this.dataset.section)
            .querySelectorAll('.product__media-item:not(.hidden)')
            .forEach((item) => {
              item.classList.add('hidden');
            });
          this.closest('.main-product-section').querySelector('#MediaGallery-'+this.dataset.section)
            .querySelectorAll(
              '.product__media-item[data-variant-option="' +
                this.currentVariant.title.replaceAll('"', '') +
                '"]'
            )
            .forEach((item) => {
              item.classList.remove('hidden');
            });
        } else {
          this.closest('.main-product-section').querySelector('#MediaGallery-'+this.dataset.section)
            .querySelectorAll('.product__media-item:not(.hidden)')
            .forEach((item) => {
              item.classList.add('hidden');
            });
          if (this.currentVariant.option1) {
            this.closest('.main-product-section').querySelector('#MediaGallery-'+this.dataset.section)
              .querySelectorAll(
                '.product__media-item[data-variant-option="' +
                  this.currentVariant.option1.replaceAll('"', '') +
                  '"]'
              )
              .forEach((item) => {
                item.classList.remove('hidden');
              });
          }
          if (this.currentVariant.option2) {
            this.closest('.main-product-section').querySelector('#MediaGallery-'+this.dataset.section)
              .querySelectorAll(
                '.product__media-item[data-variant-option="' +
                  this.currentVariant.option2.replaceAll('"', '') +
                  '"]'
              )
              .forEach((item) => {
                item.classList.remove('hidden');
              });
          }
        }
      }      
    }
  
    updateURL() {
      if (!this.currentVariant || this.dataset.updateUrl === 'false') return;
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set("variant", this.currentVariant.id);
      window.history.replaceState({ path: newUrl.toString() }, "", newUrl.toString());
    }
  
    updateVariantInput() {
      const productForms = this.closest('.product__info-container ').querySelectorAll(
        `#product-form-${this.dataset.section}, #product-form-installment`
      );
      productForms.forEach((productForm) => {
        const input = productForm.querySelector('input[name="id"]');
        input.value = this.currentVariant.id;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      });
    }
  
    updatePickupAvailability() {
      const pickUpAvailability = this.closest('.product__info-container ').querySelector(
        'pickup-availability'
      );
      if (!pickUpAvailability) return;
  
      if (this.currentVariant?.available) {
        pickUpAvailability.fetchAvailability(this.currentVariant.id);
      } else {
        this.closest('.product__info-container ')
          .querySelector('.pickup-card-wrapper')
          .classList.remove('available');
        pickUpAvailability.removeAttribute('available');
        pickUpAvailability.innerHTML = '';
      }
    }
  
    renderProductInfo() {
      fetch(
        `${this.dataset.url}?variant=${this.currentVariant.id}&section_id=${this.dataset.tsection}`
      )
        .then((response) => response.text())
        .then((responseText) => {
          const id = `#price-${this.dataset.tsection}`;
          const html = new DOMParser().parseFromString(responseText, 'text/html');
          const destination = this.closest('.product__info-container ').querySelector(id);
          const source = html.querySelector('product-info[data-section="'+this.dataset.section+'"] '+id);
          if (source && destination) destination.innerHTML = source.innerHTML;
  
          this.closest('.product__info-container ').querySelector(`#price-${this.dataset.tsection}`)
            ?.classList.remove('visibility-hidden');
          var total_compair = 0;
          var total_regular = 0;
          this.closest('.bundle-info-inner-wraper').querySelectorAll('product-info').forEach(item=>{
            total_compair += item.querySelector('.price__compare .price-item').innerText.replace('$','')*1;
            total_regular += item.querySelector('.price__last .price-item--sale').innerText.replace('$','')*1;
          })
          this.closest('.bundle-info-inner-wraper').querySelector('.bundle-price-wraper .price__compare').innerText = "$"+total_compair.toFixed(2);
          this.closest('.bundle-info-inner-wraper').querySelector('.bundle-price-wraper .price__regular').innerText = "$"+total_regular.toFixed(2);
          if (this.currentVariant.available) {
            this.toggleAddButton(false, variantStrings.addToCart);
            this.closest('.product__info-container ').querySelector(
              '#preorderbunner'
            ).innerHTML = '';
            this.closest('.product__info-container ').querySelector('#bc-order-id').innerHTML =
              '';
          } else {
            this.toggleAddButton(true, variantStrings.soldOut);
            let htmlNew = `<div class="bc-order-wrapper sold-out-card">
                        <h2 class="title">Sold Out</h3>
                        <p class="message">Sorry, ${this.currentVariant?.name.replace(
                          this.currentVariant?.title,
                          ''
                        )} is sold out in size ${this.currentVariant?.title}.</p>
                      </div>`;
            this.closest('.product__info-container ').querySelector(
              '#preorderbunner'
            ).innerHTML = htmlNew;
          }
  
          if (
            this.variantMetafield?.type !== undefined &&
            this.variantMetafield?.inventory_quantity < 1 &&
            this.currentVariant.available
          ) {
            const type = this.variantMetafield?.type.split('_').join(' ');
            let html = `<div class="bc-order-wrapper"><h2 class="title">${type}</h3>`;
            if (this.variantMetafield?.type === 'pre_order') {
              if (this.variantMetafield?.pre_order_inventory_quantity * 1 > 0) {
                html += `<p class="message">${this.currentVariant.name} ${
                  this.variantMetafield?.pre_order
                }.</p>${this.getPreOrderModal(
                  this.variantMetafield?.pre_order_expected_date
                )}`;
                this.closest('.product__info-container ').querySelector(
                  '#bc-order-id'
                ).innerHTML = `<input type="hidden" name="pre" value="order">
                                    <input type="hidden" name="pre_order_announcement" value="${this.variantMetafield?.pre_order}">
                                    <input type="hidden" name="pre_order_expected_date" value="${this.variantMetafield?.pre_order_expected_date}">`;
                this.toggleAddButton(false, type);
              } else {
                html = `<div class="bc-order-wrapper sold-out-card">
                        <h2 class="title">Sold Out</h3>
                        <p class="message">Sorry, ${this.currentVariant?.name.replace(
                          this.currentVariant?.title,
                          ''
                        )} is sold out in size ${
                  this.currentVariant?.title
                }.</p>`;
                this.closest('.product__info-container ').querySelector(
                  '.klaviyo-bis-trigger'
                ).style.display = 'flex';
                this.toggleAddButton(true, variantStrings.soldOut);
              }
            } else if (this.variantMetafield?.type === 'coming_soon') {
              const monthNames = [
                '',
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December',
              ];
              const customDate =
                this.variantMetafield?.pre_order_expected_date.split('-');
              const currentYear = new Date().getFullYear();
              let launchDate = '';
              if (customDate[0] * 1 == currentYear) {
                launchDate =
                  monthNames[customDate[1] * 1] + ' ' + customDate[2] + 'th';
              } else {
                launchDate =
                  monthNames[customDate[1] * 1] +
                  ' ' +
                  customDate[2] +
                  'th, ' +
                  customDate[0];
              }
              html += customDate
                ? `<p class="message">Launches ${launchDate}</p>`
                : '';
              this.closest('.product__info-container ').querySelector(
                '#bc-order-id'
              ).innerHTML = '';
            } else {
              html += `<p class="message">Sorry, ${this.currentVariant?.name.replace(
                this.currentVariant?.title,
                ''
              )} is sold out in size ${this.currentVariant?.title}.</p>`;
              this.closest('.product__info-container ').querySelector(
                '#bc-order-id'
              ).innerHTML = '';
              this.setUnavailable();
            }
            html += `</div>`;
            this.closest('.product__info-container ').querySelector(
              'preorderbunner'
            ).innerHTML = html;
          }
        });
    }
  
    toggleAddButton(disable = true, text, modifyClass = true) {
      const addButton = this.closest('.product__info-wrapper').querySelector('.add_bundle_item');
      if (!addButton) return;
  
      if (disable) {
        addButton.setAttribute('disabled', true);
        addButton.classList.add('bc-sold-out');
        if (text)
          addButton.querySelector('span.product-form__submit-label').textContent =
            text;
      } else {
        addButton.removeAttribute('disabled');
        addButton.classList.remove('bc-sold-out');
        if (text)
          addButton.querySelector('span.product-form__submit-label').textContent =
            text;
      }
  
      if (!modifyClass) return;
    }
  
    setUnavailable() {
      const addButton = this.closest('.product__info-wrapper').querySelector('.add_bundle_item');
      if (!addButton) return;
      addButton.querySelector('span.product-form__submit-label').textContent =
        window.variantStrings.unavailable;
      document
        .getElementById(`price-${this.dataset.section}`)
        ?.classList.add('visibility-hidden');
    }
  
    getVariantData() {
      this.variantData =
        this.variantData ||
        JSON.parse(this.querySelector('[type="application/json"]').textContent);
      return this.variantData;
    }
  
    getVariantMetafields() {
      this.variantMetafields =
        this.variantMetafields ||
        JSON.parse(
          this.querySelector('#product-variants-metafields').textContent
        );
      return this.variantMetafields;
    }
  
    getPreOrderModal(date) {
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
  
  customElements.define('bundle-variant-selects', BundleVariantSelects);
  
  class BundleVariantRadios extends BundleVariantSelects {
    constructor() {
      super();
    }
  
    updateOptions() {
      const fieldsets = Array.from(this.querySelectorAll('fieldset'));
      this.options = fieldsets.map((fieldset) => {
        if (fieldset.querySelector('.selected-value') != null) {
          fieldset.querySelector('.selected-value').innerText = Array.from(
            fieldset.querySelectorAll('input')
          ).find((radio) => radio.checked).value;
          if (
            fieldset.getAttribute('product-option').indexOf('olor') >= 0 &&
            this.closest('.main-product-section').querySelector(
              '#media-option-style'
            ) != null
          ) {
            this.closest('.main-product-section').querySelector(
              '#media-option-style'
            ).innerText =
              '.product__media-item.grid__item.alt-' +
              Array.from(fieldset.querySelectorAll('input')).find(
                (radio) => radio.checked
              ).value +
              '{display:block;}';
          }
          return Array.from(fieldset.querySelectorAll('input')).find(
            (radio) => radio.checked
          ).value;
        }
      });
    }
  }
  
  customElements.define('bundle-variant-radios', BundleVariantRadios);