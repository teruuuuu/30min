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
        switch (this.tag.name) {
            case "technology":
                // 濃い紫、半透明の背景、シアンのテキスト
                this.colorClass = "bg-purple-500/20"; // 半透明の背景
                this.setTextColorClass = "text-purple-300"; // 明るいテキスト色
                this.setBorderClass = "border border-purple-500/50"; // 薄い枠線
                break;
            case "life":
                // 濃いピンク、半透明の背景、ピンクのテキスト
                this.colorClass = "bg-pink-500/20";
                this.setTextColorClass = "text-pink-300";
                this.setBorderClass = "border border-pink-500/50";
                break;
            case "nature":
                // 濃いエメラルドグリーン、半透明の背景、エメラルドのテキスト
                this.colorClass = "bg-emerald-500/20";
                this.setTextColorClass = "text-emerald-300";
                this.setBorderClass = "border border-emerald-500/50";
                break;
            case "music":
                // 濃いシアン、半透明の背景、シアンのテキスト
                this.colorClass = "bg-cyan-500/20";
                this.setTextColorClass = "text-cyan-300";
                this.setBorderClass = "border border-cyan-500/50";
                break;
            case "game":
                // 濃い赤、半透明の背景、赤のテキスト
                this.colorClass = "bg-red-500/20";
                this.setTextColorClass = "text-red-300";
                this.setBorderClass = "border border-red-500/50";
                break;
            case "history":
                // 濃いオレンジ、半透明の背景、オレンジのテキスト
                this.colorClass = "bg-orange-500/20";
                this.setTextColorClass = "text-orange-300";
                this.setBorderClass = "border border-orange-500/50";
                break;
            default:
                // デフォルトは白っぽい半透明背景と白テキスト
                this.colorClass = "bg-white/10";
                this.setTextColorClass = "text-white/80";
                this.setBorderClass = "border border-white/20";
                break;
        }

        // 共通のスタイルもここで結合
        this.tagClass = `${this.colorClass} ${this.setTextColorClass} ${this.setBorderClass} text-xs me-2 px-2.5 py-0.5 rounded-full backdrop-blur-sm`;
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

