export const isDate = (value) => {
  try {
    let parsed = null;
    if (typeof value === "number") {
      parsed = new Date(value);
    } else if (typeof value === "string") {
      parsed = Date.parse(value);
    } else {
      return false;
    }
    return !isNaN(parsed.getMonth());
  } catch (error) {
    return false;
  }
};

export const trackChanges = (newObject, oldObject, id, variant) => {
  const trackedChanges = [];

  for (const [key, value] of Object.entries(newObject)) {
    if (key === "isActive") continue;

    if (oldObject.dataValues.hasOwnProperty(`${key}`)) {
      let old_value = oldObject[`${key}`];
      let new_value = value;
      if (isDate(value)) {
        old_value = new Date(`${oldObject[`${key}`]}`).getTime();
        new_value = new Date(value).getTime();
      }

      if (old_value != new_value) {
        const obj = {
          new_value: String(new_value),
          old_value: String(old_value),
          field: key,
          userId: 1, //must change by current user
        };
        variant === "piece" ? (obj.pieceId = id) : (obj.componentId = id);
        trackedChanges.push(obj);
      }
    } else {
      // a new value that didn't exist
      trackedChanges.push({
        new_value: String(value),
        old_value: "undefined",
        componentId: +componentId,
        field: key,
        userId: 1, //must change by current user
      });
    }
  }

  return trackedChanges;
};

export const trackFileChanges = async (files, isNew, variant) => {
  return files.map((file) => {
    const obj = {
      field: "files",
      old_value: isNew ? "N/A" : file.originalName,
      new_value: isNew ? file.originalName : "N/A",
      userId: 1,
    };
    variant === "piece"
      ? (obj.pieceId = +file.pieceId)
      : (obj.componentId = +file.componentId);

    return obj;
  });
};
