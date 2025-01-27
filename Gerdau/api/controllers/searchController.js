import Sequelize from "sequelize";
import sequelize from "../db/dbconection.js";
const Op = Sequelize.Op;

const models = sequelize.models;
const Machine = models.machine;
const Component = models.component;
const Piece = models.piece;
const Plant = models.plant;
const Area = models.area;
const Sublevel = models.sublevel;
const User = models.user;
const Cause = models.cause;
const Fault = models.fault;
const Solution = models.solution;
const Task = models.task;
const Method = models.method;

export default class SearchService {
  // find all sublevels
  async getAllSearch(filterBy, value) {
    switch (filterBy) {
      case "machines":
        return await Machine.findAll({
          where: {
            [Op.or]: [
              { internal_name: { [Op.like]: "%" + value + "%" } },
              { serie_number: { [Op.like]: "%" + value + "%" } },
              { type: { [Op.like]: "%" + value + "%" } },
              { manufacturer: { [Op.like]: "%" + value + "%" } },
              { make: { [Op.like]: "%" + value + "%" } },
              { model: { [Op.like]: "%" + value + "%" } },
              { model: { [Op.like]: "%" + value + "%" } },
              { manufacturer_type: { [Op.like]: "%" + value + "%" } },
              { flat_number: { [Op.like]: "%" + value + "%" } },
              { state: { [Op.like]: "%" + value + "%" } },
              {
                responsibleId: [
                  await User.findOne({
                    attributes: ["id"],
                    where: {
                      [Op.or]: [
                        { email: { [Op.like]: "%" + value + "%" } },
                        { firstName: { [Op.like]: "%" + value + "%" } },
                        { lastName: { [Op.like]: "%" + value + "%" } },
                      ],
                    },
                  }).then(function (result) {
                    if (result) {
                      var responsibleId = result.id;
                      return responsibleId; // This is what I need to do
                    }
                  }),
                ],
              },
              {
                plantId: [
                  await Plant.findOne({
                    attributes: ["id"],
                    where: {
                      [Op.or]: [
                        { name: { [Op.like]: "%" + value + "%" } },
                        { location: { [Op.like]: "%" + value + "%" } },
                        { country: { [Op.like]: "%" + value + "%" } },
                      ],
                    },
                  }).then(function (result) {
                    if (result) {
                      var plantId = result.id;
                      return plantId; // This is what I need to do
                    }
                  }),
                ],
              },
              {
                areaId: [
                  await Area.findOne({
                    attributes: ["id"],
                    where: { name: { [Op.like]: "%" + value + "%" } },
                  }).then(function (result) {
                    if (result) {
                      var nameId = result.id;
                      return nameId; // This is what I need to do
                    }
                  }),
                ],
              },
              {
                sublevelId: [
                  await Sublevel.findOne({
                    attributes: ["id"],
                    where: { name: { [Op.like]: "%" + value + "%" } },
                  }).then(function (result) {
                    if (result) {
                      var sublevelId = result.id;
                      return sublevelId; // This is what I need to do
                    }
                  }),
                ],
              },
            ],
          },
        });
      case "components":
        return await Component.findAll({
          where: {
            [Op.or]: [
              { internal_name: { [Op.like]: "%" + value + "%" } },
              { serie_number: { [Op.like]: "%" + value + "%" } },
              { type: { [Op.like]: "%" + value + "%" } },
              { manufacturer: { [Op.like]: "%" + value + "%" } },
              { make: { [Op.like]: "%" + value + "%" } },
              { model: { [Op.like]: "%" + value + "%" } },
              { model: { [Op.like]: "%" + value + "%" } },
              { provider: { [Op.like]: "%" + value + "%" } },
              { manufacturer_type: { [Op.like]: "%" + value + "%" } },
              { state: { [Op.like]: "%" + value + "%" } },
              {
                responsibleId: [
                  await User.findOne({
                    attributes: ["id"],
                    where: {
                      [Op.or]: [
                        { email: { [Op.like]: "%" + value + "%" } },
                        { firstName: { [Op.like]: "%" + value + "%" } },
                        { lastName: { [Op.like]: "%" + value + "%" } },
                      ],
                    },
                  }).then(function (result) {
                    if (result) {
                      var responsibleId = result.id;
                      return responsibleId; // This is what I need to do
                    }
                  }),
                ],
              },
            ],
          },
        });
      case "pieces":
        return await Piece.findAll({
          where: {
            [Op.or]: [
              { internal_name: { [Op.like]: "%" + value + "%" } },
              { identifier: { [Op.like]: "%" + value + "%" } },
              { type: { [Op.like]: "%" + value + "%" } },
              { manufacturer: { [Op.like]: "%" + value + "%" } },
              { make: { [Op.like]: "%" + value + "%" } },
              { model: { [Op.like]: "%" + value + "%" } },
              { model: { [Op.like]: "%" + value + "%" } },
              { provider: { [Op.like]: "%" + value + "%" } },
              { manufacturer_type: { [Op.like]: "%" + value + "%" } },
              {
                responsibleId: [
                  await User.findOne({
                    attributes: ["id"],
                    where: {
                      [Op.or]: [
                        { email: { [Op.like]: "%" + value + "%" } },
                        { firstName: { [Op.like]: "%" + value + "%" } },
                        { lastName: { [Op.like]: "%" + value + "%" } },
                      ],
                    },
                  }).then(function (result) {
                    if (result) {
                      var responsibleId = result.id;
                      return responsibleId; // This is what I need to do
                    }
                  }),
                ],
              },
            ],
          },
        });
      case "faults":
        return await Fault.findAll({
          where: {
            [Op.or]: [
              { name: { [Op.like]: "%" + value + "%" } },
              { type: { [Op.like]: "%" + value + "%" } },
              { state: { [Op.like]: "%" + value + "%" } },
              { clasification: { [Op.like]: "%" + value + "%" } },
              { stage: { [Op.like]: "%" + value + "%" } },
              { priority: { [Op.like]: "%" + value + "%" } },
              { fault_number: { [Op.like]: "%" + value + "%" } },
              {
                responsibleId: [
                  await User.findOne({
                    attributes: ["id"],
                    where: {
                      [Op.or]: [
                        { email: { [Op.like]: "%" + value + "%" } },
                        { firstName: { [Op.like]: "%" + value + "%" } },
                        { lastName: { [Op.like]: "%" + value + "%" } },
                      ],
                    },
                  }).then(function (result) {
                    if (result) {
                      var responsibleId = result.id;
                      return responsibleId; // This is what I need to do
                    }
                  }),
                ],
              },
              {
                pieceId: [
                  await Piece.findOne({
                    attributes: ["id"],
                    where: {
                      [Op.or]: [
                        { internal_name: { [Op.like]: "%" + value + "%" } },
                        { identifier: { [Op.like]: "%" + value + "%" } },
                        { manufacturer: { [Op.like]: "%" + value + "%" } },
                        { type: { [Op.like]: "%" + value + "%" } },
                        { provider: { [Op.like]: "%" + value + "%" } },
                        { make: { [Op.like]: "%" + value + "%" } },
                        { model: { [Op.like]: "%" + value + "%" } },
                      ],
                    },
                  }).then(function (result) {
                    if (result) {
                      var pieceId = result.id;
                      return pieceId; // This is what I need to do
                    }
                  }),
                ],
              },
              {
                componentId: [
                  await Component.findOne({
                    attributes: ["id"],
                    where: {
                      [Op.or]: [
                        { internal_name: { [Op.like]: "%" + value + "%" } },
                        { serie_number: { [Op.like]: "%" + value + "%" } },
                        { manufacturer: { [Op.like]: "%" + value + "%" } },
                        { type: { [Op.like]: "%" + value + "%" } },
                        { provider: { [Op.like]: "%" + value + "%" } },
                        { make: { [Op.like]: "%" + value + "%" } },
                        { model: { [Op.like]: "%" + value + "%" } },
                      ],
                    },
                  }).then(function (result) {
                    if (result) {
                      var componentId = result.id;
                      return componentId; // This is what I need to do
                    }
                  }),
                ],
              },
            ],
          },
        });
      case "causes":
        return await Cause.findAll({
          where: {
            [Op.or]: [
              { name: { [Op.like]: "%" + value + "%" } },
              { status: { [Op.like]: "%" + value + "%" } },
              { reason: { [Op.like]: "%" + value + "%" } },
            ],
          },
        });
      case "solution":
        return await Solution.findAll({
          where: {
            [Op.or]: [
              { name: { [Op.like]: "%" + value + "%" } },
              { status: { [Op.like]: "%" + value + "%" } },
              { description: { [Op.like]: "%" + value + "%" } },
            ],
          },
        });
      case "method":
        return await Method.findAll({
          where: {
            [Op.or]: [
              { name: { [Op.like]: "%" + value + "%" } },
              { description: { [Op.like]: "%" + value + "%" } },
              {
                solutionId: [
                  await Solution.findOne({
                    attributes: ["id"],
                    where: {
                      name: { [Op.like]: "%" + value + "%" },
                      status: { [Op.like]: "%" + value + "%" },
                      description: { [Op.like]: "%" + value + "%" },
                    },
                  }).then(function (result) {
                    if (result) {
                      var responsibleId = result.id;
                      return responsibleId; // This is what I need to do
                    }
                  }),
                ],
              },
            ],
          },
        });
      case "task":
        return await Task.findAll({
          where: {
            [Op.or]: [
              { name: { [Op.like]: "%" + value + "%" } },
              { status: { [Op.like]: "%" + value + "%" } },
              { description: { [Op.like]: "%" + value + "%" } },
              { reason: { [Op.like]: "%" + value + "%" } },
              {
                responsibleId: [
                  await User.findOne({
                    attributes: ["id"],
                    where: {
                      [Op.or]: [
                        { email: { [Op.like]: "%" + value + "%" } },
                        { firstName: { [Op.like]: "%" + value + "%" } },
                        { lastName: { [Op.like]: "%" + value + "%" } },
                      ],
                    },
                  }).then(function (result) {
                    if (result) {
                      var responsibleId = result.id;
                      return responsibleId; // This is what I need to do
                    }
                  }),
                ],
              },
              {
                pieceId: [
                  await Piece.findOne({
                    attributes: ["id"],
                    where: {
                      [Op.or]: [
                        { internal_name: { [Op.like]: "%" + value + "%" } },
                        { identifier: { [Op.like]: "%" + value + "%" } },
                        { manufacturer: { [Op.like]: "%" + value + "%" } },
                        { type: { [Op.like]: "%" + value + "%" } },
                        { provider: { [Op.like]: "%" + value + "%" } },
                        { make: { [Op.like]: "%" + value + "%" } },
                        { model: { [Op.like]: "%" + value + "%" } },
                      ],
                    },
                  }).then(function (result) {
                    if (result) {
                      var pieceId = result.id;
                      return pieceId; // This is what I need to do
                    }
                  }),
                ],
              },
              {
                componentId: [
                  await Component.findOne({
                    attributes: ["id"],
                    where: {
                      [Op.or]: [
                        { internal_name: { [Op.like]: "%" + value + "%" } },
                        { serie_number: { [Op.like]: "%" + value + "%" } },
                        { manufacturer: { [Op.like]: "%" + value + "%" } },
                        { type: { [Op.like]: "%" + value + "%" } },
                        { provider: { [Op.like]: "%" + value + "%" } },
                        { make: { [Op.like]: "%" + value + "%" } },
                        { model: { [Op.like]: "%" + value + "%" } },
                      ],
                    },
                  }).then(function (result) {
                    if (result) {
                      var componentId = result.id;
                      return componentId; // This is what I need to do
                    }
                  }),
                ],
              },
            ],
          },
        });
      case "all":
        let objectList = [];
        const machines = await Machine.findAll({
          where: {
            [Op.or]: [
              { internal_name: { [Op.like]: "%" + value + "%" } },
              { serie_number: { [Op.like]: "%" + value + "%" } },
              { type: { [Op.like]: "%" + value + "%" } },
              { manufacturer: { [Op.like]: "%" + value + "%" } },
              { make: { [Op.like]: "%" + value + "%" } },
              { model: { [Op.like]: "%" + value + "%" } },
              { model: { [Op.like]: "%" + value + "%" } },
              { manufacturer_type: { [Op.like]: "%" + value + "%" } },
              { flat_number: { [Op.like]: "%" + value + "%" } },
              { state: { [Op.like]: "%" + value + "%" } },
              {
                responsibleId: [
                  await User.findOne({
                    attributes: ["id"],
                    where: {
                      [Op.or]: [
                        { email: { [Op.like]: "%" + value + "%" } },
                        { firstName: { [Op.like]: "%" + value + "%" } },
                        { lastName: { [Op.like]: "%" + value + "%" } },
                      ],
                    },
                  }).then(function (result) {
                    if (result) {
                      var responsibleId = result.id;
                      return responsibleId; // This is what I need to do
                    }
                  }),
                ],
              },
              {
                plantId: [
                  await Plant.findOne({
                    attributes: ["id"],
                    where: {
                      [Op.or]: [
                        { name: { [Op.like]: "%" + value + "%" } },
                        { location: { [Op.like]: "%" + value + "%" } },
                        { country: { [Op.like]: "%" + value + "%" } },
                      ],
                    },
                  }).then(function (result) {
                    if (result) {
                      var plantId = result.id;
                      return plantId; // This is what I need to do
                    }
                  }),
                ],
              },
              {
                areaId: [
                  await Area.findOne({
                    attributes: ["id"],
                    where: { name: { [Op.like]: "%" + value + "%" } },
                  }).then(function (result) {
                    if (result) {
                      var nameId = result.id;
                      return nameId; // This is what I need to do
                    }
                  }),
                ],
              },
              {
                sublevelId: [
                  await Sublevel.findOne({
                    attributes: ["id"],
                    where: { name: { [Op.like]: "%" + value + "%" } },
                  }).then(function (result) {
                    if (result) {
                      var sublevelId = result.id;
                      return sublevelId; // This is what I need to do
                    }
                  }),
                ],
              },
            ],
          },
        });
        objectList.push({ machines: machines });
        const components = await Component.findAll({
          where: {
            [Op.or]: [
              { internal_name: { [Op.like]: "%" + value + "%" } },
              { serie_number: { [Op.like]: "%" + value + "%" } },
              { type: { [Op.like]: "%" + value + "%" } },
              { manufacturer: { [Op.like]: "%" + value + "%" } },
              { make: { [Op.like]: "%" + value + "%" } },
              { model: { [Op.like]: "%" + value + "%" } },
              { model: { [Op.like]: "%" + value + "%" } },
              { provider: { [Op.like]: "%" + value + "%" } },
              { manufacturer_type: { [Op.like]: "%" + value + "%" } },
              { state: { [Op.like]: "%" + value + "%" } },
              {
                responsibleId: [
                  await User.findOne({
                    attributes: ["id"],
                    where: {
                      [Op.or]: [
                        { email: { [Op.like]: "%" + value + "%" } },
                        { firstName: { [Op.like]: "%" + value + "%" } },
                        { lastName: { [Op.like]: "%" + value + "%" } },
                      ],
                    },
                  }).then(function (result) {
                    if (result) {
                      var responsibleId = result.id;
                      return responsibleId; // This is what I need to do
                    }
                  }),
                ],
              },
            ],
          },
        });
        objectList.push({ components: components });
        const pieces = await Piece.findAll({
          where: {
            [Op.or]: [
              { internal_name: { [Op.like]: "%" + value + "%" } },
              { identifier: { [Op.like]: "%" + value + "%" } },
              { type: { [Op.like]: "%" + value + "%" } },
              { manufacturer: { [Op.like]: "%" + value + "%" } },
              { make: { [Op.like]: "%" + value + "%" } },
              { model: { [Op.like]: "%" + value + "%" } },
              { model: { [Op.like]: "%" + value + "%" } },
              { provider: { [Op.like]: "%" + value + "%" } },
              { manufacturer_type: { [Op.like]: "%" + value + "%" } },
              {
                responsibleId: [
                  await User.findOne({
                    attributes: ["id"],
                    where: {
                      [Op.or]: [
                        { email: { [Op.like]: "%" + value + "%" } },
                        { firstName: { [Op.like]: "%" + value + "%" } },
                        { lastName: { [Op.like]: "%" + value + "%" } },
                      ],
                    },
                  }).then(function (result) {
                    if (result) {
                      var responsibleId = result.id;
                      return responsibleId; // This is what I need to do
                    }
                  }),
                ],
              },
            ],
          },
        });
        objectList.push({ pieces: pieces });
        const faults = await Fault.findAll({
          where: {
            [Op.or]: [
              { name: { [Op.like]: "%" + value + "%" } },
              { type: { [Op.like]: "%" + value + "%" } },
              { state: { [Op.like]: "%" + value + "%" } },
              { clasification: { [Op.like]: "%" + value + "%" } },
              { stage: { [Op.like]: "%" + value + "%" } },
              { priority: { [Op.like]: "%" + value + "%" } },
              { fault_number: { [Op.like]: "%" + value + "%" } },
              {
                responsibleId: [
                  await User.findOne({
                    attributes: ["id"],
                    where: {
                      [Op.or]: [
                        { email: { [Op.like]: "%" + value + "%" } },
                        { firstName: { [Op.like]: "%" + value + "%" } },
                        { lastName: { [Op.like]: "%" + value + "%" } },
                      ],
                    },
                  }).then(function (result) {
                    if (result) {
                      var responsibleId = result.id;
                      return responsibleId; // This is what I need to do
                    }
                  }),
                ],
              },
              {
                pieceId: [
                  await Piece.findOne({
                    attributes: ["id"],
                    where: {
                      [Op.or]: [
                        { internal_name: { [Op.like]: "%" + value + "%" } },
                        { identifier: { [Op.like]: "%" + value + "%" } },
                        { manufacturer: { [Op.like]: "%" + value + "%" } },
                        { type: { [Op.like]: "%" + value + "%" } },
                        { provider: { [Op.like]: "%" + value + "%" } },
                        { make: { [Op.like]: "%" + value + "%" } },
                        { model: { [Op.like]: "%" + value + "%" } },
                      ],
                    },
                  }).then(function (result) {
                    if (result) {
                      var pieceId = result.id;
                      return pieceId; // This is what I need to do
                    }
                  }),
                ],
              },
              {
                componentId: [
                  await Component.findOne({
                    attributes: ["id"],
                    where: {
                      [Op.or]: [
                        { internal_name: { [Op.like]: "%" + value + "%" } },
                        { serie_number: { [Op.like]: "%" + value + "%" } },
                        { manufacturer: { [Op.like]: "%" + value + "%" } },
                        { type: { [Op.like]: "%" + value + "%" } },
                        { provider: { [Op.like]: "%" + value + "%" } },
                        { make: { [Op.like]: "%" + value + "%" } },
                        { model: { [Op.like]: "%" + value + "%" } },
                      ],
                    },
                  }).then(function (result) {
                    if (result) {
                      var componentId = result.id;
                      return componentId; // This is what I need to do
                    }
                  }),
                ],
              },
            ],
          },
        });
        objectList.push({ faults: faults });
        const causes = await Cause.findAll({
          where: {
            [Op.or]: [
              { name: { [Op.like]: "%" + value + "%" } },
              { status: { [Op.like]: "%" + value + "%" } },
              { reason: { [Op.like]: "%" + value + "%" } },
            ],
          },
        });
        objectList.push({ causes: causes });
        const solutions = await Solution.findAll({
          where: {
            [Op.or]: [
              { name: { [Op.like]: "%" + value + "%" } },
              { status: { [Op.like]: "%" + value + "%" } },
              { description: { [Op.like]: "%" + value + "%" } },
            ],
          },
        });
        objectList.push({ solutions: solutions });
        const methods = await Method.findAll({
          where: {
            [Op.or]: [
              { name: { [Op.like]: "%" + value + "%" } },
              { description: { [Op.like]: "%" + value + "%" } },
              {
                solutionId: [
                  await Solution.findOne({
                    attributes: ["id"],
                    where: {
                      name: { [Op.like]: "%" + value + "%" },
                      status: { [Op.like]: "%" + value + "%" },
                      description: { [Op.like]: "%" + value + "%" },
                    },
                  }).then(function (result) {
                    if (result) {
                      var responsibleId = result.id;
                      return responsibleId; // This is what I need to do
                    }
                  }),
                ],
              },
            ],
          },
        });
        objectList.push({ methods: methods });
        const tasks = await Task.findAll({
          where: {
            [Op.or]: [
              { name: { [Op.like]: "%" + value + "%" } },
              { status: { [Op.like]: "%" + value + "%" } },
              { description: { [Op.like]: "%" + value + "%" } },
              { reason: { [Op.like]: "%" + value + "%" } },
              {
                responsibleId: [
                  await User.findOne({
                    attributes: ["id"],
                    where: {
                      [Op.or]: [
                        { email: { [Op.like]: "%" + value + "%" } },
                        { firstName: { [Op.like]: "%" + value + "%" } },
                        { lastName: { [Op.like]: "%" + value + "%" } },
                      ],
                    },
                  }).then(function (result) {
                    if (result) {
                      var responsibleId = result.id;
                      return responsibleId; // This is what I need to do
                    }
                  }),
                ],
              },
              {
                pieceId: [
                  await Piece.findOne({
                    attributes: ["id"],
                    where: {
                      [Op.or]: [
                        { internal_name: { [Op.like]: "%" + value + "%" } },
                        { identifier: { [Op.like]: "%" + value + "%" } },
                        { manufacturer: { [Op.like]: "%" + value + "%" } },
                        { type: { [Op.like]: "%" + value + "%" } },
                        { provider: { [Op.like]: "%" + value + "%" } },
                        { make: { [Op.like]: "%" + value + "%" } },
                        { model: { [Op.like]: "%" + value + "%" } },
                      ],
                    },
                  }).then(function (result) {
                    if (result) {
                      var pieceId = result.id;
                      return pieceId; // This is what I need to do
                    }
                  }),
                ],
              },
              {
                componentId: [
                  await Component.findOne({
                    attributes: ["id"],
                    where: {
                      [Op.or]: [
                        { internal_name: { [Op.like]: "%" + value + "%" } },
                        { serie_number: { [Op.like]: "%" + value + "%" } },
                        { manufacturer: { [Op.like]: "%" + value + "%" } },
                        { type: { [Op.like]: "%" + value + "%" } },
                        { provider: { [Op.like]: "%" + value + "%" } },
                        { make: { [Op.like]: "%" + value + "%" } },
                        { model: { [Op.like]: "%" + value + "%" } },
                      ],
                    },
                  }).then(function (result) {
                    if (result) {
                      var componentId = result.id;
                      return componentId; // This is what I need to do
                    }
                  }),
                ],
              },
            ],
          },
        });
        objectList.push({ tasks: tasks });
        return objectList;
    }
  }
}
