import { createAction } from "redux-actions";
import { UserActionTypes } from "./types";
import { getAllUsers, getUserById } from "service/users";
import { login } from "service/auth";
import { setToken, setCurrentUser } from "lib/auth";
import { Action } from "redux";
import { RootState } from "redux/reducer";
import Errors from "lib/errorMessages";
import { ClientError } from "lib/exceptions";
import jwtDecode from "jwt-decode";
import { ThunkAction } from "redux-thunk";

const loginUser = createAction(UserActionTypes.LOGIN_USER);
const loginUserSuccess = createAction(
  UserActionTypes.LOGIN_USER_SUCCESS,
  (user: any) => ({
    user,
  })
);
const loginUserError = createAction(
  UserActionTypes.LOGIN_USER_ERROR,
  (message: string) => ({
    message,
  })
);

const fetchUsers = createAction(UserActionTypes.FETCH_USERS);
const fetchUsersSuccess = createAction(
  UserActionTypes.FETCH_USERS_SUCCESS,
  (users: any) => ({
    users,
  })
);

const fetchUsersError = createAction(
  UserActionTypes.FETCH_USERS_ERROR,
  (message: string) => ({
    message,
  })
);

const fetchUser = createAction(UserActionTypes.FETCH_USER);
const fetchUserSuccess = createAction(
  UserActionTypes.FETCH_USER_SUCCESS,
  (user: any) => ({
    user,
  })
);
const fetchUserError = createAction(
  UserActionTypes.FETCH_USER_ERROR,
  (message: any) => ({
    message,
  })
);

export const doFetchUsers = () => {
  return (dispatch: any) => {
    dispatch(fetchUsers());
    return getAllUsers()
      .then((response: any) => {
        dispatch(fetchUsersSuccess(response));
        return response;
      })
      .catch((error: any) => {
        const _message = Errors.USERS_ERROR;
        const message =
          error instanceof ClientError ? _message : Errors.GENERIC_ERROR;
        dispatch(fetchUsersError(message));
      });
  };
};

export const doLogin =
  (
    email: string,
    password: string
  ): ThunkAction<void, RootState, unknown, Action<string>> =>
  async (dispatch) => {
    dispatch(loginUser());
    return await login(email, password)
      .then((response: any) => {
        const decoded = jwtDecode(response.token);
        setToken(response);
        setCurrentUser(response);
        dispatch(loginUserSuccess(decoded));
      })
      .catch((error: any) => {
        const _message = Errors.INVALID_CREDENTIALS;
        dispatch(loginUserError(_message));
      });
  };

export const doFetchUser = (userId: string) => {
  return (dispatch: any) => {
    dispatch(fetchUser());
    return getUserById(userId)
      .then((response: any) => {
        dispatch(fetchUserSuccess(response));
        return response;
      })
      .catch((error: any) => {
        const _message = Errors.USERS_ERROR;
        const message =
          error instanceof ClientError ? _message : Errors.GENERIC_ERROR;
        dispatch(fetchUserError(message));
      });
  };
};
