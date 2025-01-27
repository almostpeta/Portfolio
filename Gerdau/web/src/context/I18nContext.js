import Polyglot from "node-polyglot";
import React, { useEffect, useMemo, useRef, useState } from "react";
import phrases from "../locales";

const defaultLocale = process.env.REACT_APP_LOCALE || "es";

const I18nContext = React.createContext();

export const I18nProvider = ({ children }) => {
  const [locale] = useState(defaultLocale);

  const polyglotRef = useRef(
    new Polyglot({
      locale,
      phrases: phrases[locale],
    })
  );

  useEffect(() => {
    polyglotRef.current.locale(locale);
    polyglotRef.current.replace(phrases[locale]);
  }, [locale]);

  const value = useMemo(
    () => ({
      t: polyglotRef.current.t.bind(polyglotRef.current),
    }),
    []
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export default I18nContext;
