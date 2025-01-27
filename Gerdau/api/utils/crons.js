var cron = require("node-cron");
import FaultService from "../controllers/faultController.js";
import CauseService from "../controllers/causeController.js";
import SolutionService from "../controllers/solutionController.js";
import UserService from "../controllers/userController.js";
import sequelize from "../db/dbconection.js";
import { sendMailCron } from "../utils/sendMail.js";

const faultServices = new FaultService();
const causeServices = new CauseService();
const solutionServices = new SolutionService();
const userServices = new UserService();

export default async function crons(req, res) {
  // seconds(op) minutes hour day_mounth mounth day_week
  // this case - 10 minutes
  cron.schedule("0 */30 * * * *", async () => {
    const faults = await faultServices.getFault();
    faults.forEach(async (fault) => {
      const responsible = await userServices.getOneUserId(fault.responsibleId);
      sendMailCron({
        email: responsible.email,
        userName: responsible.name,
        reason: process.env.FAULT + " " + fault.name,
        status: process.env.PROGRESS,
        url: process.env.URL_FAULT + fault.id,
      });
    });
  });
  // this case - 10 minutes
  cron.schedule("0 */30 * * * *", async () => {
    const causes = await causeServices.getCause();
    causes.forEach(async (cause) => {
      const responsibles = await userServices.getUser(process.env.IN_CHARGE);
      responsibles.forEach((responsible) => {
        sendMailCron({
          email: responsible.email,
          userName: responsible.name,
          reason: process.env.CAUSE + " " + cause.name,
          status: process.env.PENDIND,
          url: process.env.URL_CAUSE + cause.id,
        });
      });
    });
  });
  // this case - 10 minutes
  cron.schedule("0 */30 * * * *", async () => {
    const solutions = await solutionServices.getSolution();
    solutions.forEach(async (solution) => {
      const responsibles = await userServices.getUser(process.env.IN_CHARGE);
      responsibles.forEach((responsible) => {
        sendMailCron({
          email: responsible.email,
          userName: responsible.name,
          reason: process.env.SOLUTION + " " + solution.name,
          status: process.env.PENDIND,
          url: process.env.URL_SOLUTION + solution.id,
        });
      });
    });
  });
}
