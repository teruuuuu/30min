import { ACCESABLE_IMAGE_PATH, DOWNLOAD_IMAGE_EXTENSION } from "../const"
import { getDatabase } from "../lib/notion"


export default class TopListEntity {
    constructor(item, isJpn){
        if(!item){
            return
        }
        // title
        this.title = []

        this.id = item.id
        if(isJpn && item.properties["title"].title[0]){
            this.title = item.properties["title"].title[0].text.content
        }
        if(!isJpn && item.properties["en"].rich_text[0]){
            this.title = item.properties["en"].rich_text[0].text.content
        }
        this.rawDate = item.properties["date"].date.start
        this.date = new Date(item.properties["date"].date.start).toLocaleString(
            isJpn ? "ja" : "en",
            {
              month: "short",
              day: "2-digit",
              year: "numeric",
            }
          );
        this.text = []
        if(isJpn && item.properties["sub"].rich_text[0]){
            this.text = item.properties["sub"].rich_text[0].text.content
        }
        if(!isJpn && item.properties["sub_en"].rich_text[0]){
            this.text = item.properties["sub_en"].rich_text[0].text.content
        }
        // 今はなし　やるならダウンロード処理入れないと
        if(item.properties["image"].files[0]){
            //const name = item.properties["image"].files[0].name

            const tmpName = item.properties["image"].files[0].name
            const name = tmpName.replace(/ /g, '_')
            this.image = `/${ACCESABLE_IMAGE_PATH}/top/${name}${DOWNLOAD_IMAGE_EXTENSION}`
        }
        this.tags = item.properties["genre"].multi_select
        this.tag = item.properties["genre"].multi_select[0]
        this.ordering = item.properties["ordering"].number
        this.active = item.properties["active"].checkbox
        this.externalLink = item.properties["externalLink"].url
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

