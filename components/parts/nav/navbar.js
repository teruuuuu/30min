import Link from "next/link";
import React, { useContext } from 'react';
import { useLocale } from "../utils/locale";
import SwitchLang from "./parts/menu/switchLang";
import LocaleContext from "./context/localeContext";

export default function Navigation({  }) {
  const { locale, setLocale } = useContext(LocaleContext);
  const { json } = useLocale(locale)

  const logoSrc = `/image/logo-${locale}.png`

  let textClass = "text-secondary me-auto mb-2 mb-lg-0 ms-lg-4"
  return (
    <nav className="static top-0 z-50 flex-shrink-0 py-4 bg-white ">
        <div className="container flex flex-col items-start justify-between px-6 mx-auto md:flex-row md:items-center">
            <Link href={`/`} className="text-lg font-bold">{json.navigation.title}</Link>
            <div className="absolute flex justify-end md:static top-2 right-4">
              <SwitchLang currentLocale={locale} />
           </div>
        </div>
    </nav>
  );
}