import sequelize from "../db/dbconection.js";
import pieceService from "./pieceController.js";
import { fileToBase64 } from "../utils/utils.js";
import { trackFileChanges } from "./utils.js";

const models = sequelize.models;
const PieceFile = models.pieceFile;
const FieldHistory = models.fieldHistory;
const PieceService = new pieceService();

export default class pieceFileService {
  async getAll(piece) {
    return await PieceFile.findAll({ where: { pieceId: piece }, raw: true });
  }

  async uploadFile(data) {
    const piece = await PieceService.getOnePiece(data.pieceId);
    const pieceFile = {
      pieceId: piece.id,
      file: data.file,
      isActive: 1,
    };
    return await PieceFile.create(pieceFile);
  }

  async uploadMany({ files, pieceId }) {
    const fakefiles = files.map((f) => {
      return {
        file: f.path,
        originalName: f.originalname,
        isActive: 1,
        pieceId,
      };
    });

    await PieceFile.bulkCreate(fakefiles);

    const trackedChanges = await trackFileChanges(fakefiles, true, "piece");

    if (trackedChanges.length > 0) {
      await FieldHistory.bulkCreate(trackedChanges);
    }

    return "Files added correctly";
  }

  async getFileNamesFromPiece(pieceId) {
    return await PieceFile.findAll({
      where: { pieceId },
      raw: true,
    });
  }

  async getFileFromId(pieceFileId) {
    const [pieceFile] = await PieceFile.findAll({
      where: { id: pieceFileId },
      raw: true,
    });
    pieceFile.data = await fileToBase64(pieceFile);
    return pieceFile;
  }

  async getFileFromPiece(pieceId) {
    const files = await PieceFile.findAll({
      where: { pieceId },
      raw: true,
    });
    for (const file of files) {
      file.data = await fileToBase64(file);
    }
    return files;
  }

  // delete piece file by id
  async deletePieceFiles(pieceFileIds) {
    const files = await PieceFile.findAll({
      where: {
        id: pieceFileIds,
      },
      include: [
        {
          model: models.piece,
        },
      ],
      raw: true,
    });

    const trackedChanges = await trackFileChanges(files, false, "piece");
    if (trackedChanges.length > 0) {
      await FieldHistory.bulkCreate(trackedChanges);
    }

    const fileIds = files.map((f) => f.id);
    return await PieceFile.update(
      { isActive: 0 },
      {
        where: {
          id: fileIds,
        },
        raw: true,
      }
    );
  }

  // delete all files by piece
  async deleteAllFilesByPiece(pieceId) {
    return await PieceFile.update(
      { isActive: 0 },
      { where: { pieceId: pieceId } }
    );
  }
}
