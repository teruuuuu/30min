import React, { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from "next/head";
import { getDatabase, getPage, getBlocks } from "../../lib/notion";
import Link from "next/link";
import Layout from "../../components/layout"
import LocaleContext from "../../components/context/localeContext";
import { useLocale } from "../../utils/locale";
import Image from "next/image";
import TopListEntity, { getContentList, getListFromNotion } from "../../entity/topListEntity";
import Title from "../../components/parts/text/title"
import Paragraphs from "../../components/parts/text/paragraphs"
import PageItemEntity from "../../entity/pageItemEntity";
import saveImageIfNeeded from "../../components/download";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
import { ParseHtml } from "../../components/parts/parse/parser";
import Loading from '../../components/parts/loading';


export default function Post({ page, list }) {
  const router = useRouter();


  const updateQuery = (p) => {
    const currentQuery = { ...router.query };
    const newQuery = {
      ...currentQuery,
      p: p, // 値を1に設定
    };

    console.log("ppppppppppppppppppppppp")
  console.log(p)
    
    // クエリを更新
    router.replace({
      pathname: router.pathname,
      query: newQuery,
    }, undefined, { shallow: true });
  };
  
  const { locale } = useContext(LocaleContext);
  const { json, metaTitleExtension } = useLocale(locale)
  let lang = json.navigation

  if (!page || !list ) {
    return <div>{json.common.not_found_article}</div>;
  }
  const { p } = router.query;

  const [currentPage, setCurrentPage] = useState(p ? p : 1)

  const [isFirstPage, setFirstPage] = useState(true)
  const [isLastPage, setLasttPage] = useState(false)
  const pageCount = list.length
  const pageEntity = new TopListEntity(page, locale == "ja")
  let resList = []
  for(const item of list){
    resList.push(new PageItemEntity(item, locale == "ja", pageEntity.id))
  }
  resList.sort((a, b) => a.ordering - b.ordering)

  console.log(currentPage)
  const [detail, setDetail] = useState(resList[currentPage-1])

  const [loading, setLoading] = useState(detail.image);


  const nextPage = () => {
    const cp = Number(currentPage) + 1
    if(cp > pageCount){
        console.log(pageCount)
      return
    }
    setFirstPage(cp <= 1)
    setLasttPage(pageCount <= cp)
    setCurrentPage(cp)
    const detail = resList[cp-1]
    console.log(detail)
    setDetail(detail)
    updateQuery(cp)
  }
  const prevPage = () => {
    const cp = Number(currentPage) - 1
    if(cp < 0){
      return
    }
    setFirstPage(cp <= 1)
    setLasttPage(pageCount <= cp)
    setCurrentPage(cp)
    const detail = resList[cp-1]
    setDetail(detail)
    updateQuery(cp)
  }

  useEffect(() => {
    if (router.query.p) {
      const p = router.query.p
      setCurrentPage(p);
      setFirstPage(p <= 1)
      setLasttPage(pageCount <= p)
      const detail = resList[p-1]
      setDetail(detail)
    }
  }, [router.query.p]); // pが変更されたときに実行



  let pageTitle = ""
  let pageSubTitle = ""
  if(pageEntity && pageEntity.title){
    pageTitle = pageEntity.title
  }
  if(pageEntity && pageEntity.text){
    pageSubTitle = pageEntity.text
  }

  let breadcrumb = {
    parents: null,
    current: `${pageTitle} 〜 ${pageSubTitle} `
  }

//   const adIndex = Math.ceil(blocks.length/2)
  return (
    <Layout breadcrumb={breadcrumb}>
      <Head>
        <title>{pageTitle} - {metaTitleExtension} </title>
        <meta name="description" content={`${lang.about} - ${lang.description}`} />
      </Head>

      <div className="">
        <div className="row">
          <section className="py-1 mb-4 pb-4">
            <div className="container lg:px-5 mx-auto">
              <div className="items-center gap-4 md:gap-8 my-24">
                    {/* Post content*/}
                    <article>
                        <header className="mb-4 ">
                          <div className="w-full flex flex-cols">
                            <div className={`flex-none w-7 flex items-center justify-center m-5 ${isFirstPage ? 'invisible' : ''} `}>
                              <p className="text-center">
                                <button onClick={() => prevPage()}><ChevronLeftIcon className="w-10 h-10"/></button>
                              </p>
                            </div>
                            <div className="grow px-2 md:px-10 min-h-96 items-center">
                              {detail && (
                                <>
                                <Title title={detail.title} />
                                {detail.html && (
                                  <div className="w-full flex justify-center py-10">
                                    <ParseHtml html={detail.html} />
                                  </div>
                                )}    
                                {detail.text[0] && detail.image && (
                                    <div className="flex lg:flex-row flex-col item-center justify-center gap-10">
                                      <div className='lg:flex-1 flex items-center justify-center'>
                                      {/* {detail.text[0].text.content} */}
                                        <Paragraphs value={detail.text} />
                                      </div>
                                      <div className="relative lg:flex-shrink-0 w-full lg:w-1/2 overflow-hidden rounded-lg flex flex-col items-center justify-center">
                                        {loading && <Loading />}
                                        <Image
                                          src={detail.image}
                                          alt={detail.title}
                                          width={800}  // サイズを大きめに設定
                                          height={400}
                                          layout="responsive"
                                          onLoad={() => setLoading(false)}
                                          objectFit="cover"
                                          className="transition-transform duration-500 ease-in-out transform hover:scale-105 my-10 rounded-lg object-cover max-h-96"
                                        />
                                        {detail.credit && (
                                          <div className='text-gray-500 text-center'>画像提供:{detail.credit}</div>
                                        )}
                                      </div>
                                    </div>
                                )}
                                {detail.text[0] && !detail.image &&  (
                                  <div className='lg:flex-1 flex items-center justify-center'>
                                    <Paragraphs value={detail.text} />
                                  </div>
                                )}
                                {!detail.text[0] && detail.image &&  (
                                    <div className="flex item-center justify-center ">
                                      <div className="relative w-1/2 overflow-hidden rounded-lg flex flex-col items-center justify-center">
                                        {loading && <Loading />}
                                        <Image
                                          src={detail.image}
                                          alt={detail.title}
                                          width={800}  // サイズを大きめに設定
                                          height={400}
                                          layout="responsive"
                                          objectFit="cover"
                                          onLoad={() => setLoading(false)}
                                          className="transition-transform duration-500 ease-in-out transform hover:scale-105 my-10 rounded-lg object-cover max-h-96"
                                        />
                                        {detail.credit && (
                                          <div className='text-gray-500 text-center'>画像提供:{detail.credit}</div>
                                        )}
                                      </div>
                                    </div>
                                )}
                                                            
                                </>
                              )}
                            </div>
                            <div className={`flex-none w-7 flex items-center justify-center m-5 ${isLastPage ? 'invisible' : ''}`}>
                              <p className="text-center">
                               <button onClick={() => nextPage()}><ChevronRightIcon className="w-10 h-10"/></button>
                              </p>
                            </div>
                          </div>
                        </header>


                    </article>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}
export const getStaticPaths = async () => {
    const database = await getListFromNotion()
    let list = await getContentList(database, null)

    let resList = []
    for(let item of list){
      let res = {id : item.id}
      resList.push({params: res})
    }

   return {
        paths: resList,
        fallback: false,
    };
};

export const getStaticProps = async (context) => {
    const { id } = context.params;
    
  
    const page = await getPage(id)
    const blocks = await getBlocks(id)

    const database =  await getDatabase(blocks[0].id);
    let props = []
    for(let item of database){
      props.push(item.properties)
    }
    //画像保存がうまくできない
    await saveImageIfNeeded(props, `detail/${id}`)

    return {
        props: {
            page,
            list : database
        },
        revalidate: 1,
    };
};
