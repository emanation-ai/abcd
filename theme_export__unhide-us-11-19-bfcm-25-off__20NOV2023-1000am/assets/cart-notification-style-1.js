class CartNotification extends HTMLElement {
  constructor() {
    super();

    this.items = ``;
    this.cartItemsWrapper = document.querySelector('#cart-notification-product');
    this.notification = document.getElementById('cart-notification');
    this.header = document.querySelector('sticky-header');
    this.onBodyClick = this.handleBodyClick.bind(this);

    this.notification.addEventListener('keyup', (evt) => evt.code === 'Escape' && this.close());
    this.querySelectorAll('button[type="button"]')?.forEach((closeButton) =>
      closeButton.addEventListener('click', this.close.bind(this))
    );
    this.cartHref = document.querySelector('#cart-icon-bubble');
    this.cartHref?.addEventListener('click', this.init.bind(this));
    this.cartCount = document.querySelector('#cart-count');
    this.cartShipping = document.querySelector('.bc-free-shipping-wrapper');
    this.shippingPrice = this.cartShipping?.getAttribute('data-price') + '00';
    this.shippingCurrency = this.cartShipping?.getAttribute('data-currency');
    this.lessPackaging = this.querySelector('input[type="checkbox"]#less-packaging');
    this.shippingInsurance = this.querySelector('input[type="checkbox"]#shipping-insurance');
    localStorage.setItem("removeInsurance", false);
    this.shippingInsuranceId = this.shippingInsurance?.value;
    if(this.shippingInsurance?.getAttribute('data-auto') === 'true' && localStorage.getItem("visited") === null){
      this.insurance(this.shippingInsurance, true);
      localStorage.setItem("visited", true);
    }
    this.lessPackaging?.addEventListener('change', this.packaging.bind(this));
    this.shippingInsuranceId && this.shippingInsurance?.addEventListener('change', this.insurance.bind(this));
  }

  init(event){

    event.preventDefault();
    this.getCart();

  }

  open() {

    this.notification.classList.add('animate', 'active');
    document.querySelector('body').classList.add('no-overflow');
    this.notification.addEventListener('transitionend', () => {
      this.notification.focus();
      trapFocus(this.notification);
    }, { once: true });
    document.body.addEventListener('click', this.onBodyClick);

  }

  close() {
    document.querySelector('body').classList.remove('no-overflow');
    this.notification.classList.remove('active');
    document.body.removeEventListener('click', this.onBodyClick);
    removeTrapFocus(this.activeElement);

  }

  packaging(event){

    let el = event.target;
    let data = {
      attributes: {}
    };

    if(!el) return;

    if(el?.checked){
      el.value ? data.note = el.value : null;
      data.attributes.lessPackaging = true;
    } else {
      el.value ? data.note = "" : null;
      data.attributes.lessPackaging = false;
    }

    this.updateItem(data);

  }

  insurance(event, first=false){

    if(!event) return;
    if(first) return this.addItem(this.shippingInsuranceId);
    let el = event.target;
    if(el.checked){
      this.addItem(this.shippingInsuranceId);
      localStorage.setItem("removeInsurance", false);
    }
    else{
      this.changeItem(this.shippingInsuranceId);
      localStorage.setItem("removeInsurance", true);
    } 

  }

  updateItem(data){
    this.notification.classList.add('loading');
    fetch(`${routes.cart_update_url}`, {...fetchConfig('javascript'), body: JSON.stringify(data)})
      .then((response) => response.json())
      .then((data) => this.renderCart(data))
      .catch((e) => console.error(e))
      .finally(() => {
        this.cartItemsWrapper.innerHTML = this.items;
        this.notification.classList.remove('loading');
        this.removeBtnInit();
      });
  }

  addItem(id){
    this.notification.classList.add('loading');
    fetch(`${routes.cart_add_url}`, {...fetchConfig('javascript'), body: JSON.stringify({'id': id,'quantity': 1})})
      .then((response) => response.json())
      .then((data) => this.getCart(true))
      .catch((e) => console.error(e))
      .finally(() => {});
  }

  changeItem(id, childID, qty = 0){
    this.notification.classList.add('loading');
    fetch(`${routes.cart_change_url}`, {...fetchConfig('javascript'), body: JSON.stringify({'id': id,'quantity': qty})})
    .then((response) => response.json())
    .then((data) => {
      if(!childID || childID === 'undefined') return this.renderCart(data);
      let findGiftproducts = data.items.find(item => item.properties._gift_id === childID);
      findGiftproducts && findGiftproducts !== undefined ? this.renderCart(data) : this.changeItem(childID);
    })
    .catch((e) => console.error(e))
    .finally(() => {
      this.cartItemsWrapper.innerHTML = this.items;
      this.notification.classList.remove('loading');
      this.removeBtnInit();
    });
  }

  minusItem(event){
    if(!event?.target) return;
    let el = event.target;
    let key = el.getAttribute('data-key');
    let qty = el.getAttribute('data-qty');
    let childId = el.getAttribute('data-child');
    let newQty = parseInt(qty) - 1;
    this.changeItem(key, childId, newQty);
  }

  plusItem(event){
    if(!event?.target) return;
    let el = event.target;
    let key = el.getAttribute('data-key');
    let qty = el.getAttribute('data-qty');
    let childId = el.getAttribute('data-child');
    let newQty = parseInt(qty) + 1;
    this.changeItem(key, childId, newQty);
  }

  getCart(loading=false){
    fetch(`${routes.cart_url}`, {...fetchConfigGet('javascript')})
    .then(response => response.json())
    .then(data => this.renderCart(data))
    .catch(e => console.error(e))
    .finally(() => {      
      this.open();
      this.removeBtnInit();
      loading ? this.notification.classList.remove('loading') : null;
    });
  }

  renderCart(data){

    if(!data)  return;    
    this.items = '';    
    this.getCartAttributes(data?.attributes);
    
    this.getSubtotalPrice(data.original_total_price, data.total_price, data.cart_level_discount_applications);
    this.getCartItemsCount(data?.item_count);

    var cart_total = data.original_total_price;
    if(data?.items.length == 1 && data?.items[0].product_id == 7981135036658){
      cart_total -= data?.items[0].price - 8500;
      console.log(cart_total);
    }    

    if(!data?.items?.length){
      document.querySelector('.cart-upsells-wrapper').style.display = 'none'; 
      this.shippingPrice ? this.freeShippingBar(cart_total) : null;
      this.cartItemsWrapper.innerHTML = this.getNotProductMessage();
      return this.items += this.getNotProductMessage();
    }

    data?.items?.map(item => {
      console.log(item.variant_id + '-'+ item.quantity )
      this.items += this.renderItem(item);
    });  

    this.cartItemsWrapper.innerHTML = this.items;
    this.removeBtnInit();
    this.shippingPrice ? this.freeShippingBar(cart_total) : null;
    
    if(data?.items.length>0){      
      document.querySelector('.cart-upsells-wrapper').style.display = 'block';
      var upsell_id = data?.items[0].product_id;
      console.log(data?.items[0]);
      var upsell_handle = data?.items[0].handle;
      var target_collection = "/collections/all?view=upsells";
      
      if(upsell_handle == "lil-marsh" || upsell_handle == "lusso-cloud-x-unhide-pelli" || upsell_handle == "squish-back-rest"){
        target_collection = "/collections/cart-upsell-1?view=upsells";
      }else if(upsell_handle == "floof" || upsell_handle == "lil-marsh-xs-pet" || upsell_handle == "floof-pillow-bed"){
        target_collection = "/collections/cart-upsell-2?view=upsells";
      }else if(upsell_handle == "netflix-lil-marsh"){
        target_collection = "/collections/cart-upsell-3?view=upsells";
      }else if(upsell_handle == "thesquish" || upsell_handle == "marsh-2-0"){
        target_collection = "/collections/cart-upsell-4?view=upsells";
      }else if(upsell_handle == "braided-m-beige"){
        target_collection = "/collections/cart-upsell-5?view=upsells";
      }else if(upsell_handle == "baby-onesie" || upsell_handle == "lil-marsh-lovey-blanket"){
        target_collection = "/collections/cart-upsell-6?view=upsells";
      }else if(upsell_handle == "shleepy" ){
        target_collection = "/collections/cart-upsell-7?view=upsells";
      }else if(data?.items[0].product_type == "Bundles"){
        target_collection = "/collections/bundles?view=upsells";
      }
      fetch(window.location.origin + target_collection).then(async (response)=>{
        var temp = document.createElement("html");        
        temp.innerHTML = await response.text();
        data?.items.forEach(item=>{
          temp.querySelector('.j-upsell-item[data-id="'+item.product_id+'"]')?.remove();
        })
        
        if(temp.querySelector('.j-upsell-item')){
          document.querySelector('.cart-upsells-row').innerHTML = temp.querySelector('.j-upsell-items').innerHTML;
          // document.querySelectorAll('.cart-upsells-row .j-upsell-item').forEach(item=>{
          //   item.style.order = Math.floor(Math.random() * 20) + 1;
          // })
        }          
      })
        
    } 

  }

  freeShippingBar(total){
    if(this.cartShipping != null ){      
      console.log(this.shippingCurrency.indexOf(Shopify.currency.active));
      if(this.shippingCurrency.indexOf(Shopify.currency.active) === -1){
        this.cartShipping.classList.add('hidden');
        return;
      } else {
        this.cartShipping.classList.remove('hidden');
      } 
  
      let el = this.querySelector('.bc-free-shipping-wrapper__text');
      let sucsess = this.querySelector('.bc-free-shipping-wrapper__success-text');
      let progressEl = this.querySelector('.bc-free-shipping-bar__progress');
      
      let shippingPriceCurrency = Currency.convert(this.shippingPrice, 'USD', Shopify.currency.active);
      //let shippingPriceCurrency = this.shippingPrice;  
     
      const _discount_steps = parseInt(document.querySelector('#cart-notification').getAttribute('data-discount-steps'));
      var _discount_settings = [];
      for (let step = 1; step <= _discount_steps; step++) {
        let _discount_setting = [];
        let _discount_title = document.querySelector('#cart-notification').getAttribute(`data-discount-title-${step}`);
        let _discount_price = parseInt(document.querySelector('#cart-notification').getAttribute(`data-discount-price-${step}`)) * 100;
        _discount_setting.push(_discount_title, _discount_price);
        _discount_settings.push(_discount_setting);
      } 
      var max_price = Currency.convert(_discount_settings[_discount_settings.length-1][1], 'USD', Shopify.currency.active);
      if(total > 0 ){
        if(total >= max_price){
          if(_discount_settings.length == 1){
            el.classList.remove('active');
          }else{
            sucsess.querySelector('.active-dis-step').innerHTML = '+ '+_discount_settings[_discount_settings.length-1][0];
          }                
          sucsess.classList.add('active');
          el.innerHTML = '<span class="remain-price"></span><span class="target-step"></span>You got ' + _discount_settings[_discount_settings.length-1][0];
          progressEl ? progressEl.style.width = '100%': null; 
          document.querySelectorAll('.free-gift-item-wraper').forEach(item=>{
            item.style.display = 'none';            
            let item_id = item.getAttribute('data-id');
            if(document.querySelector('.bc-cart__item[data-id="'+item_id+'"]')){
              item.querySelector('.upd-add-btn').setAttribute('disabled','disabled');
              item.querySelector('.upd-add-btn').style.display='none';
              item.querySelector('product-form input').value = 0;
              item.querySelector('.gift-remain-note').innerText = 'You have free gift.';
            }else{
              item.querySelector('.upd-add-btn').removeAttribute('disabled');
              item.querySelector('.upd-add-btn').style.display='block';
              item.querySelector('product-form input').value = item_id;
              item.querySelector('.gift-remain-note').innerText = 'Please get your free gift';
            }
            
          })
          document.querySelector('.free-gift-item-wraper:last-child')?document.querySelector('.free-gift-item-wraper:last-child').style.display = 'flex':null;
          
          return;
        } else {
          var check_step = true; 
          if(_discount_steps == 1){
            let current_step = Currency.convert(_discount_settings[0][1], 'USD', Shopify.currency.active);            
            if(total < current_step && check_step){
              var newPrice = current_step - total; /* for free shipping */
              el.innerHTML = 'Spend <span class="remain-price"></span> more to get <span class="target-step"></span>';
              let percent = (100 * total) / max_price;
              let priceEl = el?.querySelector('.remain-price');
              let targetEl = el?.querySelector('.target-step');
              progressEl ? progressEl.style.width = percent + '%': null;
              
              priceEl ? priceEl.innerHTML = Shopify.formatMoney(newPrice).split('.')[0] + ' ' + Shopify.currency.active : null; /* for free shipping */ 
              targetEl ? targetEl.innerHTML = _discount_settings[0][0]:null; 
              sucsess.classList.remove('active');
              el.classList.add('active');
              return;
            }            
          }
          for(let i = 1; i <= _discount_steps; i ++ ){
            let current_step = Currency.convert(_discount_settings[i-1][1], 'USD', Shopify.currency.active);
            if(total < current_step && check_step){
              var newPrice = current_step - total; /* for free shipping */
              el.innerHTML = 'Spend <span class="remain-price"></span> more to get <span class="target-step"></span>';
              let percent = (100 * total) / max_price;
              let priceEl = el?.querySelector('.remain-price');
              let targetEl = el?.querySelector('.target-step');
              progressEl ? progressEl.style.width = percent + '%': null;
              
              priceEl ? priceEl.innerHTML = Shopify.formatMoney(newPrice).split('.')[0] : null; /* for free shipping */ 
              targetEl ? targetEl.innerHTML = _discount_settings[i-1][0]:null;  
              if(i>2){
                sucsess.querySelector('.active-dis-step').innerHTML = '+ '+_discount_settings[i-2][0];
              }else{
                sucsess.querySelector('.active-dis-step').innerHTML = '';
              }
              
              var gift_claim = true;
              document.querySelectorAll('.free-gift-item-wraper').forEach(item=>{
                item.style.display = 'none';
                let remain_price = item.getAttribute('data-price') * 100;
                let item_id = item.getAttribute('data-id');
                if(document.querySelector('.bc-cart__item[data-id="'+item_id+'"]')){
                  if(total<remain_price){
                    document.querySelector('.bc-cart__item[data-id="'+item_id+'"] .bc-cart__remove').click();
                    return;
                  }else{
                    item.querySelector('.upd-add-btn').setAttribute('disabled','disabled');
                    item.querySelector('.upd-add-btn').style.display='none';
                    item.querySelector('product-form input').value = 0;
                    item.querySelector('.gift-remain-note').innerText = 'You have free gift.';
                  }                  
                }else{
                  if(total<remain_price){
                    item.querySelector('.upd-add-btn').setAttribute('disabled','disabled');
                    item.querySelector('.upd-add-btn').style.display='block';
                    item.querySelector('product-form input').value = 0;
                    item.querySelector('.gift-remain-note').innerText = 'Spend '+  Shopify.formatMoney(remain_price - total).split('.')[0] + ' ' + Shopify.currency.active + ' more to unlock free gift';
                  }else{
                    item.querySelector('.upd-add-btn').removeAttribute('disabled');
                    item.querySelector('.upd-add-btn').style.display='block';
                    item.querySelector('product-form input').value = item_id;
                    item.querySelector('.gift-remain-note').innerText = 'Please get your free gift';
                    item.style.display = 'flex';
                    gift_claim = false;
                  }                  
                }                
              })              
              
              if(i == 1){
                document.querySelector('.free-gift-item-wraper.fgift-2')?document.querySelector('.free-gift-item-wraper.fgift-2').style.display = 'flex':null;
              }else{
                if(gift_claim){
                  document.querySelector('.free-gift-item-wraper.fgift-'+i)?document.querySelector('.free-gift-item-wraper.fgift-'+i).style.display = 'flex':null;
                }
                
              }
              
              el.classList.add('active');
              if(i == 1){
                sucsess.classList.remove('active');
              }else{
                sucsess.classList.add('active');
              }   
              check_step = false;
            }
          }
          
        }
      } else {
        progressEl ? progressEl.style.width = '0': null;  
        el.innerHTML = 'Spend <span class="remain-price"></span> more to get <span class="target-step"></span>';
        let priceEl = el?.querySelector('.remain-price');
        let targetEl = el?.querySelector('.target-step');
        priceEl ? priceEl.innerHTML = Shopify.formatMoney(shippingPriceCurrency).split('.')[0] : null; /* for free shipping */
        targetEl ? targetEl.innerHTML = _discount_settings[0][0]:null;
        el.classList.add('active');
        sucsess.classList.remove('active');
        document.querySelectorAll('.free-gift-item-wraper').forEach(item=>{
          item.style.display = 'none';
          let remain_price = item.getAttribute('data-price') * 100;
          item.querySelector('.upd-add-btn').setAttribute('disabled','disabled');
          item.querySelector('.upd-add-btn').style.display='block';
          item.querySelector('product-form input').value = '0';
          item.querySelector('.gift-remain-note').innerText = 'Spend '+  Shopify.formatMoney(remain_price).split('.')[0] + ' more to unlock free gift'
        })
        document.querySelector('.free-gift-item-wraper:first-child')?document.querySelector('.free-gift-item-wraper:first-child').style.display = 'flex':null;
      }
    }

  }

  // getCurrency(price, from = 'CAD', to = Shopify.currency.active){
  //   let currencyPrice = Currency.convert(price, from, to);
  //   return Shopify.formatMoney(currencyPrice) + ' ' + to;
  // }

  getCartAttributes(data){

    if(!data || !this.lessPackaging) return;
    data?.lessPackaging === "true" ? this.lessPackaging.checked = true : null;

  }

  getCartItemsCount(count){

    if(!this.cartCount) return;
    this.cartCount.textContent = count;
    if(this.shippingInsurance != null){
      if(count == 1 && !this.shippingInsurance.checked && localStorage.getItem("removeInsurance") == "false" ){
        this.insurance(this.shippingInsurance, true);
      }
      else if(count == 1 && this.shippingInsurance.checked){     
        this.shippingInsurance.click();
        this.shippingInsurance.checked = false;
        localStorage.setItem("removeInsurance", false);
      }
    }

  }

  renderItem(item){

    jQuery.ajax({
        url: '/products/' + item.handle + '.js',
        dataType: 'json',
        async: false,
        success: function(product) {
            item["compare_at_price"] = 0;
            product.variants.forEach(function(variant) {
                if (variant.compare_at_price != null && variant.id == item.variant_id) {
                    item["compare_at_price"] = variant.compare_at_price;
                }
            });
            console.log('line_item', item);
        }
    });
    const insuranceID = this.getInsurance(item.id);
    const giftID = item?.properties?._gift ? false : true;    
    let htmlItem = `<div class="bc-cart__item" data-id="${item.id}">`;
    htmlItem += `<div class="bc-cart__image-wrapper">${this.getImage(item.url, item.featured_image)}</div>`;
    htmlItem += `<div class="bc-cart__info-wrapper">
        ${this.getTitle(item?.url, item?.product_title, item?.variant_title)}
        <div class="bc-cart__price-and-properties">
          <div class="bc-cart__price-wrapper">
            ${this.getPrice(item.original_price, item.discounted_price, item.discounts,item.compare_at_price)}
          </div>
          <div class="bc-cart__properties-wrapper">
            ${this.getProperties(item?.properties)}
          </div>
        </div>
        ${this.getQuantity(insuranceID, giftID, item?.quantity, item.key, item?.properties?._gift_id)}`;

        if(insuranceID && giftID){
          if(item?.properties?._gift_id){
            htmlItem += `<span class="bc-cart__remove" data-key="${ item.key }" data-child="${item?.properties?._gift_id}" role="button">
              ${this.getRemoveIcon()}
            </span>`;
          } else {
            htmlItem += `<span class="bc-cart__remove" data-key="${ item.key }" role="button">
              ${this.getRemoveIcon()}
            </span>`;
          }
        }

    htmlItem += `</div>`; 
    htmlItem += `</div>`;
    return htmlItem;
  }

  getInsurance(id){

    if(!id || !this.shippingInsurance || !this.shippingInsuranceId) return true;
    this.shippingInsuranceId === id.toString() ? this.shippingInsurance.checked = true : null;
    return this.shippingInsuranceId === id.toString() ? false : true;
  }

  getImage(url, image){
    return `<a href="${url}">
        <img class="bc-cart__image-img width-10" src="${image.url || "//cdn.shopify.com/shopifycloud/shopify/assets/no-image-100-c91dd4bdb56513f2cbf4fc15436ca35e9d4ecd014546c8d421b1aece861dfecf_55x70.gif"}" alt="${image.alt | "Product Image"}" />
      </a>`;
  }

  getTitle(url, productName, variantName){
    let html = `<a href="${url}">`;
    html += `<h3 class="bc-cart__title">${productName}</h3>`;
    if(variantName && variantName !== 'null'){
      html += `<h6 class="bc-cart__variant-title">${variantName}</h6>`;
    }
    html += '</a>';
    return html;
  }

  getPrice(originalPrice, finalPrice, discount,compare_at_price){
    let priceHtml = compare_at_price > finalPrice ? `<span class="bc-cart__price-sale">${Shopify.formatMoney(compare_at_price)}</span>` : ``;
    priceHtml += `<span class="bc-cart__price">${Shopify.formatMoney(finalPrice)}</span>`;
    if(discount?.length){
      priceHtml += `<ul>`;
      discount.map(dis => {
        priceHtml += `<li>${dis?.title} (-${Shopify.formatMoney(dis?.amount)})</li>`;
      });
      priceHtml += `</ul>`;
    }
    return priceHtml;
  }

  getProperties(properties){
    let html = properties?.pre_order_announcement 
    ? `<span class="bc-cart__preorder">${properties?.pre_order_announcement}</span>` 
    : ``;
    return html;
  }

  getQuantity(a, b, qty, key, child){
    if(a && b){
      return `<div class="bc-cart__qty-wrapper">
          <span class="bc-cart__qty-minus" data-key="${key}" data-qty="${qty}" data-child="${child}">-</span>
          <span>${qty}</span>
          <span class="bc-cart__qty-plus" data-key="${key}" data-qty="${qty}" data-child="${child}">+</span>
        </div>`;
    } else {
      return `<div class="bc-cart__qty-wrapper bc-right">
          <span>${qty}</span>
        </div>`;
    }
  }

  getSubtotalPrice(subtotal, total, discount){    
    fetch('/cart?view=ajax')
      .then((response) => {
          return response.text();
      })
      .then((data) => {
          var temp = document.createElement('div');
          temp.innerHTML = data;
          document.querySelector('.bc-cart-prices-wraper').innerHTML = temp.querySelector('.bc-cart-prices-wraper').innerHTML;
          temp.querySelector('.cart-total-price span')?document.querySelector('.btn-sub-total').innerHTML = temp.querySelector('.cart-total-price span').innerHTML:document.querySelector('.btn-sub-total').innerHTML = '';
      })	    
  }

  getRemoveIcon(){
    // return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" aria-hidden="true" focusable="false" role="presentation" class="icon icon-remove">
    //   <path d="M14 3h-3.53a3.07 3.07 0 00-.6-1.65C9.44.82 8.8.5 8 .5s-1.44.32-1.87.85A3.06 3.06 0 005.53 3H2a.5.5 0 000 1h1.25v10c0 .28.22.5.5.5h8.5a.5.5 0 00.5-.5V4H14a.5.5 0 000-1zM6.91 1.98c.23-.29.58-.48 1.09-.48s.85.19 1.09.48c.2.24.3.6.36 1.02h-2.9c.05-.42.17-.78.36-1.02zm4.84 11.52h-7.5V4h7.5v9.5z" fill="currentColor"/>
    //   <path d="M6.55 5.25a.5.5 0 00-.5.5v6a.5.5 0 001 0v-6a.5.5 0 00-.5-.5zM9.45 5.25a.5.5 0 00-.5.5v6a.5.5 0 001 0v-6a.5.5 0 00-.5-.5z" fill="currentColor"/>
    // </svg>`;
    return `<svg class="" aria-hidden="true" focusable="false" role="presentation">
            <use href="#icon-close">
          </use></svg>`
  }

  getNotProductMessage(){
    return `<div class="bc-cart__not-products">
        Your cart is currently empty. <a href="/" target="_self">Click here</a> to continue shopping.
      </div><style>.cart-notification__links>.bc-cart__buttons-wrapper,.cart-notification__links>.bc-cart-prices-wraper{display:none}</style>`;
  }

  removeCartItem(event){

    let el = event.target;
    let itemKey = el.getAttribute('data-key');
    let childID = el.getAttribute('data-child');

    if(!itemKey) return;
    this.changeItem(itemKey, childID);

  }

  renderContents(parsedState) {

      this.productId = parsedState.id;
      this.getSectionsToRender().forEach((section => {
        document.getElementById(section.id).innerHTML =
          this.getSectionInnerHTML(parsedState.sections[section.id], section.selector);
      }));

      this.header?.reveal();
      this.open();
  }

  getSectionsToRender() {
    return [
      {
        id: 'cart-notification-product',
        selector: `#cart-notification-product-${this.productId}`,
      },
      {
        id: 'cart-notification-button'
      },
      {
        id: 'cart-icon-bubble'
      }
    ];
  }

  getSectionInnerHTML(html, selector = '.shopify-section') {
    return new DOMParser()
      .parseFromString(html, 'text/html')
      .querySelector(selector).innerHTML;
  }

  handleBodyClick(evt) {
    const target = evt.target;
    if (target !== this.notification && !target.closest('cart-notification') && target.closest('#cart-icon-bubble') !== this.cartHref) {
      const disclosure = target.closest('details-disclosure');
      this.activeElement = disclosure ? disclosure.querySelector('summary') : null;
      this.close();
    }
  }

  setActiveElement(element) {
    this.activeElement = element;
  }

  removeBtnInit(){
    const itemsRemoveButtons = document.querySelectorAll('span[role="button"]');
    itemsRemoveButtons?.length && itemsRemoveButtons.forEach(btn => btn.addEventListener('click', this.removeCartItem.bind(this)));

    const minus = document.querySelectorAll('span.bc-cart__qty-minus');
    minus?.length && minus.forEach(btn => btn.addEventListener('click', this.minusItem.bind(this)));

    const plus = document.querySelectorAll('span.bc-cart__qty-plus');
    plus?.length && plus.forEach(btn => btn.addEventListener('click', this.plusItem.bind(this)));

  }

}

customElements.define('cart-notification', CartNotification);