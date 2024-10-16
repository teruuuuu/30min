import "../styles/globals.css";

import { LocaleProvider } from "../components/context/localeContext.js"

function MyApp({ Component, pageProps }) {
  

  return (
  <>
    <LocaleProvider> 
      <Component {...pageProps} />
    </LocaleProvider>
  </>
  );
}

export default MyApp;
