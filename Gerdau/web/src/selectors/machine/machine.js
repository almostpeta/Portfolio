import { createSelector } from "reselect";

export default createSelector(
  (state) => state.machines.currentMachine,
  (currentMachine) => ({
    ...currentMachine,
    stages: currentMachine.stages.map((stageObj) => stageObj.name),
  })
);
