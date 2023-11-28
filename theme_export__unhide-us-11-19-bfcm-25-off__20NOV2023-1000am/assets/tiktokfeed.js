class TiktokFeed extends HTMLElement {
    constructor(){
        super();
        this.apiURL = `https://www.tiktok.com/oembed?url=`;
        this.init();   
    }

    async init() {
        try {
            let $getTiktokJson = await this.getTiktokJson();
            let $getTiktokFeed = await this.getTiktokFeed($getTiktokJson);
            this.showTiktokFeed($getTiktokFeed);
        } catch(error){
            console.error("437 Tiktok Error: ", error);
        }
    }

    showTiktokFeed(data){
        let tiktokFeedHtml = '';
        data?.length && data.map(item => {
            const {author_name, author_url, video_url, thumbnail_url} = item;
            tiktokFeedHtml += `<div class="bc-tiktok__itmes-item">
                <a target="_blank" href="${video_url}" rel="noopener"  aria-label="${author_name}">
                    <div class="bc-tiktok__image" style="background-image:url(${thumbnail_url})" loading="lazy"></div>
                </a>
            </div>`;
            // <div class="bc-tiktok__after"><a href="${author_url}">@${author_name}</a></div>
        });
        this.querySelector('#bctiktokitems').innerHTML = tiktokFeedHtml;
    }

    async getTiktokFeed(ids){

        if(!Object.keys(ids).length) return null;
        const req = await Promise.all(Object.entries(ids).map(async (id) => {
            let reqApi = await fetch(`${this.apiURL}${id[1]}`);
            let res = await reqApi.json();
            res.video_url = id[1];
            return res;
        }));
        return req;
    }

    async getTiktokJson(){
        const tiktokJson = await JSON.parse(document.querySelector('#tiktokjson').textContent);
        return tiktokJson;
    }
    
}

customElements.define('tiktok-feed', TiktokFeed);





// const oEmbedUrl = `https://www.tiktok.com/oembed?url=`;

// const PDPTikTok = ({ tikTokMetaData }) => {
//   if (isEmpty(tikTokMetaData)) return null;

//   const [hasErrors, setErrors] = useState(false);
//   const [tikTokData, setTikTokData] = useState([]);

//   const findVideoUrl = (html) => {
//     let dom = new DOMParser().parseFromString(html, 'text/html');
//     let node = [...dom.body.childNodes].find((child) => {
//       return (
//         child.className === 'tiktok-embed' && child.cite.includes('tiktok.com')
//       );
//     });

//     if (node) return node.cite;
//     else return false;
//   };

//   const fetchThumnbailUrls = async () => {
//     const resAll = await Promise.all(
//       values(tikTokMetaData).map((url) => fetch(`${oEmbedUrl}${url}`))
//     ).catch((err) => setErrors(true));
//     const tikTokJSON = await Promise.all(resAll.map((res) => res.json()));

//     setTikTokData(tikTokJSON);
//   };

//   useEffect(() => {
//     fetchThumnbailUrls();
//   }, []);

//   return (
//     <div>
//       <h2 className="tc f4 mv4">SEEN ON TIK TOK</h2>
//       <div className="pdp-grid-content">
//         {!hasErrors &&
//           tikTokData.map((data, index) => {
//             const videoUrl = findVideoUrl(data.html);
//             const content = (
//               <div
//                 className="lazyload cover bg-center aspect-ratio--9x16"
//                 data-bg={data.thumbnail_url}
//                 style={{
//                   backgroundImage:
//                     'https://cdn.shopify.com/s/files/1/2112/6981/files/image-logo-logo_100x.png',
//                 }}></div>
//             );

//             if (videoUrl) {
//               return (
//                 <a key={index} href={findVideoUrl(data.html)} target="_blank">
//                   {content}
//                 </a>
//               );
//             } else {
//               return content;
//             }
//           })}
//       </div>
//     </div>
//   );
// };

// export default PDPTikTok;