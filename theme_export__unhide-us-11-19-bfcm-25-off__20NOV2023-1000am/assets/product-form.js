class ProductForm extends HTMLElement {
  constructor() {
    super();   

    this.form = this.querySelector('form');
    this.form.addEventListener('submit', this.onSubmitHandler.bind(this));
    this.cartNotification = document.querySelector('cart-notification');
  }

  onSubmitHandler(evt) {
    evt.preventDefault();
    this.cartNotification.setActiveElement(document.activeElement);
    const searchParams = new URLSearchParams(window.location.search);

    const submitButton = this.querySelector('[type="submit"]');

    submitButton.setAttribute('disabled', true);
    submitButton.classList.add('loading');
    
    const formData = JSON.parse(serializeForm(this.form));
    const {id, quantity, pre, pre_order_expected_date, pre_order_announcement, gift_id, cart_upsell, free_gift} = formData;
    const properties = {};
    let items = {'items':[]};
    
    searchParams.forEach((val,key)=>{
      switch(key){
        case "internal_referral":
          properties._internal_referrer = val;
          break;
        case "utm_source":
          properties._utm_source = val;
          break;
        case "utm_medium":
          properties._utm_medium = val;
          break;
        case "utm_campaign":
          properties._utm_campaign = val;
          break;
        case "utm_term":
          properties._utm_term = val;
          break;
        case "utm_content":
          properties._utm_content = val;
          break;
        case "campaign_id":
          properties._campaign_id = val;
          break;
        case "ad_id":
          properties._ad_id = val;
          break;
        case "section_click":
          properties._section_click = val;
          break;
        case "section_source":
          properties._section_source = val;
          break;
        case "_ab_croboost":
          properties._ab_croboost = val;
          break;
      }              
        
    })
    cart_upsell? properties._cart_upsell = true : null;
    free_gift? properties._free_gift = true : null;
    // pre ? properties.pre = pre : null;
    // pre_order_expected_date ? properties.pre_order_expected_date = pre_order_expected_date : null;
    // pre_order_announcement ? properties.pre_order_announcement = pre_order_announcement : null;
    gift_id ? properties._gift_id = gift_id : null;
    const alerdyAdded = gift_id ? this.cartNotification.querySelector('.bc-cart__item[data-id="' + gift_id +'"]') : null;
    
    if (document.querySelector('.ProductUpsell__Check') != null && document.querySelector('.ProductUpsell__Check').checked == true) {
	  items.items.push({'id': document.querySelector('.ProductUpsell__Variants').value, 'quantity': 1, 'properties':  {'_upsell': true}})			
	}
    if(isNaN(gift_id) || alerdyAdded || alerdyAdded !== null){      
      items.items.push({'id': id, 'quantity': quantity, 'properties': properties});
    } else {
      items.items.push({'id': id, 'quantity': quantity, 'properties': properties});
      items.items.push({'id': gift_id, 'properties': {'_gift': true} });
      //items = {'items': [{'id': id, 'quantity': quantity, 'properties': properties},{'id': gift_id, 'properties': {'_gift': true} }]};
    }    
    const body = JSON.stringify(items);

    fetch(`${routes.cart_add_url}`, { ...fetchConfig('javascript'), body })
      .then((response) => response.json())
      .then((data) =>{this.cartNotification.getCart();this.cartNotification.classList.add('new-item-added')})
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        submitButton.classList.remove('loading');
        submitButton.removeAttribute('disabled');
      });
  }
}

customElements.define('product-form', ProductForm);

document.querySelectorAll('.add_bundle_item').forEach(item=>{
  item.addEventListener('click',function(){
    const searchParams = new URLSearchParams(window.location.search);
    var parent_wraper = this.closest('.product__info-wrapper');
    var items = {'items':[]};
    this.setAttribute('disabled', true);
    this.classList.add('loading');
    var cartNotification = document.querySelector('cart-notification');
    parent_wraper.querySelectorAll('product-form form').forEach(i_form=>{
      var formData = JSON.parse(serializeForm(i_form));
      var {id, quantity, pre, pre_order_expected_date, pre_order_announcement, gift_id, cart_upsell, free_gift} = formData;
      var properties = {};
      searchParams.forEach((val,key)=>{
        switch(key){
          case "internal_referral":
            properties._internal_referrer = val;
            break;
          case "utm_source":
            properties._utm_source = val;
            break;
          case "utm_medium":
            properties._utm_medium = val;
            break;
          case "utm_campaign":
            properties._utm_campaign = val;
            break;
          case "utm_term":
            properties._utm_term = val;
            break;
          case "utm_content":
            properties._utm_content = val;
            break;
          case "campaign_id":
            properties._campaign_id = val;
            break;
          case "ad_id":
            properties._ad_id = val;
            break;
          case "section_click":
            properties._section_click = val;
            break;
          case "section_source":
            properties._section_source = val;
            break;
          case "_ab_croboost":
            properties._ab_croboost = val;
            break;
        }              
          
      })
      // pre ? properties.pre = pre : null;
      // pre_order_expected_date ? properties.pre_order_expected_date = pre_order_expected_date : null;
      // pre_order_announcement ? properties.pre_order_announcement = pre_order_announcement : null;
      properties._bundle = true;
      items.items.push({'id': id, 'quantity': quantity, 'properties': properties});
    })
    const body = JSON.stringify(items);

    fetch(`${routes.cart_add_url}`, { ...fetchConfig('javascript'), body })
      .then((response) => response.json())
      .then((data) =>{cartNotification.getCart();cartNotification.classList.add('new-item-added')})
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        this.classList.remove('loading');
        this.removeAttribute('disabled');
      });
  })
})