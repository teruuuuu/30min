// context/ThemeContext.js
import { createContext, useState, useEffect } from 'react';
const LocaleContext = createContext();

export function LocaleProvider({ children }) {
    // URLクエリパラメータから言語を取得する関数
    const getQueryParamLang = () => {
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('lang');
      }
      return null;
    };
  
    // クエリパラメータから言語を取得
    const queryLang = getQueryParamLang();
    const [locale, setLocale] = useState("ja");

    useEffect(() => {
      // クエリパラメータが存在する場合はそれを使用
      if (queryLang) {
        setLocale(queryLang);
      } else {
        // ブラウザの言語設定を使用
        const userLocale = navigator.language || navigator.userLanguage || '';
        if (userLocale.startsWith('ja')) {
          setLocale('ja');
        } else {
          setLocale('en');
        }
      }
    }, [queryLang]);

    

    return (
      <LocaleContext.Provider value={{ locale, setLocale }}>
        {children}
      </LocaleContext.Provider>
    );
}

export default LocaleContext;
