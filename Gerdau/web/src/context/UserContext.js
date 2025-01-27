import React, { useEffect, useMemo, useState } from "react";
import { getCurrentUser } from "lib/auth";

const UserContext = React.createContext({
  user: null,
  isAdmin: false,
  isOperator: false,
  isMechanic: false,
  isAdminView: false,
  setIsAdminView: null,
  setUser: null,
});

const key = "Gerdau_View_Type";

const isAdmin = (user) => user?.role.toLowerCase() === "admin";
const isOperator = (user) => user?.role.toLowerCase() === "operador";
const isMechanic = (user) => user?.role.toLowerCase() === "mecánico";

export const UserProvider = ({ children }) => {
  const initIsAdmin = () => {
    try {
      const parsed = JSON.parse(localStorage.getItem(key));
      return !!parsed;
    } catch (e) {
      return false;
    }
  };
  const [isAdminView, setIsAdminView] = useState(initIsAdmin());
  const [user, setUser] = useState(getCurrentUser());

  const value = useMemo(
    () => ({
      user,
      isAdmin: isAdmin(user?.user),
      isOperator: isOperator(user?.user),
      isMechanic: isMechanic(user?.user),
      isAdminView,
      setIsAdminView,
      setUser,
    }),
    [isAdminView, user, setIsAdminView, setUser]
  );

  useEffect(() => {
    if (isAdminView) {
      if (!isAdmin(user?.user)) {
        // check if the user is an admin
        setIsAdminView(false);
      }
    }
    localStorage.setItem(key, JSON.stringify(isAdminView));
  }, [isAdminView]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const UserConsumer = UserContext.Consumer;

export default UserContext;
