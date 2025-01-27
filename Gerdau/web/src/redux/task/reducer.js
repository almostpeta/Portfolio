import { TaskActionTypes } from "./types";

const initialState = {
  currentTask: null,
  loading: false,
  error: null,
  tasks: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case TaskActionTypes.FETCH_TASK:
      return {
        ...state,
        loading: true,
        error: null,
        currentTask: null,
      };
    case TaskActionTypes.FETCH_TASKS:
      return {
        ...state,
        loading: true,
        error: null,
        tasks: null,
      };

    case TaskActionTypes.FETCH_TASKS_BY_USER:
      return {
        ...state,
        loading: true,
        error: null,
        tasks: null,
      };
    case TaskActionTypes.FETCH_TASK_SUCCESS:
      return {
        ...state,
        loading: false,
        currentTask: action.payload.task,
      };
    case TaskActionTypes.FETCH_TASKS_SUCCESS:
      return {
        ...state,
        loading: false,
        tasks: action.payload.tasks,
      };
    case TaskActionTypes.FETCH_TASKS_BY_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        tasks: action.payload.tasks,
      };
    case TaskActionTypes.FETCH_TASK_ERROR:
      return {
        ...state,
        error: action.payload.message,
        loading: false,
        currentTask: null,
      };
    case TaskActionTypes.FETCH_TASKS_ERROR:
      return {
        ...state,
        error: action.payload.message,
        loading: false,
        tasks: null,
      };
    case TaskActionTypes.FETCH_TASKS_BY_USER_ERROR:
      return {
        ...state,
        error: action.payload.message,
        loading: false,
        tasks: null,
      };
    default:
      return state;
  }
};

export default reducer;
