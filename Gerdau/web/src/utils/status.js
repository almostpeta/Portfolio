import React from "react";

import {
  TASK_STATUSES,
  FAULT_STATES,
  SOLUTION_STATUSES,
} from "utils/constants";

export const getTaskStateStyles = (state) => {
  let color = "";
  let background = "";
  switch (state) {
    case TASK_STATUSES.COMPLETED:
      color = "#136401";
      background = "#EAFAF1";
      break;
    case TASK_STATUSES.NOT_COMPLETED:
      background = "#FDF2E9";
      color = "#DC7633";
      break;
  }
  return { background, color };
};

export const getCalendarTaskStateStyles = (state) => {
  let color = "";
  let background = "";
  switch (state) {
    case TASK_STATUSES.COMPLETED:
      color = "#FFFFFF";
      background = "#136401";
      break;
    case TASK_STATUSES.NOT_COMPLETED:
      background = "#DC7633";
      color = "#FFFFFF";
      break;
  }
  return { background, color, fontWeight: 500 };
};

export const getFaultStateStyles = (state) => {
  let color = "";
  let background = "";
  switch (state) {
    case FAULT_STATES.RESOLVED:
      color = "#136401";
      background = "#EAFAF1";
      break;
    case FAULT_STATES.IN_PROGRESS:
      background = "#FDF2E9";
      color = "#DC7633";
      break;
    case FAULT_STATES.PENDING:
      background = "#F9EBEA";
      color = "#A2331A";
      break;
  }
  return { background, color };
};

export const getSolutionStyles = (state) => {
  let color = "";
  let background = "";
  switch (state?.toLowerCase()) {
    case SOLUTION_STATUSES.APPROVED.toLowerCase():
      color = "#136401";
      background = "#EAFAF1";
      break;
    case SOLUTION_STATUSES.REQUESTED.toLowerCase():
      background = "#FDF2E9";
      color = "#DC7633";
      break;
    case SOLUTION_STATUSES.REJECTED.toLowerCase():
      background = "#F9EBEA";
      color = "#A2331A";
      break;
  }
  return { background, color };
};
