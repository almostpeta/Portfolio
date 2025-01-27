export const FAULT_STATES = Object.freeze({
  PENDING: "Pendiente",
  IN_PROGRESS: "En progreso",
  RESOLVED: "Resuelta",
});

export const TASK_STATUSES = Object.freeze({
  NOT_COMPLETED: "No Completado",
  COMPLETED: "Completado",
});

export const FAULT_TYPES = Object.freeze({
  HYDRAULIC: "Hidráulica",
  ELECTRICAL: "Eléctrica",
  NEUMATICAL: "Neumática",
  MECHANICAL: "Mecánica",
});

export const CAUSE_STATUSES = Object.freeze({
  REQUESTED: "Solicitada",
  APPROVED: "Aprobada",
  REJECTED: "Rechazada",
});

export const SOLUTION_STATUSES = Object.freeze({
  REQUESTED: "Solicitada",
  APPROVED: "Aprobada",
  REJECTED: "Rechazada",
});

export const ITEM_TYPES = Object.freeze({
  CAUSE: "cause",
  SOLUTION: "solution",
  METHOD: "method",
});
