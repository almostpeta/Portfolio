import React from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  CheckCircleFill,
  XCircleFill,
  ExclamationCircleFill,
  X,
} from "react-bootstrap-icons";

//Toastify__toast--success
const content = (icon: any, message: string) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
      }}
    >
      {icon && (
        <div
          style={{
            margin: "15px",
          }}
        >
          {icon}
        </div>
      )}
      {message}
    </div>
  );
};

export const Toast = (type: string, message: string) => {
  switch (type) {
    case "success":
      toast.success(content(<CheckCircleFill size={15} />, message));
      break;
    case "error":
      toast.error(content(<XCircleFill size={15} />, message));
      break;
    case "warning":
      toast.warning(content(<ExclamationCircleFill size={15} />, message));
      break;
    case "info":
      toast.info(content(<CheckCircleFill size={15} />, message));
      break;

    default:
      toast.info(content(<CheckCircleFill size={15} />, message));
  }
};
