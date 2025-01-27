import sequelize from "../db/dbconection.js";

const models = sequelize.models;
const Study = models.study;
export default class AreaService {
  // find all studies
  async getAllStudies() {
    return await Study.findAll({
      include: [
        {
          model: models.component,
          include: [
            {
              model: models.machine,
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
                { model: models.machineFile },
              ],
            },
            { model: models.user },
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
            { model: models.componentFile },
          ],
        },
        {
          model: models.piece,
          include: [
            {
              model: models.component,
              include: [
                {
                  model: models.machine,
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
                    { model: models.machineFile },
                  ],
                },
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
                { model: models.componentFile },
              ],
            },
          ],
        },
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
        { model: models.studyFile },
      ],
    });
  }

  // find all studies by component
  async getAllStudysByComponent(componentId) {
    return await Study.findAll({
      where: { componentId: componentId },
      include: [
        {
          model: models.component,
          include: [
            {
              model: models.machine,
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
                { model: models.machineFile },
              ],
            },
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
            { model: models.componentFile },
          ],
        },
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
        { model: models.studyFile },
      ],
    });
  }

  // find all studies by piece
  async getAllStudysByPiece(pieceId) {
    return await Study.findAll({
      where: { pieceId: pieceId },
      include: [
        {
          model: models.piece,
          include: [
            {
              model: models.component,
              include: [
                {
                  model: models.machine,
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
                    { model: models.machineFile },
                  ],
                },
                { model: models.user },
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
                { model: models.componentFile },
              ],
            },
          ],
        },
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
        { model: models.studyFile },
      ],
    });
  }

  // find one study
  async getOneStudy(studyId) {
    return await Study.findOne({
      where: { id: studyId },
      include: [
        {
          model: models.component,
          include: [
            {
              model: models.machine,
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
                { model: models.machineFile },
              ],
            },
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
            { model: models.componentFile },
          ],
        },
        {
          model: models.piece,
          include: [
            {
              model: models.component,
              include: [
                {
                  model: models.machine,
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
                    { model: models.machineFile },
                  ],
                },
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
                { model: models.componentFile },
              ],
            },
          ],
        },
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
        { model: models.studyFile },
      ],
    });
  }

  // create piece
  async createStudy(study) {
    return await Study.create(study);
  }

  // update study
  async updateStudy(studyId, study) {
    return await Study.update(study, { where: { id: studyId } });
  }

  // delete piece by id
  async deleteStudy(studyId) {
    return await Study.update({ isActive: 0 }, { where: { id: studyId } });
  }

  // delete all studies by component
  async deleteAllstudiesByComponent(componentId) {
    return await Study.update(
      { isActive: 0 },
      { where: { componentId: componentId } }
    );
  }

  // delete all studies by piece
  async deleteAllstudiesByPiece(pieceId) {
    return await Study.update({ isActive: 0 }, { where: { pieceId: pieceId } });
  }
}
