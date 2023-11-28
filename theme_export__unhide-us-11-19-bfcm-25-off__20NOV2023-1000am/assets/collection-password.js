class CollectionPassword extends HTMLElement {

    constructor(){
        super();

        if(localStorage.getItem('password') !== null) return document.querySelector('.js-section-password').remove();
        this.collectionMain = document.querySelector('.collection-grid-section').cloneNode(true);
        document.querySelector('.collection-grid-section').innerHTML = '';

        this.querySelector('form[action="/password"]').addEventListener('submit', this.onSubmitHandler.bind(this));

    }

    onSubmitHandler(event) {

        event.preventDefault();
        const form = event.target;
        const password = form.getAttribute('data-id');
        const passwordField = form.querySelector('input[type="password"]');
        const error = form.querySelector('span[data-type="error"]');
        const value = passwordField?.value;

        if(value.trim() === '' || password === null){
            this.showError(error);
        } else {
            const md5 = CryptoJS.MD5(value).toString();
            password === md5 ? this.showCollection() : this.showError(error);
        }

    }

    showCollection(){
        localStorage.setItem('password', 'have');
        document.querySelector('.collection-grid-section').appendChild(this.collectionMain);
        document.querySelector('.js-section-password').remove();
    }

    showError(error){
        error.classList.contains('bc-hide') ? error.classList.remove('bc-hide') : this.bounce(error);
    }

    bounce(id){
        id.classList.add('bounce');
        setTimeout(() => { id.classList.remove('bounce') }, 1000)
    }

}

customElements.define('collection-password', CollectionPassword);