import { PieceActionTypes } from "./types";

const initialState = {
  currentPiece: {},
  loading: false,
  error: null,
  pieces: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case PieceActionTypes.FETCH_PIECES:
      return {
        ...state,
        loading: true,
        error: null,
        pieces: null,
      };
    case PieceActionTypes.FETCH_PIECES_SUCCESS:
      return {
        ...state,
        loading: false,
        pieces: action.payload.pieces,
      };
    case PieceActionTypes.FETCH_PIECES_ERROR:
      return {
        ...state,
        error: action.payload.message,
        loading: false,
      };
    default:
      return state;
  }
};

export default reducer;
