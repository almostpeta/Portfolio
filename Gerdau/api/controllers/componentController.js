import MachineService from "./machineController.js";
import sequelize from "../db/dbconection.js";
import { trackChanges } from "./utils.js";
import Sequelize from "sequelize";

const Op = Sequelize.Op;

const models = sequelize.models;
const Component = models.component;
const FieldHistory = models.fieldHistory;
const machineService = new MachineService();

export default class componentService {
  // find all components
  async getAllComponents(startDate, endDate) {
    if (!startDate) {
      startDate = new Date();
      startDate.setFullYear(startDate.getFullYear() - 100);
    }
    if (!endDate) {
      endDate = new Date();
      endDate.setFullYear(endDate.getFullYear() + 100);
    }
    return await Component.findAll({
      where: { createdAt: { [Op.between]: [startDate, endDate] }, isActive: 1 },
      include: [
        {
          model: models.piece,
          include: [
            {
              model: models.user,
              attributes: [
                "id",
                "name",
                "firstName",
                "lastName",
                "email",
                "role",
                "isActive",
              ],
            },
            { model: models.pieceFile },
          ],
        },
        { model: models.machine },
        {
          model: models.user,
          attributes: [
            "id",
            "name",
            "firstName",
            "lastName",
            "email",
            "role",
            "isActive",
          ],
        },
        {
          model: models.fault,
          include: [
            { model: models.faultFile },
            {
              model: models.user,
              as: "responsible",
              attributes: [
                "id",
                "name",
                "firstName",
                "lastName",
                "email",
                "role",
                "isActive",
              ],
            },
            {
              model: models.user,
              as: "reporters",
              attributes: [
                "id",
                "name",
                "firstName",
                "lastName",
                "email",
                "role",
                "isActive",
              ],
            },
            {
              model: models.cause,
              as: "causes",
              include: [
                {
                  model: models.user,
                  as: "requested",
                  attributes: [
                    "id",
                    "name",
                    "firstName",
                    "lastName",
                    "email",
                    "role",
                    "isActive",
                  ],
                },
                { model: models.causeFile },
              ],
            },
            { model: models.piece },
          ],
        },
        { model: models.componentFile },
        {
          model: models.fieldHistory,
          include: [
            {
              model: models.user,
              attributes: [
                "id",
                "name",
                "firstName",
                "lastName",
                "email",
                "role",
                "isActive",
              ],
            },
          ],
        },
        {
          model: models.study,
        },
        { model: models.task },
      ],
      orderBy: ["machineId", "internal_name"],
    });
  }

  // find all components by machine id
  async getAllComponentsByMachine(machineId) {
    return await Component.findAll({
      where: { machineId: machineId, isActive: 1 },
      include: [
        {
          model: models.piece,
          include: [
            {
              model: models.user,
              attributes: [
                "id",
                "name",
                "firstName",
                "lastName",
                "email",
                "role",
                "isActive",
              ],
            },
            { model: models.pieceFile },
          ],
        },
        { model: models.machine },
        {
          model: models.user,
          attributes: [
            "id",
            "name",
            "firstName",
            "lastName",
            "email",
            "role",
            "isActive",
          ],
        },
        {
          model: models.fault,
          include: [
            { model: models.faultFile },
            {
              model: models.user,
              as: "responsible",
              attributes: [
                "id",
                "name",
                "firstName",
                "lastName",
                "email",
                "role",
                "isActive",
              ],
            },
            {
              model: models.user,
              as: "reporters",
              attributes: [
                "id",
                "name",
                "firstName",
                "lastName",
                "email",
                "role",
                "isActive",
              ],
            },
            {
              model: models.cause,
              as: "causes",
              include: [
                {
                  model: models.user,
                  as: "requested",
                  attributes: [
                    "id",
                    "name",
                    "firstName",
                    "lastName",
                    "email",
                    "role",
                    "isActive",
                  ],
                },
                { model: models.causeFile },
              ],
            },
            { model: models.piece },
          ],
        },
        { model: models.componentFile },
        {
          model: models.fieldHistory,
          include: [
            {
              model: models.user,
              attributes: [
                "id",
                "name",
                "firstName",
                "lastName",
                "email",
                "role",
                "isActive",
              ],
            },
          ],
        },
        {
          model: models.study,
        },
        { model: models.task },
      ],
    });
  }

  // find one component by id
  async getOneComponent(componentId) {
    return await Component.findOne({
      where: { id: componentId, isActive: 1 },
      include: [
        {
          model: models.piece,
          include: [
            {
              model: models.user,
              attributes: [
                "id",
                "name",
                "firstName",
                "lastName",
                "email",
                "role",
                "isActive",
              ],
            },
            { model: models.pieceFile },
          ],
        },
        { model: models.machine },
        {
          model: models.user,
          attributes: [
            "id",
            "name",
            "firstName",
            "lastName",
            "email",
            "role",
            "isActive",
          ],
        },
        {
          model: models.fault,
          include: [
            { model: models.faultFile },
            {
              model: models.user,
              as: "responsible",
              attributes: [
                "id",
                "name",
                "firstName",
                "lastName",
                "email",
                "role",
                "isActive",
              ],
            },
            {
              model: models.user,
              as: "reporters",
              attributes: [
                "id",
                "name",
                "firstName",
                "lastName",
                "email",
                "role",
                "isActive",
              ],
            },
            {
              model: models.cause,
              as: "causes",
              include: [
                {
                  model: models.user,
                  as: "requested",
                  attributes: [
                    "id",
                    "name",
                    "firstName",
                    "lastName",
                    "email",
                    "role",
                    "isActive",
                  ],
                },
                { model: models.causeFile },
              ],
            },
            { model: models.piece },
          ],
        },
        { model: models.componentFile },
        {
          model: models.fieldHistory,
          include: [
            {
              model: models.user,
              attributes: [
                "id",
                "name",
                "firstName",
                "lastName",
                "email",
                "role",
                "isActive",
              ],
            },
          ],
        },
        {
          model: models.study,
        },
        { model: models.task },
      ],
    });
  }

  // find one component by internal name
  async getOneComponentByName(componentName) {
    return await Component.findOne({
      where: { internal_name: componentName, isActive: 1 },
      include: [
        {
          model: models.piece,
          include: [
            {
              model: models.user,
              attributes: [
                "id",
                "name",
                "firstName",
                "lastName",
                "email",
                "role",
                "isActive",
              ],
            },
            { model: models.pieceFile },
          ],
        },
        { model: models.machine },
        {
          model: models.user,
          attributes: [
            "id",
            "name",
            "firstName",
            "lastName",
            "email",
            "role",
            "isActive",
          ],
        },
        {
          model: models.fault,
          include: [
            { model: models.faultFile },
            {
              model: models.user,
              as: "responsible",
              attributes: [
                "id",
                "name",
                "firstName",
                "lastName",
                "email",
                "role",
                "isActive",
              ],
            },
            {
              model: models.user,
              as: "reporters",
              attributes: [
                "id",
                "name",
                "firstName",
                "lastName",
                "email",
                "role",
                "isActive",
              ],
            },
            {
              model: models.cause,
              as: "causes",
              include: [
                {
                  model: models.user,
                  as: "requested",
                  attributes: [
                    "id",
                    "name",
                    "firstName",
                    "lastName",
                    "email",
                    "role",
                    "isActive",
                  ],
                },
                { model: models.causeFile },
              ],
            },
            { model: models.piece },
          ],
        },
        { model: models.componentFile },
        {
          model: models.fieldHistory,
          include: [
            {
              model: models.user,
              attributes: [
                "id",
                "name",
                "firstName",
                "lastName",
                "email",
                "role",
                "isActive",
              ],
            },
          ],
        },
        {
          model: models.study,
        },
        { model: models.task },
      ],
    });
  }

  // create component
  async createComponent(component) {
    return await Component.create(component);
  }

  // update component
  async updateComponent(componentId, component) {
    const oldComponent = await Component.findOne({
      where: { id: componentId },
    });

    const changes = trackChanges(
      component,
      oldComponent,
      componentId,
      "component"
    );

    if (changes.length > 0) {
      await FieldHistory.bulkCreate(changes);
    }

    return await Component.update(component, {
      where: { id: componentId },
    });
  }

  // delete component by id
  async deleteComponent(componentId) {
    return await Component.update(
      { isActive: 0 },
      {
        where: { id: componentId },
      }
    );
  }

  // delete all components by machine
  async deleteAllComponentsByMachine(machineId) {
    return await Component.update(
      { isActive: 0 },
      {
        where: { machineId: machineId },
      }
    );
  }
}
