import { createAction } from "redux-actions";
import { PieceActionTypes } from "./types";
import { getAllPieces } from "service/piece";
import { Action } from "redux";
import { RootState } from "redux/reducer";
import Errors from "lib/errorMessages";
import { ClientError } from "lib/exceptions";
import { ThunkAction } from "redux-thunk";

const fetchPieces = createAction(PieceActionTypes.FETCH_PIECES);
const fetchPiecesSuccess = createAction(
  PieceActionTypes.FETCH_PIECES_SUCCESS,
  (pieces: any) => ({
    pieces,
  })
);

const fetchPiecesError = createAction(
  PieceActionTypes.FETCH_PIECES_ERROR,
  (message: string) => ({
    message,
  })
);

export const doFetchPieces =
  (): ThunkAction<void, RootState, unknown, Action<string>> =>
  async (dispatch) => {
    dispatch(fetchPieces());
    return await getAllPieces().then(
      (response: any) => {
        dispatch(fetchPiecesSuccess(response));
        return response;
      },
      (error: any) => {
        const _message = Errors.PIECES_ERROR;
        const message =
          error instanceof ClientError ? _message : Errors.GENERIC_ERROR;
        dispatch(fetchPiecesError(message));
      }
    );
  };
