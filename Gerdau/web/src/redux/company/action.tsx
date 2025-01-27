import { createAction } from "redux-actions";
import { CompanyActionTypes } from "./types";
import { getAllFloors } from "service/floor";
import { getAllAreas } from "service/area";
import { getAllSublevels } from "service/sublevel";
import Errors from "lib/errorMessages";
import { ClientError } from "lib/exceptions";

const fetchPlants = createAction(CompanyActionTypes.FETCH_PLANTS);
const fetchPlantsSuccess = createAction(
  CompanyActionTypes.FETCH_PLANTS_SUCCESS,
  (plants: any) => ({
    plants,
  })
);

const fetchPlantsError = createAction(
  CompanyActionTypes.FETCH_PLANTS_ERROR,
  (message: string) => ({
    message,
  })
);

const fetchSublevels = createAction(CompanyActionTypes.FETCH_SUBLEVELS);
const fetchSublevelsSuccess = createAction(
  CompanyActionTypes.FETCH_SUBLEVELS_SUCCESS,
  (sublevels: any) => ({
    sublevels,
  })
);

const fetchSublevelsError = createAction(
  CompanyActionTypes.FETCH_SUBLEVELS_ERROR,
  (message: string) => ({
    message,
  })
);

const fetchAreas = createAction(CompanyActionTypes.FETCH_AREAS);
const fetchAreasSuccess = createAction(
  CompanyActionTypes.FETCH_AREAS_SUCCESS,
  (areas: any) => ({
    areas,
  })
);

const fetchAreasError = createAction(
  CompanyActionTypes.FETCH_AREAS_ERROR,
  (message: string) => ({
    message,
  })
);

export const doFetchSublevels = () => (dispatch: any) => {
  dispatch(fetchSublevels());
  return getAllSublevels()
    .then((response: any) => {
      dispatch(fetchSublevelsSuccess(response));
      return response;
    })
    .catch((error: any) => {
      const _message = Errors.SUBLEVELS_ERROR;
      const message =
        error instanceof ClientError ? _message : Errors.GENERIC_ERROR;
      dispatch(fetchSublevelsError(message));
    });
};

export const doFetchPlants = () => (dispatch: any) => {
  dispatch(fetchPlants());
  return getAllFloors()
    .then((response: any) => {
      dispatch(fetchPlantsSuccess(response));
      return response;
    })
    .catch((error: any) => {
      const _message = Errors.PLANTS_ERROR;
      const message =
        error instanceof ClientError ? _message : Errors.GENERIC_ERROR;
      dispatch(fetchPlantsError(message));
    });
};

export const doFetchAreas = () => (dispatch: any) => {
  dispatch(fetchAreas());
  return getAllAreas()
    .then((response: any) => {
      dispatch(fetchAreasSuccess(response));
      return response;
    })
    .catch((error: any) => {
      const _message = Errors.AREAS_ERROR;
      const message =
        error instanceof ClientError ? _message : Errors.GENERIC_ERROR;
      dispatch(fetchAreasError(message));
    });
};
