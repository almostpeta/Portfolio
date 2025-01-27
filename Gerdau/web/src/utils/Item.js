import { ITEM_TYPES } from "utils/constants";

export const getItemStyles = (variant) => {
  let color = "";
  let background = "";
  let border = "";
  let label = "";
  switch (variant?.toLowerCase()) {
    case ITEM_TYPES.CAUSE.toLowerCase():
      color = "#E3B202";
      background = "#FFFAE7";
      border = "#D7A800";
      label = "Causa";
      break;
    case ITEM_TYPES.SOLUTION.toLowerCase():
      background = "#EAFAF1";
      color = "#136401";
      border = "#01660B";
      label = "Solución";
      break;
    case ITEM_TYPES.METHOD.toLowerCase():
      background = "#EAF4FF";
      color = "#5DA4EF";
      border = "#01516A";
      label = "Método";
      break;
  }
  return { background, color, border, label };
};

export const getChildItemLabel = (variant) => {
  let label = "";
  switch (variant?.toLowerCase()) {
    case ITEM_TYPES.CAUSE.toLowerCase():
      label = "Solución";
      break;
    case ITEM_TYPES.SOLUTION.toLowerCase():
      label = "Método";
      break;
  }
  return label;
};
