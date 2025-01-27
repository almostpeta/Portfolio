import { ComponentActionTypes } from "./types";

const initialState = {
  currentComponent: {},
  loading: false,
  error: null,
  components: null,
  events: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ComponentActionTypes.FETCH_COMPONENTS:
      return {
        ...state,
        loading: true,
        error: null,
        components: null,
      };
    case ComponentActionTypes.FETCH_COMPONENTS_SUCCESS:
      return {
        ...state,
        loading: false,
        components: action.payload.components,
      };
    case ComponentActionTypes.FETCH_COMPONENTS_ERROR:
      return {
        ...state,
        error: action.payload.message,
        loading: false,
      };
    case ComponentActionTypes.FETCH_SINGLE_COMPONENT:
      return {
        ...state,
        loading: true,
        error: null,
        currentComponent: null,
      };
    case ComponentActionTypes.FETCH_SINGLE_COMPONENT_SUCCESS:
      console.log(action.payload.component);
      return {
        ...state,
        loading: false,
        error: null,
        currentComponent: action.payload.component,
      };
    case ComponentActionTypes.FETCH_SINGLE_COMPONENT_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload.message,
        currentComponent: null,
      };

    case ComponentActionTypes.FETCH_COMPONENT_EVENTS:
      return {
        ...state,
        loading: false,
        error: null,
        events: null,
      };
    case ComponentActionTypes.FETCH_COMPONENT_EVENTS_SUCCESS:
      return {
        ...state,
        loading: false,
        events: action.payload.events,
      };
    case ComponentActionTypes.FETCH_COMPONENT_EVENTS_ERROR:
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
