import _en from "@/utils/translations/enToId.json";

const en: { [key: string]: string } = _en;

export const localization = (sentences: string, lang: string) => {
  if (lang === "id") return en[sentences] ?? sentences;
  return sentences;
};
