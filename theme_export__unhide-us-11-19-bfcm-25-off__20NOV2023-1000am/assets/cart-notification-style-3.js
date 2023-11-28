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
    document.querySelector('cart-notification').classList.remove('new-item-added');
    this.getCart();

  }

  open() {

    this.notification.classList.add('animate', 'active');
    this.notification.addEventListener('transitionend', () => {
      this.notification.focus();
      trapFocus(this.notification);
    }, { once: true });
    document.body.addEventListener('click', this.onBodyClick);

  }

  close() {

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
      this.cartItemsWrapper.innerHTML = this.items;
      this.open();
      this.removeBtnInit();
      loading ? this.notification.classList.remove('loading') : null;
    });

  }

  renderCart(data){

    if(!data) return;
    this.items = '';
    this.shippingPrice ? this.freeShippingBar(data.total_price) : null;
    this.getCartAttributes(data?.attributes);
    this.getSubtotalPrice(data.items_subtotal_price, data.total_price, data.cart_level_discount_applications);
    this.getCartItemsCount(data?.item_count);

    if(!data?.items?.length) return this.items += this.getNotProductMessage();

    data?.items?.map(item => {
      this.items += this.renderItem(item);
    });

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
      let priceEl = el?.querySelector('strong');
      let shippingPriceCurrency = Currency.convert(this.shippingPrice, 'USD', Shopify.currency.active);
      //let shippingPriceCurrency = this.shippingPrice;
  
      if(total > 0){
        if(total >= shippingPriceCurrency){
          el.classList.remove('active');
          sucsess.classList.add('active');
          progressEl ? progressEl.style.width = '100%': null;
          return;
        } else {
          let newPrice = shippingPriceCurrency - total;
          let percent = (100 * total) / shippingPriceCurrency;
          progressEl ? progressEl.style.width = percent + '%': null;
          priceEl ? priceEl.innerHTML = Shopify.formatMoney(newPrice) + ' ' + Shopify.currency.active : null;
          el.classList.add('active');
          sucsess.classList.remove('active');
        }
      } else {
        progressEl ? progressEl.style.width = '0': null;
        priceEl ? priceEl.innerHTML = Shopify.formatMoney(shippingPriceCurrency) + ' ' + Shopify.currency.active : null;
        el.classList.add('active');
        sucsess.classList.remove('active');
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
    document.querySelector('#view-cart .total-num').textContent = count;
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

    const insuranceID = this.getInsurance(item.id);
    const giftID = item?.properties?._gift ? false : true;

    let htmlItem = `<div class="bc-cart__item" data-id="${item.id}">`;
    htmlItem += `<div class="bc-cart__image-wrapper">${this.getImage(item.url, item.featured_image)}</div>`;
    htmlItem += `<div class="bc-cart__info-wrapper">
        ${this.getTitle(item?.url, item?.product_title, item?.variant_title)}
        <div class="bc-cart__price-and-properties">
          <div class="bc-cart__price-wrapper">
            ${this.getPrice(item.original_price, item.discounted_price, item.discounts)}
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
        <img class="bc-cart__image-img width-7" src="${image.url || "//cdn.shopify.com/shopifycloud/shopify/assets/no-image-100-c91dd4bdb56513f2cbf4fc15436ca35e9d4ecd014546c8d421b1aece861dfecf_55x70.gif"}" alt="${image.alt | "Product Image"}" width="55" height="70"/>
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

  getPrice(originalPrice, finalPrice, discount){
    let priceHtml = originalPrice > finalPrice ? `<span class="bc-cart__price-sale">${Shopify.formatMoney(originalPrice)}</span>` : ``;
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
    let html = ``;
    if(subtotal > total){
      document.querySelector('#cart-subtotal').innerHTML = `
        <div class="bc-cart__subtotal-label">SUBTOTAL</div>
        <div class="bc-cart__subtotal-value">${Shopify.formatMoney(subtotal)}</div>`;
    }
    if(discount?.length){
      html += `<ul>`;
      discount.map( dis => {
        html += `<li>${dis.title} (-${Shopify.formatMoney(dis.total_allocated_amount)})</li>`;
      })
      html += `</ul>`;
      html += `<span>${Shopify.formatMoney(total)}</span>`;
    } else {
      html += `<span>${Shopify.formatMoney(total)}</span>`;
    }
    document.querySelector('#cart-total').innerHTML = html;
  }

  getRemoveIcon(){
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" aria-hidden="true" focusable="false" role="presentation" class="icon icon-remove">
      <path d="M14 3h-3.53a3.07 3.07 0 00-.6-1.65C9.44.82 8.8.5 8 .5s-1.44.32-1.87.85A3.06 3.06 0 005.53 3H2a.5.5 0 000 1h1.25v10c0 .28.22.5.5.5h8.5a.5.5 0 00.5-.5V4H14a.5.5 0 000-1zM6.91 1.98c.23-.29.58-.48 1.09-.48s.85.19 1.09.48c.2.24.3.6.36 1.02h-2.9c.05-.42.17-.78.36-1.02zm4.84 11.52h-7.5V4h7.5v9.5z" fill="currentColor"/>
      <path d="M6.55 5.25a.5.5 0 00-.5.5v6a.5.5 0 001 0v-6a.5.5 0 00-.5-.5zM9.45 5.25a.5.5 0 00-.5.5v6a.5.5 0 001 0v-6a.5.5 0 00-.5-.5z" fill="currentColor"/>
    </svg>`;
  }

  getNotProductMessage(){
    return `<div class="bc-cart__not-products">
        Your cart is currently empty. <a href="/" target="_self">Click here</a> to continue shopping.
      </div>`;
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