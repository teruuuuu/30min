import React, { useContext } from 'react';
import Layout from '../../components/layout'
import Link from 'next/link';


export default function Prepare({  }) {


  return (
    <Layout>
      <section className="bg-white py-8">
        <div className="container mx-auto flex items-center flex-wrap pt-4 pb-12">
          <nav id="store" className="w-full z-30 top-0 px-6 py-1">
            <div className="w-full container mx-auto flex flex-wrap items-center justify-between mt-0 px-2 py-3 gap-8">
              
              <section className='w-full'>
                <div className='w-full flex-1 flex items-center justify-center'>
                    <h2 className='text-4xl'>ただいま準備中</h2>
                </div>
                <div className='w-full flex-1 flex items-center justify-center my-10'>
                    <Link href={`/`} className='bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded'>ホームに戻る</Link>
                </div>
              </section>
            </div>
          </nav>
        </div>
      </section>
    </Layout>
  )
}