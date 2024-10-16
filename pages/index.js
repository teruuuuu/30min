import React, { useContext } from 'react';
import Head from "next/head.js";
import { useLocale } from "../utils/locale";
import { getDatabase } from "../lib/notion.js";
import Layout from '../components/layout.js'
export const databaseId = process.env.NEXT_PUBLIC_NOTION_DATABASE_ID;
import LocaleContext from '../components/context/localeContext.js';
import saveImageIfNeeded from '../components/download/index.js';
import TopListEntity, { getListFromNotion } from '../entity/topListEntity.js';
import Link from 'next/link.js';
import Image from 'next/image.js';


export default function Home({ list }) {
  const { locale } = useContext(LocaleContext);
  const { json } = useLocale(locale)
  const lang = json.navigation

  const entityList = []
  for(const item of list){
    const entity = new TopListEntity(item, locale == "ja")
    //if(entity.active){
      entityList.push(entity)
    //}
  }
  entityList.sort((a, b) => a.ordering - b.ordering)

  const getBadgeColor = (text) => {
      const colors = [
        'green',  // 0
        'yellow', // 1
        'red',    // 2
        'blue',   // 3
        'purple', // 4
        'indigo', // 5
        'pink',   // 6
        'gray-300'    // 7
    ];

    // 文字列を数値に変換する
    const hash = Array.from(text).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    // 色のインデックスを決定
    const index = hash % colors.length;

    const color =  colors[index];
    return `bg-${color}-300 text-${color}-800 text-xs me-2 px-2.5 py-0.5 rounded dark:bg-${color}-900 dark:text-${color}-300`
  }

  return (
    <Layout>
      <Head>
        <title>{lang.meta_title}(${lang.sub_title})</title>
        <meta name="description" content={`${lang.title} - ${lang.description}`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className="bg-white py-8">
        <div className="container mx-auto flex items-center flex-wrap pt-4 pb-12">
          <nav id="store" className="w-full z-30 top-0 px-6 py-1">
              <div className="w-full container mx-auto flex flex-wrap items-center justify-between mt-0 px-2 py-3">
                  {/* <a className="uppercase tracking-wide no-underline hover:no-underline font-bold text-gray-800 text-xl " href="#">Store</a> */}
                  {/* <div className="flex items-center" id="store-nav-content">

                      <a className="pl-3 inline-block no-underline hover:text-black" href="#">
                          <svg className="fill-current hover:text-black" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                              <path d="M7 11H17V13H7zM4 7H20V9H4zM10 15H14V17H10z" />
                          </svg>
                      </a>

                      <a className="pl-3 inline-block no-underline hover:text-black" href="#">
                          <svg className="fill-current hover:text-black" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                              <path d="M10,18c1.846,0,3.543-0.635,4.897-1.688l4.396,4.396l1.414-1.414l-4.396-4.396C17.365,13.543,18,11.846,18,10 c0-4.411-3.589-8-8-8s-8,3.589-8,8S5.589,18,10,18z M10,4c3.309,0,6,2.691,6,6s-2.691,6-6,6s-6-2.691-6-6S6.691,4,10,4z" />
                          </svg>
                      </a>

                  </div> */}
            </div>
          </nav>
          {entityList.map((entity) => {
            let detailUrl = `/detail/${entity.id}/`
            if(!entity.active){
              detailUrl = `/prepare/`
            }
            // if(entity.externalLink){
            //   detailUrl = entity.externalLink
            // }
            const tagClass = getBadgeColor(entity.tag.name)
            return (
              <div className="w-full md:w-1/3 xl:w-1/4 p-6 flex flex-col">
                <Link href={detailUrl}>
                  <div className="relative w-full h-72 md:h-32 lg:h-48 ">
                    <Image className="hover:grow hover:shadow-lg" src={entity.image} layout="fill" objectFit="cover" />
                  </div>
                    <div className="pt-3 flex items-center justify-between ">
                        <p className="">{entity.title}</p>
                        <span className={tagClass}>{entity.tag.name}</span>

                    </div>
                    <p className="pt-1 text-gray-900">{entity.date}</p>
                </Link>
              </div>
            )
          })}
        </div>
      </section>
    </Layout>
  );
}

export const getStaticProps = async (context) => {

  // get slider
  let list = await getList()

  return {
    props: {
      list: list,
    },
    revalidate: 1
  };
};

const getList = async () => {
  const database = await getListFromNotion()
  let props = []
  for(let item of database){
      props.push(item.properties)
  }
  await saveImageIfNeeded(props, "top")
  return database
}
