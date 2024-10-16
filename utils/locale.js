import en from "../const/locale/en.json";
import ja from "../const/locale/ja.json";

export const useLocale = (locale) => {
  const json = locale === "en" ? en : ja;
  let lang = json.navigation
  const metaTitleExtension = `- ${lang.meta_title}(${lang.sub_title})`
  return { locale, json, metaTitleExtension };
}