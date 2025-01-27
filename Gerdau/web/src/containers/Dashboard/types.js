export const REPORT_TYPE = Object.freeze({
  TASK: "task",
  FAULT: "fault",
  CAUSE: "cause",
  SOLUTION: "solution",
  MACHINE: "machine",
  COMPONENT: "component",
  PIECE: "piece",
});

export const REPORT_OPTIONS = [
  { value: REPORT_TYPE.TASK, label: "Tareas" },
  { value: REPORT_TYPE.FAULT, label: "Fallas" },
  { value: REPORT_TYPE.CAUSE, label: "Causas" },
  { value: REPORT_TYPE.SOLUTION, label: "Soluciones" },
  { value: REPORT_TYPE.MACHINE, label: "Máquinas" },
  { value: REPORT_TYPE.COMPONENT, label: "Componentes" },
  { value: REPORT_TYPE.PIECE, label: "Piezas" },
];
