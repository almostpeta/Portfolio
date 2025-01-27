import sequelize from "../db/dbconection.js";
import { trackChanges } from "./utils.js";
import Sequelize from "sequelize";

const Op = Sequelize.Op;

const models = sequelize.models;
const Piece = models.piece;
const FieldHistory = models.fieldHistory;

export default class pieceService {
  // find all pieces
  async getAllPieces(startDate, endDate) {
    if (!startDate) {
      startDate = new Date();
      startDate.setFullYear(startDate.getFullYear() - 100);
    }
    if (!endDate) {
      endDate = new Date();
      endDate.setFullYear(endDate.getFullYear() + 100);
    }
    return await Piece.findAll({
      where: { createdAt: { [Op.between]: [startDate, endDate] }, isActive: 1 },
      include: [
        { model: models.component },
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
          ],
        },
        { model: models.pieceFile },
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
        { model: models.task },
      ],
      orderBy: ["componentId", "internal_name"],
    });
  }

  // find all pieces by component
  async getAllPiecesByComponent(componentId) {
    return await Piece.findAll({
      where: { componentId: componentId, isActive: 1 },
      include: [
        { model: models.component },
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
          ],
        },
        { model: models.pieceFile },
        {
          model: models.fieldHistory,
          include: [{ model: models.user }],
        },
        { model: models.task },
      ],
    });
  }

  // find one piece by id
  async getOnePiece(pieceId) {
    return await Piece.findOne({
      where: { id: pieceId, isActive: 1 },
      include: [
        { model: models.component },
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
          ],
        },
        { model: models.pieceFile },
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
        { model: models.task },
      ],
    });
  }

  // find one piece by internal name
  async getOnePieceByName(pieceName) {
    return await Piece.findOne({
      where: { internal_name: pieceName, isActive: 1 },
      include: [
        { model: models.component },
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
          ],
        },
        { model: models.pieceFile },
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
        { model: models.task },
      ],
    });
  }

  // create piece
  async createPiece(piece) {
    return await Piece.create(piece);
  }

  // update piece
  async updatePiece(pieceId, piece) {
    const oldPiece = await Piece.findOne({
      where: { id: pieceId },
    });

    const changes = trackChanges(piece, oldPiece, pieceId, "piece");

    if (changes.length > 0) {
      await FieldHistory.bulkCreate(changes);
    }

    return await Piece.update(piece, {
      where: { id: pieceId },
    });
  }

  // delete piece by id
  async deletePiece(pieceId) {
    return await Piece.update({ isActive: 0 }, { where: { id: pieceId } });
  }

  // delete all pieces by component
  async deleteAllPieceByComponent(componentId) {
    return await Piece.update(
      { isActive: 0 },
      { where: { componentId: componentId } }
    );
  }

  async addOrUpdateMany(pieces) {
    try {
      for (const piece of pieces) {
        const pieceId = piece.id;
        if (pieceId) {
          Piece.update(piece, {
            where: { id: pieceId },
          });
        } else {
          await Piece.create(piece);
        }
      }
      return "Elements inserted correctly";
    } catch (e) {
      return e;
    }
  }
}
