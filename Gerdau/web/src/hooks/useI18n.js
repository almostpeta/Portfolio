import { useContext } from "react";

import I18nContext from "../context/I18nContext";

const useI18n = () => {
  const context = useContext(I18nContext);
  if (typeof context === "undefined") {
    throw new Error("useI18n must be used within a I18nProvider");
  }

  return context;
};

export default useI18n;
