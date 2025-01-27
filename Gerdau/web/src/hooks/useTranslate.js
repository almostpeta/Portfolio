import useI18n from "./useI18n";

const useTranslate = () => {
  const { t } = useI18n();

  return t;
};

export default useTranslate;
