document.querySelectorAll('.single-quick-add').forEach((item)=>{  
  item.addEventListener("click", function(event){
    this.closest(".card-wrapper").querySelector('.product-form__submit').click();
    this.closest(".quick-add-cart-wrapper").classList.add('loading');
    setTimeout(()=>{this.closest(".quick-add-cart-wrapper").classList.remove('loading');},500)
  })    
})
document.querySelectorAll('.card-color-wrapper .bc-card-color__item').forEach((item)=>{  
  item.addEventListener("click", function(event){
    if(this.classList.contains('selected')){
      return false;
    }else{
      var option_val = this.getAttribute('data-option');
      var parient = this.closest(".card-wrapper");
      var option_index = "option-" + this.closest('.bc-card-color__list').getAttribute('option_index');
      var variant_index = ""; 
      var variant_option = "";      
      if(parient.querySelector('.card-variant-wrapper .variant-options') != null){
        variant_index = "option-" + parient.querySelector('.card-variant-wrapper .variant-options').getAttribute('option_index');
        variant_option = parient.querySelector('.card-variant-wrapper .variant-options .variant-option.selected').getAttribute('data-option');
      }
      
      var feature_img = parient.querySelector('.variant-select option['+option_index+' ="'+option_val+'"]').getAttribute('variant-img');
      var other_options = parient.querySelectorAll('.variant-select option['+option_index+' ="'+option_val+'"]');
      if(feature_img != ''){
        var basic_url = parient.querySelector('.main-feature-img').getAttribute('src').split('/products/')[0]+'/';
        parient.querySelector('.main-feature-img').setAttribute('src',basic_url+feature_img);
        parient.querySelector('.main-feature-img').setAttribute('srcset',basic_url+feature_img);
      }
      if(variant_index == ''){        
        var selected_variant_option = parient.querySelector('.variant-select option['+option_index+' ="'+option_val+'"]');
      }else{
        other_options.forEach((option_item)=>{
          if(option_item.getAttribute('available') != 'true'){
            var variant_val = option_item.getAttribute(variant_index);
            parient.querySelector('.variant-option[data-option="'+variant_val+'"]').classList.add('disable');
            
          }else{
            var variant_val = option_item.getAttribute(variant_index);
            parient.querySelector('.variant-option[data-option="'+variant_val+'"]').classList.remove('disable');
            
          }
        })
        var selected_variant_option = parient.querySelector('.variant-select option['+option_index+' ="'+option_val+'"]['+variant_index+' ="'+variant_option+'"]'); 
      }
      if(parient.querySelector('.card-quick-add')){
        if(selected_variant_option?.getAttribute('available') != 'true'){            
          parient.querySelector('.card-quick-add').classList.add('disabled');
          parient.querySelector('.card-quick-add').innerText='Sold Out';            
        }else{
          parient.querySelector('.card-quick-add').classList.remove('disabled');
          parient.querySelector('.card-quick-add').innerText='Quick Add';            
        }
      }      
      this.closest('.bc-card-color__list').querySelector('.selected').classList.remove('selected');
      this.classList.add('selected');      
      parient.querySelector('form input[name="id"]').value = selected_variant_option?.getAttribute('value');
    } 
  })    
})
document.querySelectorAll('.card-variant-wrapper .variant-option').forEach((item)=>{  
  item.addEventListener("click", function(event){    
    var option_val = this.getAttribute('data-option');
    var parient = this.closest(".card-wrapper");
    var option_index = "option-" + this.closest('.variant-options').getAttribute('option_index');
    var color_index = '';
    var color_option = '';
    var available = true;
    if(parient.querySelector('.card-color-wrapper .bc-card-color__list') != null){
      color_index = "option-" + parient.querySelector('.card-color-wrapper .bc-card-color__list').getAttribute('option_index');
      color_option = parient.querySelector('.card-color-wrapper .bc-card-color__item.selected').getAttribute('data-option');
    }
    var other_options = parient.querySelectorAll('.variant-select option['+option_index+' ="'+option_val+'"]');
    if(color_index == ''){
      var selected_variant_option = parient.querySelector('.variant-select option['+option_index+' ="'+option_val+'"]');
      
    }else{
      other_options.forEach((option_item)=>{
        if(option_item.getAttribute('available') != 'true'){
          var color_val = option_item.getAttribute(color_index);
          parient.querySelector('.bc-card-color__item[data-option="'+color_val+'"]').classList.add('disable');

        }else{
          var color_val = option_item.getAttribute(color_index);
          parient.querySelector('.bc-card-color__item[data-option="'+color_val+'"]').classList.remove('disable');

        }
      })
      var selected_variant_option = parient.querySelector('.variant-select option['+option_index+' ="'+option_val+'"]['+color_index+' ="'+color_option+'"]');     
      
    }
    if( parient.querySelector('.card-quick-add')){ 
      if(selected_variant_option?.getAttribute('available') != 'true'){      
        parient.querySelector('.card-quick-add').classList.add('disabled');
        parient.querySelector('.card-quick-add').innerText='Sold Out';            
      }else{
        parient.querySelector('.card-quick-add').classList.remove('disabled');
        parient.querySelector('.card-quick-add').innerText='Quick Add';            
      } 
    }
    this.closest('.variant-options')?.querySelector('.selected').classList.remove('selected');
    this.classList.add('selected');    
    parient.querySelector('form input[name="id"]').value = selected_variant_option?.getAttribute('value');

     
  }) ;   
})

document.querySelectorAll('.card-quick-add').forEach((item)=>{  
  item.addEventListener("click", function(event){
    event.preventDefault();
    var parient = this.closest(".card-wrapper");
    parient.querySelector('.product-form__submit').click();
    parient.querySelector(".card-button-wrapper").classList.add('loading');
    setTimeout(()=>{parient.querySelector(".card-button-wrapper").classList.remove('loading');},500);
     
  }) ;   
})


