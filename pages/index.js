import React, { useContext, useState } from 'react';
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
  const [hoveredCard, setHoveredCard] = useState(null);
  const [filterTag, setFilterTag] = useState('all');

  const entityList = []
  for(const item of list){
    const entity = new TopListEntity(item, locale == "ja")
    entityList.push(entity)
  }
  entityList.sort((a, b) => a.ordering - b.ordering)

  // ユニークなタグを抽出
  const uniqueTags = ['all', ...new Set(entityList.map(entity => entity.tag.name))];

  // フィルタリング
  const filteredList = filterTag === 'all' 
    ? entityList 
    : entityList.filter(entity => entity.tag.name === filterTag);

  return (
    <Layout>
      <Head>
        <title>{lang.meta_title}(${lang.sub_title})</title>
        <meta name="description" content={`${lang.title} - ${lang.description}`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
        </div>

        <div className="relative z-10 container mx-auto px-6 py-20">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent animate-fade-in">
              {lang.title || "Discover Amazing Content"}
            </h1>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {uniqueTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setFilterTag(tag)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                  filterTag === tag
                    ? 'bg-white text-gray-900 shadow-lg'
                    : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm'
                }`}
              >
                {tag === 'all' ? 'All' : tag.charAt(0).toUpperCase() + tag.slice(1)}
              </button>
            ))}
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredList.map((entity, index) => {
              let detailUrl = `/detail/${entity.id}/`
              if(!entity.active){
                detailUrl = `/prepare/`
              }

              return (
                <div 
                  key={entity.id}
                  className="group relative animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onMouseEnter={() => setHoveredCard(entity.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <Link href={detailUrl}>
                    <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl overflow-hidden border border-white/20 hover:border-white/40 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 shadow-xl hover:shadow-2xl">
                      {/* Image Container */}
                      <div className="relative h-48 overflow-hidden">
                        <Image 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                          src={entity.image} 
                          layout="fill" 
                          objectFit="cover" 
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <h3 className="text-white font-bold text-lg mb-2 line-clamp-2 min-h-[56px] group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-cyan-400 group-hover:bg-clip-text transition-all duration-300">
                          {entity.title}
                        </h3>
                        <p className="text-gray-300 text-sm mb-4 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                          {entity.date}
                        </p>

                      {/* Tag Badge: ここに移動し、絶対配置を削除して通常のフローにする */}
                      <div className="mb-4"> {/* 下に余白を追加して他の要素との間にスペースを作る */}
                        <span className={`${entity.tagClass} backdrop-blur-sm bg-opacity-90 shadow-lg`}>
                          {entity.tag.name}
                        </span>
                      </div>
                        
                        {/* Hover Effect Arrow */}
                        <div className="flex items-center text-cyan-400 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-2 transition-all duration-300">
                          <span className="text-sm font-medium">Read More</span>
                          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>

                      {/* Glow Effect */}
                      <div 
                        className={`absolute inset-0 rounded-3xl transition-opacity duration-300 ${
                          hoveredCard === entity.id 
                            ? 'opacity-100 bg-gradient-to-r from-purple-500/20 via-transparent to-cyan-500/20' 
                            : 'opacity-0'
                        }`}
                      ></div>
                    </div>
                  </Link>
                </div>
              )
            })}
          </div>

          {/* Empty State */}
          {filteredList.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-white mb-2">No content found</h3>
              <p className="text-gray-400">Try selecting a different filter</p>
            </div>
          )}
        </div>

        {/* Floating Elements */}
        <div className="absolute bottom-10 right-10 animate-bounce">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full opacity-50"></div>
        </div>
      </section>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

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

        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
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

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </Layout>
  );
}

export const getStaticProps = async (context) => {
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