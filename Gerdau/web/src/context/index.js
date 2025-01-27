import React from "react";

import { I18nProvider } from "./I18nContext";
import { UserProvider } from "./UserContext";

const AppProviders = ({ children }) => (
  <I18nProvider>
    <UserProvider>{children}</UserProvider>
  </I18nProvider>
);

export default AppProviders;
