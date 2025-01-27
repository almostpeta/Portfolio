import { combineReducers } from "redux";

import UserReducer from "redux/user/reducer";
import MachineReducer from "redux/machine/reducer";
import CompanyReducer from "redux/company/reducer";
import ComponentReducer from "redux/component/reducer";
import FaultReducer from "redux/fault/reducer";
import PieceReducer from "redux/piece/reducer";
import StudyReducer from "redux/study/reducer";
import CauseReducer from "redux/cause/reducer";
import SolutionReducer from "redux/solution/reducer";
import MethodReducer from "redux/method/reducer";
import TaskReducer from "redux/task/reducer";
import StageReducer from "redux/stage/reducer";

const rootReducer = combineReducers({
  user: UserReducer,
  machine: MachineReducer,
  company: CompanyReducer,
  component: ComponentReducer,
  fault: FaultReducer,
  piece: PieceReducer,
  study: StudyReducer,
  cause: CauseReducer,
  solution: SolutionReducer,
  method: MethodReducer,
  task: TaskReducer,
  stage: StageReducer,
});

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;
