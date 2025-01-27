import { createAction } from "redux-actions";
import { StageActionTypes } from "./types";
import { getAllStages } from "service/stage";
import Errors from "lib/errorMessages";
import { ClientError } from "lib/exceptions";

const fetchStages = createAction(StageActionTypes.FETCH_STAGES);
const fetchStagesSuccess = createAction(
  StageActionTypes.FETCH_STAGES_SUCCESS,
  (stages: any) => ({
    stages,
  })
);

const fetchStagesError = createAction(
  StageActionTypes.FETCH_STAGES_ERROR,
  (message: string) => ({
    message,
  })
);

export const doFetchStages = () => {
  return async (dispatch: any) => {
    dispatch(fetchStages());
    return await getAllStages()
      .then((response: any) => {
        dispatch(fetchStagesSuccess(response));
        return response;
      })
      .catch((error: any) => {
        const _message = Errors.STAGES_ERROR;
        const message =
          error instanceof ClientError ? _message : Errors.GENERIC_ERROR;
        dispatch(fetchStagesError(message));
      });
  };
};
