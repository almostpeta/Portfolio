import moment from "moment";
const storage = localStorage;

const tokenKey = "gerdau_auth";
const userKey = "gerdau_curr";

export const setToken = ({ token, expiresIn }: any) => {
  const expiresAt = moment().add(expiresIn, "seconds");
  storage.setItem(
    tokenKey,
    JSON.stringify({
      token,
      expiresAt,
    })
  );
};

export const setCurrentUser = (user: any) => {
  storage.setItem(userKey, JSON.stringify(user));
};

export const getCurrentUser = () => {
  const encodedUser = storage.getItem(userKey);

  if (encodedUser) {
    try {
      const user = JSON.parse(encodedUser);
      return user;
    } catch (e) {
      return null;
    }
  }
  return null;
};

export const getToken = () => {
  const encodedStoredToken = storage.getItem(tokenKey);
  if (encodedStoredToken) {
    try {
      const token = JSON.parse(encodedStoredToken);
      return token;
    } catch (e) {
      return null;
    }
  }
  return null;
};

export function deleteCurrentUser() {
  storage.removeItem(userKey);
}

export function deleteToken() {
  storage.removeItem(tokenKey);
  storage.removeItem(userKey);
  storage.removeItem("Gerdau_View_Type");
}
