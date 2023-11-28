class InstagramFeed extends HTMLElement {
    constructor(){
        super();
        this.apiURL = `https://api--service.herokuapp.com/api/v1/instagram/images`;
        this.init();   
    }

    async init() {
        try {
            let $getInstaJson = await this.getInstaJson();
            let $getInstaFeed = await this.getInstaFeed($getInstaJson);
            this.showInstaFeed($getInstaFeed);
        } catch(error){
            console.error("437 Insta Error: ", error);
        }
    }

    showInstaFeed(data){
        let instaFeedHtml = '';
        data?.length && data.map(item => {
            const {author_name, image_id, thumbnail_url} = item.data;
            instaFeedHtml += `<div class="bc-insta__itmes-item">
                <a target="_blank" href="https://instagram.com/p/${image_id}" rel="noopener" aria-label="${author_name}">
                    <div class="bc-insta__image" style="background-image:url(${thumbnail_url})" loading="lazy"></div>
                </a>
                <div class="bc-insta__after"><a href="https://instagram.com/${author_name}">@${author_name}</a></div>
            </div>`;
        });
        this.querySelector('#bcinstaitems').innerHTML = instaFeedHtml;
    }

    async getInstaFeed(ids){
        if(!Object.keys(ids).length) return null;
        const req = await Promise.all(Object.entries(ids).map(async (id) => {
            let reqApi = await fetch(`${this.apiURL}/${id[1]}?client=437`);
            let res = await reqApi.json();
            res.data.image_id = id[1];
            return res;
        }));
        return req;
    }

    async getInstaJson(){
        const instaJson = await JSON.parse(document.querySelector('#instagramjson').textContent);
        return instaJson;
    }
    
}

customElements.define('instagram-feed', InstagramFeed);
