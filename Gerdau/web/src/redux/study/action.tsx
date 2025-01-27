import { createAction } from "redux-actions";
import { StudyActionTypes } from "./types";
import { getStudyById, getStudies } from "service/study";
import Errors from "lib/errorMessages";
import { ClientError } from "lib/exceptions";

const fetchStudy = createAction(StudyActionTypes.FETCH_STUDY);
const fetchStudySuccess = createAction(
  StudyActionTypes.FETCH_STUDY_SUCCESS,
  (study: any) => ({
    study,
  })
);

const fetchStudyError = createAction(
  StudyActionTypes.FETCH_STUDY_ERROR,
  (message: string) => ({
    message,
  })
);

const fetchStudies = createAction(StudyActionTypes.FETCH_STUDIES);
const fetchStudiesSuccess = createAction(
  StudyActionTypes.FETCH_STUDIES_SUCCESS,
  (studies: any) => ({
    studies,
  })
);

const fetchStudiesError = createAction(
  StudyActionTypes.FETCH_STUDIES_ERROR,
  (message: string) => ({
    message,
  })
);

export const doFetchStudy = (id: string) => {
  return async (dispatch: any) => {
    dispatch(fetchStudy());
    return await getStudyById(id)
      .then((response: any) => {
        dispatch(fetchStudySuccess(response));
        return response;
      })
      .catch((error: any) => {
        const _message = Errors.STUDY_ERROR;
        const message =
          error instanceof ClientError ? _message : Errors.GENERIC_ERROR;
        dispatch(fetchStudyError(message));
      });
  };
};

export const doFetchStudies = (id: string) => {
  return async (dispatch: any) => {
    dispatch(fetchStudies());
    return await getStudies()
      .then((response: any) => {
        dispatch(fetchStudiesSuccess(response));
        return response;
      })
      .catch((error: any) => {
        const _message = Errors.STUDY_ERROR;
        const message =
          error instanceof ClientError ? _message : Errors.GENERIC_ERROR;
        dispatch(fetchStudiesError(message));
      });
  };
};
