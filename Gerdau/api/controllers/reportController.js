import sequelize from "../db/dbconection.js";
import Sequelize from "sequelize";
import { SOLUTION_STATUSES } from "../utils/constants.js";

const models = sequelize.models;
const Fault = models.fault;
const Machine = models.machine;
const Component = models.component;
const Piece = models.piece;
const Cause = models.cause;
const Task = models.task;
const Solution = models.solution;
const User = models.user;

const month = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default class ReportService {
  // find all report
  async faultsByMachine() {
    const result = await Machine.findAll().map((result) => result.dataValues);
    result.forEach((row) => {
      row.faultCount =
        row.electric_faults_count +
        row.neumatic_faults_count +
        row.hydraulic_faults_count +
        row.mechanic_faults_count;
    });

    return result;
  }

  async faultsByUser() {
    const result = await sequelize.query(
      `
            select * from users u
            left join (
                select  u.id, count(f.id) as "faultCount" from faults f
                left join users u on f.responsibleId= u.id
                group by (u.id)
            ) u2 on u2.id = u.id
        `,
      { type: Sequelize.QueryTypes.SELECT }
    );
    return result;
  }

  async faultsPerMonth(year) {
    const result = await sequelize.query(
      `
            SELECT   DateName( month , DateAdd( month , MONTH(start_date_time) , 0 ) - 1 ) as "month", COUNT(*) as "faults"
            FROM      faults 
            WHERE     YEAR(start_date_time) = '${
              year || new Date().getFullYear()
            }' 
            GROUP BY  MONTH(start_date_time)
        `,
      { type: Sequelize.QueryTypes.SELECT }
    );
    const finalResult = month.map((mon) => {
      let found = false;
      let rowResult;
      for (const row of result) {
        if (row["month"] === mon) {
          found = true;
          rowResult = row;
        }
      }
      if (!found) return { month: mon, faults: 0 };
      return rowResult;
    });
    return finalResult;
  }

  async faultsPending() {
    const result = await Fault.findAll({
      where: { state: "Pendiente" },
    });
    return result;
  }

  async machineQuantity() {
    const result = await sequelize.query(
      `
      Select count(*) as total, 
        sum(case when state = 1 then 1 else 0 end) as produccion, 
        sum(case when state = 2 then 1 else 0 end) as mantenimiento,
        sum(case when state = 3 then 1 else 0 end) as detenida 
      from machines 
        `,
      { type: Sequelize.QueryTypes.SELECT }
    );
    return result;
  }

  async faultsQuantity() {
    const result = await sequelize.query(
      `
        Select count(*) as total, 
          sum(case when state = 'Resuelta' then 1 else 0 end) as Resuelta, 
          sum(case when state = 'Pendiente' then 1 else 0 end) as Pendiente,
          sum(case when state = 'En Progreso' then 1 else 0 end) as EnProgreso 
        from faults 
      `,
      { type: Sequelize.QueryTypes.SELECT }
    );
    return result;
  }

  async faultsDaysQuantity() {
    const result = await sequelize.query(
      `
      SELECT sum(case when DATEDIFF(DAY, start_date_time, GETDATE())  < 365 then 1 else 0 end) as año, 
            sum(case when DATEDIFF(DAY, start_date_time, GETDATE()) < 30 then 1 else 0 end) as mes,
            sum(case when DATEDIFF(DAY, start_date_time, GETDATE()) < 7 then 1 else 0 end) as semana
      from faults
      `,
      { type: Sequelize.QueryTypes.SELECT }
    );
    return result;
  }

  async tasksQuantity() {
    const result = await sequelize.query(
      `
      Select count(*) as Total, 
        sum(case when status = 'No Completado' then 1 else 0 end) as NoCompletado, 
        sum(case when status = 'Completado' then 1 else 0 end) as Completado
      from tasks 
      `,
      { type: Sequelize.QueryTypes.SELECT }
    );
    return result;
  }
  async tasksDaysQuantity() {
    const result = await sequelize.query(
      `
      SELECT sum(case when DATEDIFF(DAY, createdAt, GETDATE())  < 365 then 1 else 0 end) as año, 
            sum(case when DATEDIFF(DAY, createdAt, GETDATE()) < 30 then 1 else 0 end) as mes,
            sum(case when DATEDIFF(DAY, createdAt, GETDATE()) < 7 then 1 else 0 end) as semana
      from tasks
      `,
      { type: Sequelize.QueryTypes.SELECT }
    );
    return result;
  }

  async taskPerMachine() {
    const result = await sequelize.query(
      `
        select mac.*, case when machines.taskPerMachine IS NULL then 0
        else machines.taskPerMachine end as taskPerMachine
        from machines mac
        left join 
        (select machine.machineId as machineId, count(machine.machineId) as taskPerMachine from 
        (select case 
        when m.id IS NULL AND m2.id IS NULL then m3.id
        when m.id IS NULL AND m3.id IS NULL then m2.id
        when m2.id IS NULL AND m3.id IS NULL then m.id
        end as machineId
        from tasks t
        /*maquina de pieza*/
        left join pieces p on p.id = t.pieceId
        left join components c on c.id = p.componentId
        left join machines m on m.id = c.machineId
        /*maquina de componente*/
        left join components c2 on c2.id = t.componentId
        left join machines m2 on m2.id = c2.machineId
        /*maquina*/
        left join machines m3 on m3.id = t.machineId) machine
        group by machine.machineId) as machines on mac.id = machines.machineId
    `,
      { type: Sequelize.QueryTypes.SELECT }
    );
    return result;
  }

  async taskPerMonth(year) {
    const result = await sequelize.query(
      `
            SELECT   DateName( month , DateAdd( month , MONTH(createdAt) , 0 ) - 1 ) as "month", COUNT(*) as "tasks"
            FROM      tasks 
            WHERE     YEAR(createdAt) = '${year || new Date().getFullYear()}' 
            GROUP BY  MONTH(createdAt)
        `,
      { type: Sequelize.QueryTypes.SELECT }
    );
    const finalResult = month.map((mon) => {
      let found = false;
      let rowResult;
      for (const row of result) {
        if (row["month"] === mon) {
          found = true;
          rowResult = row;
        }
      }
      if (!found) return { month: mon, tasks: 0 };
      return rowResult;
    });
    return finalResult;
  }

  async faultsByType() {
    const result = await sequelize.query(
      `
            select f.type, count(f.id) as faults from faults f
            group by f.type
        `,
      { type: Sequelize.QueryTypes.SELECT }
    );
    return result;
  }

  async tableAsCsv(table) {
    let tableResult;
    switch (table) {
      case "fault":
        tableResult = await Fault.findAll({
          attributes: {
            exclude: [
              "description_record",
              "consequences_record",
              "relevant_data_record",
            ],
          },
          include: [
            { model: Component, attributes: ["internal_name"] },
            { model: Piece, attributes: ["internal_name"] },
            {
              model: User,
              as: "responsible",
              attributes: ["firstName", "lastName"],
            },
          ],
          raw: true,
        });
        break;
      case "task":
        tableResult = await Task.findAll({
          include: [
            { model: Component, attributes: ["internal_name"] },
            { model: Piece, attributes: ["internal_name"] },
            { model: Machine, attributes: ["internal_name"] },
            {
              model: User,
              as: "responsible",
              attributes: ["firstName", "lastName"],
            },
            {
              model: User,
              as: "requested",
              attributes: ["firstName", "lastName"],
            },
          ],
          raw: true,
        });
        break;
      case "cause":
        tableResult = await Cause.findAll({
          include: [
            {
              model: User,
              as: "requested",
              attributes: ["firstName", "lastName"],
            },
          ],
          raw: true,
        });
        break;
      case "solution":
        tableResult = await Solution.findAll({
          include: [
            { model: Cause, attributes: ["name", "description"] },
            {
              model: User,
              as: "requested",
              attributes: ["firstName", "lastName"],
            },
          ],
          raw: true,
        });
        break;
      case "machine":
        tableResult = await Machine.findAll({
          include: [{ model: User, attributes: ["firstName", "lastName"] }],
          raw: true,
        });
        break;
      case "component":
        tableResult = await Component.findAll({
          include: [
            { model: Machine, attributes: ["internal_name"] },
            { model: User, attributes: ["firstName", "lastName"] },
          ],
          raw: true,
        });
        break;
      case "piece":
        tableResult = await Piece.findAll({
          include: [
            { model: Component, attributes: ["internal_name"] },
            { model: User, attributes: ["firstName", "lastName"] },
          ],
          raw: true,
        });
        break;
    }
    return tableResult;
  }
}
