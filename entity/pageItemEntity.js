import { ACCESABLE_IMAGE_PATH, DOWNLOAD_IMAGE_EXTENSION } from "../const"
import { getDatabase } from "../lib/notion"


export default class PageItemEntity {
    constructor(item, isJpn, parentId){
        if(!item){
            return
        }
        // title
        this.title = []

        this.id = item.id
        if(isJpn && item.properties["title"].title[0]){
            this.title = item.properties["title"].title[0].text.content
        }
        // if(!isJpn && item.properties["en"].rich_text[0]){
        //     this.title = item.properties["en"].rich_text[0].text.content
        // }

        this.text = []
        if(item.properties["text"].rich_text[0]){
            const list = item.properties["text"].rich_text
            this.text = list.filter(item => item.plain_text !== '\n');
            // for(const tx of item.properties["text"].rich_text){
            //     const txList = tx.split('\n');
                
            // }
        }
        // if(!isJpn && item.properties["sub_en"].rich_text[0]){
        //     this.text = item.properties["sub_en"].rich_text[0].text.content
        // }
        // 今はなし　やるならダウンロード処理入れないと
        if(item.properties["image"].files[0]){
            //const name = item.properties["image"].files[0].name

            const tmpName = item.properties["image"].files[0].name
            const name = tmpName.replace(/ /g, '_')
            this.image = `/${ACCESABLE_IMAGE_PATH}/detail/${parentId}/${name}${DOWNLOAD_IMAGE_EXTENSION}`
        }
        this.ordering = item.properties["ordering"].number
        if(item.properties["html"] && item.properties["html"].rich_text[0]){
            this.html = ""
            for(const tx of item.properties["html"].rich_text){
                this.html += tx.plain_text
            }
        }

        if(item.properties["credit"] && item.properties["credit"].rich_text[0]){
            this.credit = item.properties["credit"].rich_text[0].text.content
        }
    }
}

export const getContentList = async (database, limit = null) => {
    let params = []
    if(database){

        // 並び替え
        const sortedDatabase = database.sort((a, b) => new Date(b.last_edited_time) - new Date(a.last_edited_time));

        let limitedDatabase = sortedDatabase
        if(limit){
            limitedDatabase = sortedDatabase.slice(0, limit);    
        }
        
        limitedDatabase.map((page) => {
            params.push({
                id: page.id,
                page:page
            })
        })
    }

    return params;
}

export const getListFromNotion = async () => {
    const database = await getDatabase("1113cd430aa0807dad7cc032eb418c4c")
    return database
}

