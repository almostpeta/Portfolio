import sequelize from "../db/dbconection.js";
import componentService from "./componentController.js";
import { fileToBase64 } from "../utils/utils.js";
import { trackFileChanges } from "./utils.js";

const models = sequelize.models;
const ComponentFile = models.componentFile;
const FieldHistory = models.fieldHistory;
const ComponentService = new componentService();

export default class componentFileService {
  async getAll(component) {
    return await ComponentFile.findAll({
      where: { componentId: component },
    });
  }

  async uploadFile(data) {
    const component = await ComponentService.getOneComponent(data.componentId);
    const componentFile = {
      componentId: component.id,
      file: data.file,
      isActive: 1,
    };
    return await ComponentFile.create(componentFile);
  }

  async uploadMany({ files, componentId }) {
    const fakefiles = files.map((f) => {
      return {
        file: f.path,
        originalName: f.originalname,
        isActive: 1,
        componentId,
      };
    });

    await ComponentFile.bulkCreate(fakefiles);

    const trackedChanges = await trackFileChanges(fakefiles, true, "component");

    if (trackedChanges.length > 0) {
      await FieldHistory.bulkCreate(trackedChanges);
    }

    return "Files added correctly";
  }

  async getFileNamesFromComponent(componentId) {
    return await ComponentFile.findAll({
      where: { componentId },
    });
  }

  async getFileFromComponent(componentId) {
    const files = await componentFile.findAll({
      where: { componentId },
    });
    for (const file of files) {
      file.data = await fileToBase64(file);
    }
    return files;
  }

  async getFileFromId(componentFileId) {
    const [componentFile] = await ComponentFile.findAll({
      where: { id: componentFileId },
      raw: true,
    });
    componentFile.data = await fileToBase64(componentFile);
    return componentFile;
  }

  // delete component file by id
  async deleteComponentFiles(componentFileIds) {
    const files = await ComponentFile.findAll({
      where: {
        id: componentFileIds,
      },
      include: [
        {
          model: models.component,
        },
      ],
    });

    const trackedChanges = await trackFileChanges(files, false, "component");
    if (trackedChanges.length > 0) {
      await FieldHistory.bulkCreate(trackedChanges);
    }

    const fileIds = files.map((f) => f.id);
    return await ComponentFile.update(
      { isActive: 0 },
      {
        where: {
          id: fileIds,
        },
      }
    );
  }

  // delete all componentsFiles by component
  async deleteAllFilesByComponent(componentId) {
    return await ComponentFile.update(
      { isActive: 0 },
      { where: { componentId: componentId } }
    );
  }
}
