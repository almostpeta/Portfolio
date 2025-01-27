import axiosAPI from "../api/axios";

const authURL = "user";
const loginRoute = "login";

export const login = async (email, password) => {
  const formData = new FormData();
  formData.append("email", email);
  formData.append("password", password);
  const { data, error } = await axiosAPI.post(
    `${authURL}/${loginRoute}`,
    formData
  );
  console.log("error", error);
  if (error) {
    let message = "";
    if (error === 401 || error.status === 401) {
      message = "Invalid email/password combination.";
    } else {
      message = "Something went wrong...";
    }
    throw new Error(message);
  }
  // setSession(data.items)
  return data;
};
