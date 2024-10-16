import Head from "next/head";
import Footer from './parts/nav/footer'
import Nav from './parts/nav/nav'
import Breadcrumb from "./parts/nav/breadcrumb";

export default function Layout({ children, breadcrumb }) {

  return (
    <>
      <Head>
        <meta name="description" content="Japan, Japanese, School, Tucson, children, class, culture, kids, language, クラス, ツーソン, 子ども, 学校, 日本, 日本語" />
        <meta name="keywords" content="Japan, Japanese, School, Tucson, children, class, culture, kids, language, クラス, ツーソン, 子ども, 学校, 日本, 日本語" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
        <Nav />
        {breadcrumb && ( 
          <div className="md:ml-28">
            <Breadcrumb parents={breadcrumb.parents} current={breadcrumb.current} />
          </div>
        )}
        <main className="">{children}</main>
        <Footer />
    </>
  )
}
