import { createAction } from "redux-actions";
import { ComponentActionTypes } from "./types";
import {
  getAllComponents,
  getComponentById,
  getAllComponentEvents,
} from "service/component";
import Errors from "lib/errorMessages";
import { ClientError } from "lib/exceptions";

const fetchComponents = createAction(ComponentActionTypes.FETCH_COMPONENTS);
const fetchSingleComponent = createAction(
  ComponentActionTypes.FETCH_SINGLE_COMPONENT
);

const fetchComponentsSuccess = createAction(
  ComponentActionTypes.FETCH_COMPONENTS_SUCCESS,
  (components: any) => ({
    components,
  })
);
const fetchSingleComponentSuccess = createAction(
  ComponentActionTypes.FETCH_SINGLE_COMPONENT_SUCCESS,
  (component: any) => ({
    component,
  })
);

const fetchComponentsError = createAction(
  ComponentActionTypes.FETCH_COMPONENTS_ERROR,
  (message: string) => ({
    message,
  })
);
const fetchSingleComponentError = createAction(
  ComponentActionTypes.FETCH_SINGLE_COMPONENT_ERROR,
  (message: string) => ({
    message,
  })
);

const fetchComponentEvents = createAction(
  ComponentActionTypes.FETCH_COMPONENT_EVENTS
);
const fetchComponentEventsSuccess = createAction(
  ComponentActionTypes.FETCH_COMPONENT_EVENTS_SUCCESS,
  (events: any) => ({
    events,
  })
);

const fetchComponentEventsError = createAction(
  ComponentActionTypes.FETCH_COMPONENT_EVENTS_ERROR,
  (message: string) => ({
    message,
  })
);

export const doFetchComponents = () => {
  return async (dispatch: any) => {
    dispatch(fetchComponents());
    return await getAllComponents()
      .then((response: any) => {
        dispatch(fetchComponentsSuccess(response));
        return response;
      })
      .catch((error: any) => {
        const _message = Errors.COMPONENTS_ERROR;
        const message =
          error instanceof ClientError ? _message : Errors.GENERIC_ERROR;
        dispatch(fetchComponentsError(message));
      });
  };
};

export const doFetchComponent = (id: string) => {
  return (dispatch: any) => {
    dispatch(fetchSingleComponent());
    return getComponentById(id)
      .then((response: any) => {
        dispatch(fetchSingleComponentSuccess(response));
        return response;
      })
      .catch((error: any) => {
        const _message = Errors.COMPONENTS_ERROR;
        const message =
          error instanceof ClientError ? _message : Errors.GENERIC_ERROR;
        dispatch(fetchSingleComponentError(message));
      });
  };
};

export const doFetchComponentEvents = (
  id: string,
  type: string,
  order: string,
  startDate: Date,
  endDate: Date
) => {
  return (dispatch: any) => {
    dispatch(fetchComponentEvents());
    return getAllComponentEvents(id, type, order, startDate, endDate)
      .then((response: any) => {
        dispatch(fetchComponentEventsSuccess(response));
        return response;
      })
      .catch((error: any) => {
        const _message = Errors.COMPONENTS_ERROR;
        const message =
          error instanceof ClientError ? _message : Errors.GENERIC_ERROR;
        dispatch(fetchComponentEventsError(message));
      });
  };
};
