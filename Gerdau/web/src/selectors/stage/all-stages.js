import { createSelector } from "reselect";

export default createSelector(
  (state) => state.stage,
  (stages) => stages?.allStages || []
);
