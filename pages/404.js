import React, { useContext } from 'react';
import LocaleContext from '../components/context/localeContext';
import Layout from '../components/layout'
import Link from 'next/link';
import { useLocale } from '../utils/locale';

const Custom404 = () => {
    const { locale } = useContext(LocaleContext);
    const { json, metaTitleExtension } = useLocale(locale)
    let lang = json.common
    return (
        <Layout breadcrumb="">
            <div className="text-center py-16">
            <h1 className="text-6xl font-bold">404</h1>
            <p className="text-xl mt-4">{lang.not_found_page}</p>
            <Link href={`/`} className="text-blue-500 underline mt-4 block">
                {lang.back_home}
            </Link>
            </div>
        </Layout>
    );
};

export default Custom404;
