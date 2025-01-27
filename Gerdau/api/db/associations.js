export default (sequelize) => {
  const {
    area,
    cause,
    causeFile,
    component,
    componentFile,
    fault,
    faultFile,
    machine,
    machineFile,
    piece,
    pieceFile,
    plant,
    solution,
    solutionFile,
    study,
    studyFile,
    sublevel,
    user,
    task,
    fieldHistory,
    method,
    methodFile,
    token,
    causeFault,
    stage,
  } = sequelize.models;
  //area
  area.belongsTo(plant, { foreignKey: "plantId", require: true });

  token.belongsTo(user, { foreignKey: "userId", require: true });

  //cause
  cause.hasMany(solution);
  cause.hasMany(causeFile);
  cause.belongsTo(user, {
    foreignKey: "requestedId",
    require: true,
    as: "requested",
  });
  cause.belongsToMany(fault, { through: "causeFault", foreignKey: "causeId" });

  //causeFile
  causeFile.belongsTo(cause, { foreignKey: "causeId", require: true });

  //method
  method.hasMany(methodFile);
  method.belongsTo(solution);

  //methodFile
  methodFile.belongsTo(method);
  //component
  component.hasMany(componentFile);
  component.hasMany(study);
  component.hasMany(piece);
  component.hasMany(fault);
  component.hasMany(fieldHistory);
  component.hasMany(task);
  component.belongsTo(machine, { foreignKey: "machineId", require: true });
  component.belongsTo(user, { foreignKey: "responsibleId", require: true });

  //componentFile
  componentFile.belongsTo(component, {
    foreignKey: "componentId",
    require: true,
  });
  //fault
  fault.belongsTo(piece, { foreignKey: "pieceId" });
  fault.belongsTo(component, { foreignKey: "componentId" });
  fault.belongsTo(stage, { foreignKey: "stageId" });
  fault.belongsTo(user, {
    foreignKey: "responsibleId",
    require: false,
    as: "responsible",
  });
  fault.belongsToMany(user, {
    through: "userFault",
    foreignKey: "faultId",
    as: "reporters",
  });
  fault.hasMany(faultFile);
  fault.belongsToMany(cause, {
    through: "causeFault",
    foreignKey: "faultId",
    as: "causes",
  });

  //faultFile
  faultFile.belongsTo(fault, { foreignKey: "faultId", require: true });

  //machine
  machine.belongsToMany(stage, {
    through: "machineStage",
    foreignKey: "machineId",
  });
  machine.hasMany(component);
  machine.hasMany(machineFile);
  machine.hasMany(task);
  machine.belongsTo(user, { foreignKey: "responsibleId", require: true });
  machine.belongsTo(plant, { foreignKey: "plantId", require: true });
  machine.belongsTo(area, { foreignKey: "areaId", require: true });
  machine.belongsTo(sublevel, { foreignKey: "sublevelId", require: true });

  //stage
  stage.belongsToMany(machine, {
    through: "machineStage",
    foreignKey: "stageId",
  });

  //machineFile
  machineFile.belongsTo(machine, { foreignKey: "machineId", require: true });

  //piece
  piece.hasMany(pieceFile);
  piece.hasMany(study);
  piece.hasMany(fault);
  piece.hasMany(fieldHistory);
  piece.hasMany(task);
  piece.belongsTo(component, { foreignKey: "componentId", require: true });
  piece.belongsTo(user, { foreignKey: "responsibleId", require: true });

  //pieceFile
  pieceFile.belongsTo(piece, { foreignKey: "pieceId", require: true });

  //plant

  //solution
  solution.hasMany(solutionFile);
  solution.hasMany(method);
  solution.belongsTo(cause, { foreignKey: "causeId", require: true });
  solution.belongsTo(user, {
    foreignKey: "requestedId",
    require: true,
    as: "requested",
  });

  //solutionFile
  solutionFile.belongsTo(solution, { foreignKey: "solutionId", require: true });

  //study
  study.hasMany(studyFile);
  study.belongsTo(piece, { foreignKey: "pieceId" });
  study.belongsTo(component, { foreignKey: "componentId" });
  study.belongsTo(user, { foreignKey: "userId", require: true });

  //studyFile
  studyFile.belongsTo(study, { foreignKey: "studyId", require: true });

  //sublevel
  sublevel.belongsTo(area, { foreignKey: "areaId", require: true });

  //user
  user.belongsToMany(fault, { through: "userFault", foreignKey: "userId" });

  //fieldHistory
  fieldHistory.belongsTo(piece, { foreignKey: "pieceId" });
  fieldHistory.belongsTo(component, { foreignKey: "componentId" });
  fieldHistory.belongsTo(user, { foreignKey: "userId" });

  //task
  task.belongsTo(user, {
    foreignKey: "responsibleId",
    require: false,
    as: "responsible",
  });
  task.belongsTo(user, {
    foreignKey: "requestedId",
    require: false,
    as: "requested",
  });
  task.belongsTo(piece, { foreignKey: "pieceId" });
  task.belongsTo(component, { foreignKey: "componentId" });
  task.belongsTo(machine, { foreignKey: "machineId" });

  fault.belongsToMany(method, { through: "faultMethod" });
  method.belongsToMany(fault, { through: "faultMethod" });

  const performEvaluation = async (causeId, isNew) => {
    const causeRecord = await cause.findOne(
      { where: { id: causeId } },
      { raw: true }
    );
    isNew
      ? await causeRecord.increment("number_of_uses")
      : await causeRecord.decrement("number_of_uses");
  };

  causeFault.belongsTo(cause, { foreignKey: "causeId", require: true });
  causeFault.belongsTo(fault, { foreignKey: "faultId", require: true });

  causeFault.afterCreate(async (causeRecord) => {
    performEvaluation(causeRecord.causeId, true);
  });
  causeFault.afterDestroy(async (causeRecord) => {
    performEvaluation(causeRecord.causeId, false);
  });

  cause.beforeCreate((causeRecord) => {
    causeRecord.number_of_uses = 0;
    causeRecord.isActive = 1;
  });
};

//      Parent.belongsToMany(Child, {through: 'Parent_Child', foreignKey: 'Parent_rowId'})
//      Child.belongsToMany(Parent, {through: 'Parent_Child', foreignKey: 'Child_rowId'})

//      belongsToMany

//      child.getParents,
//      child.setParents,
//      child.createParents
