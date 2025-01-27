import MachineRouter from "./machineRouter.js";
import CauseFileRouter from "./causeFileRouter.js";
import CauseRouter from "./causeRouter.js";
import ComponentRouter from "./componentRouter.js";
import UserRouter from "./userRouter.js";
import PieceRouter from "./pieceRouter.js";
import FaultRouter from "./faultRouter.js";
import FaultFileRouter from "./faultFileRouter.js";
import MachineFileRouter from "./machineFileRouter.js";
import PieceFileRouter from "./pieceFileRouter.js";
import ComponentFileRouter from "./componentFileRouter.js";
import PlantRouter from "./plantRouter.js";
import AreaRouter from "./areaRouter.js";
import SearchRouter from "./searchRouter.js";
import SublevelRouter from "./sublevelRouter.js";
import SolutionRouter from "./solutionRouter.js";
import SolutionFileRouter from "./solutionFileRouter.js";
import StudyRouter from "./studyRouter.js";
import StudyFileRouter from "./studyFileRouter.js";
import { Router } from "express";
import { verifyToken } from "../utils/verifyToken.js";
import MethodRouter from "./methodRouter.js";
import MethodFileRouter from "./methodFileRouter.js";
import PasswordTokenRouter from "./passwordTokenRouter.js";
import TaskRouter from "./taskRouter.js";
import ReportRouter from "./reportRouter.js";
import ErrorRouter from "./errorRouter.js";
import MachineStageRouter from "./machineStageRouter";

export default class ApiRouter {
  machineRouter = null;
  faultRouter = null;
  taskRouter = null;
  causeRouter = null;
  causeFileRouter = new CauseFileRouter();
  componentRouter = new ComponentRouter();
  userRouter = new UserRouter();
  pieceRouter = new PieceRouter();
  faultFileRouter = new FaultFileRouter();
  machineFileRouter = new MachineFileRouter();
  pieceFileRouter = new PieceFileRouter();
  componentFileRouter = new ComponentFileRouter();
  plantRouter = new PlantRouter();
  areaRouter = new AreaRouter();
  searchRouter = new SearchRouter();
  sublevelRouter = new SublevelRouter();
  solutionRouter = new SolutionRouter();
  solutionFileRouter = new SolutionFileRouter();
  studyRouter = new StudyRouter();
  studyFileRouter = new StudyFileRouter();
  methodRouter = new MethodRouter();
  methodFileRouter = new MethodFileRouter();
  passwordTokenRouter = new PasswordTokenRouter();
  reportRouter = new ReportRouter();
  errorRouter = new ErrorRouter();
  machineStageRouter = new MachineStageRouter();

  constructor(deps) {
    this.router = Router();
    this.machineRouter = new MachineRouter(deps);
    this.faultRouter = new FaultRouter(deps);
    this.causeRouter = new CauseRouter(deps);
    this.taskRouter = new TaskRouter(deps);
    this.router.use("/machine", verifyToken, this.machineRouter.router);
    this.router.use("/causeFile", verifyToken, this.causeFileRouter.router);
    this.router.use("/cause", verifyToken, this.causeRouter.router);
    this.router.use("/component", verifyToken, this.componentRouter.router);
    this.router.use("/machineFile", verifyToken, this.machineFileRouter.router);
    this.router.use("/user", this.userRouter.router);
    this.router.use(
      "/componentFile",
      verifyToken,
      this.componentFileRouter.router
    );
    this.router.use("/pieceFile", verifyToken, this.pieceFileRouter.router);
    this.router.use("/piece", verifyToken, this.pieceRouter.router);
    this.router.use("/fault", this.faultRouter.router);
    this.router.use("/faultFile", verifyToken, this.faultFileRouter.router);
    this.router.use("/plant", verifyToken, this.plantRouter.router);
    this.router.use("/area", verifyToken, this.areaRouter.router);
    this.router.use("/search", this.searchRouter.router);
    this.router.use("/sublevel", verifyToken, this.sublevelRouter.router);
    this.router.use("/solution", verifyToken, this.solutionRouter.router);
    this.router.use(
      "/solutionFile",
      verifyToken,
      this.solutionFileRouter.router
    );
    this.router.use("/study", verifyToken, this.studyRouter.router);
    this.router.use("/studyFile", verifyToken, this.studyFileRouter.router);
    this.router.use("/method", verifyToken, this.methodRouter.router);
    this.router.use("/methodFile", verifyToken, this.methodFileRouter.router);
    this.router.use("/passwordToken", this.passwordTokenRouter.router);
    this.router.use("/task", verifyToken, this.taskRouter.router);
    this.router.use("/report", this.reportRouter.router);
    this.router.use("/error", verifyToken, this.errorRouter.router);
    this.router.use("/stage", verifyToken, this.machineStageRouter.router);
  }
}
