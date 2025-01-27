const sessionKey = "session";

export const getSession = () => {
  const session = window.localStorage.getItem(sessionKey);
  if (session !== "undefined") {
    return session ? session : null;
  }
};

export const setSession = (session) => {
  window.localStorage.setItem(sessionKey, session);
};

export const removeSession = () => {
  window.localStorage.removeItem(sessionKey);
};
