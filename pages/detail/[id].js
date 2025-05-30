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
      p: p,
    };
    
    router.replace({
      pathname: router.pathname,
      query: newQuery,
    }, undefined, { shallow: true });
  };
  
  const { locale } = useContext(LocaleContext);
  const { json, metaTitleExtension } = useLocale(locale)
  let lang = json.navigation

  if (!page || !list ) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">{json.common.not_found_article}</div>
      </div>
    );
  }

  const { p } = router.query;
  const [currentPage, setCurrentPage] = useState(p ? p : 1)
  const [isFirstPage, setFirstPage] = useState(true)
  const [isLastPage, setLasttPage] = useState(false)
  const [isImageLoading, setIsImageLoading] = useState(true)
  
  const pageCount = list.length
  const pageEntity = new TopListEntity(page, locale == "ja")
  let resList = []
  for(const item of list){
    resList.push(new PageItemEntity(item, locale == "ja", pageEntity.id))
  }
  resList.sort((a, b) => a.ordering - b.ordering)

  const [detail, setDetail] = useState(resList[currentPage-1])

  const nextPage = () => {
    const cp = Number(currentPage) + 1
    if(cp > pageCount) return
    
    setFirstPage(cp <= 1)
    setLasttPage(pageCount <= cp)
    setCurrentPage(cp)
    const detail = resList[cp-1]
    setDetail(detail)
    setIsImageLoading(true)
    updateQuery(cp)
  }
  
  const prevPage = () => {
    const cp = Number(currentPage) - 1
    if(cp < 0) return
    
    setFirstPage(cp <= 1)
    setLasttPage(pageCount <= cp)
    setCurrentPage(cp)
    const detail = resList[cp-1]
    setDetail(detail)
    setIsImageLoading(true)
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
      setIsImageLoading(true)
    }
  }, [router.query.p]);

  let pageTitle = pageEntity?.title || ""
  let pageSubTitle = pageEntity?.text || ""

  let breadcrumb = {
    parents: null,
    current: `${pageTitle} 〜 ${pageSubTitle}`
  }

  return (
    <Layout breadcrumb={breadcrumb}>
      <Head>
        <title>{pageTitle} - {metaTitleExtension}</title>
        <meta name="description" content={`${lang.about} - ${lang.description}`} />
      </Head>

      {/* Hero Header */}
      <section className="relative min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
        </div>

        <div className="relative z-10 container mx-auto px-6 py-12">
          {/* Navigation Header */}
          <div className="flex items-center justify-between mb-8">
            <Link href="/">
              <button className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors duration-300 group">
                <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back to Home</span>
              </button>
            </Link>
            
            {/* Page Counter */}
            <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white font-medium">
              {currentPage} / {pageCount}
            </div>
          </div>

          {/* Main Content Container */}
          <div className="flex items-center justify-between min-h-[80vh]">
            {/* Previous Button */}
            <button 
              onClick={prevPage}
              className={`group flex-shrink-0 w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all duration-300 hover:bg-white/20 hover:scale-110 ${isFirstPage ? 'opacity-30 cursor-not-allowed' : 'hover:shadow-lg'}`}
              disabled={isFirstPage}
            >
              <ChevronLeftIcon className="w-8 h-8 text-white group-hover:text-cyan-400 transition-colors duration-300" />
            </button>

            {/* Content Area */}
            <div className="flex-1 mx-8">
              {detail && (
                <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-8 md:p-12 shadow-2xl animate-fade-in-up">
                  {/* Title */}
                  <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                    {detail.title}
                  </h1>

                  {/* HTML Content */}
                  {detail.html && (
                    <div className="mb-8 prose prose-lg prose-invert max-w-none">
                      <ParseHtml html={detail.html} />
                    </div>
                  )}

                  {/* Content Layout */}
                  <div className="space-y-8">
                    {/* Text + Image Layout */}
                    {detail.text[0] && detail.image && (
                      <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Text Content */}
                        <div className="space-y-6">
                          <div className="prose prose-lg prose-invert max-w-none">
                            <Paragraphs value={detail.text} />
                          </div>
                        </div>

                        {/* Image */}
                        <div className="relative group">
                          <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                            {isImageLoading && (
                              <div className="absolute inset-0 bg-white/10 animate-pulse rounded-2xl flex items-center justify-center">
                                <Loading />
                              </div>
                            )}
                            <Image
                              src={detail.image}
                              alt={detail.title}
                              width={800}
                              height={400}
                              layout="responsive"
                              objectFit="cover"
                              onLoad={() => setIsImageLoading(false)}
                              className="transition-transform duration-700 group-hover:scale-105 rounded-2xl"
                            />
                          </div>
                          {detail.credit && (
                            <p className="text-gray-400 text-sm mt-3 text-center">
                              画像提供: {detail.credit}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Text Only */}
                    {detail.text[0] && !detail.image && (
                      <div className="max-w-4xl mx-auto">
                        <div className="prose prose-lg prose-invert max-w-none">
                          <Paragraphs value={detail.text} />
                        </div>
                      </div>
                    )}

                    {/* Image Only */}
                    {!detail.text[0] && detail.image && (
                      <div className="flex justify-center">
                        <div className="relative max-w-2xl group">
                          <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                            {isImageLoading && (
                              <div className="absolute inset-0 bg-white/10 animate-pulse rounded-2xl flex items-center justify-center">
                                <Loading />
                              </div>
                            )}
                            <Image
                              src={detail.image}
                              alt={detail.title}
                              width={800}
                              height={400}
                              layout="responsive"
                              objectFit="cover"
                              onLoad={() => setIsImageLoading(false)}
                              className="transition-transform duration-700 group-hover:scale-105 rounded-2xl"
                            />
                          </div>
                          {detail.credit && (
                            <p className="text-gray-400 text-sm mt-3 text-center">
                              画像提供: {detail.credit}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Next Button */}
            <button 
              onClick={nextPage}
              className={`group flex-shrink-0 w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all duration-300 hover:bg-white/20 hover:scale-110 ${isLastPage ? 'opacity-30 cursor-not-allowed' : 'hover:shadow-lg'}`}
              disabled={isLastPage}
            >
              <ChevronRightIcon className="w-8 h-8 text-white group-hover:text-cyan-400 transition-colors duration-300" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-8">
            <div className="w-full bg-white/10 rounded-full h-2 backdrop-blur-sm">
              <div 
                className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(currentPage / pageCount) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .prose-invert {
          color: rgba(255, 255, 255, 0.9);
        }

        .prose-invert h1,
        .prose-invert h2,
        .prose-invert h3,
        .prose-invert h4,
        .prose-invert h5,
        .prose-invert h6 {
          color: white;
        }

        .prose-invert p {
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.7;
        }

        .prose-invert a {
          color: #60a5fa;
        }

        .prose-invert a:hover {
          color: #3b82f6;
        }
      `}</style>
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
    await saveImageIfNeeded(props, `detail/${id}`)

    return {
        props: {
            page,
            list : database
        },
        revalidate: 1,
    };
};