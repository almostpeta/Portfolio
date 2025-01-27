import { createAction } from "redux-actions";
import { TaskActionTypes } from "./types";
import { getTaskById, getAllTasks, getTasksByUser } from "service/task";
import Errors from "lib/errorMessages";
import { ClientError } from "lib/exceptions";

const fetchTask = createAction(TaskActionTypes.FETCH_TASK);
const fetchTasks = createAction(TaskActionTypes.FETCH_TASKS);

const fetchTasksByUser = createAction(TaskActionTypes.FETCH_TASKS_BY_USER);

const fetchTaskSuccess = createAction(
  TaskActionTypes.FETCH_TASK_SUCCESS,
  (task: any) => ({
    task,
  })
);
const fetchTasksByUserSuccess = createAction(
  TaskActionTypes.FETCH_TASKS_BY_USER_SUCCESS,
  (tasks: any) => ({
    tasks,
  })
);

const fetchTasksSuccess = createAction(
  TaskActionTypes.FETCH_TASKS_SUCCESS,
  (tasks: any) => ({
    tasks,
  })
);

const fetchTaskError = createAction(
  TaskActionTypes.FETCH_TASK_ERROR,
  (message: string) => ({
    message,
  })
);
const fetchTasksError = createAction(
  TaskActionTypes.FETCH_TASKS_ERROR,
  (message: string) => ({
    message,
  })
);

const fetchTasksByUserError = createAction(
  TaskActionTypes.FETCH_TASKS_BY_USER_ERROR,
  (message: string) => ({
    message,
  })
);

export const doFetchTask = (id: string) => {
  return async (dispatch: any) => {
    dispatch(fetchTask());
    return await getTaskById(id)
      .then((response: any) => {
        dispatch(fetchTaskSuccess(response));
        return response;
      })
      .catch((error: any) => {
        const _message = Errors.TASKS_ERROR;
        const message =
          error instanceof ClientError ? _message : Errors.GENERIC_ERROR;
        dispatch(fetchTaskError(message));
      });
  };
};

export const doFetchTasks = () => {
  return async (dispatch: any) => {
    dispatch(fetchTasks());
    return await getAllTasks()
      .then((response: any) => {
        dispatch(fetchTasksSuccess(response));
        return response;
      })
      .catch((error: any) => {
        const _message = Errors.TASKS_ERROR;
        const message =
          error instanceof ClientError ? _message : Errors.GENERIC_ERROR;
        dispatch(fetchTasksError(message));
      });
  };
};

export const doFetchTasksByUser = (userId: any) => {
  return async (dispatch: any) => {
    dispatch(fetchTasksByUser());
    return await getTasksByUser(userId)
      .then((response: any) => {
        dispatch(fetchTasksByUserSuccess(response));
        return response;
      })
      .catch((error: any) => {
        const _message = Errors.TASKS_ERROR;
        const message =
          error instanceof ClientError ? _message : Errors.GENERIC_ERROR;
        dispatch(fetchTasksByUserError(message));
      });
  };
};
