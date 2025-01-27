import React from "react";
import { Alert } from "react-bootstrap";
import { Warning } from "components/UI/Warning";

type Props = {
  title: any;
};

export const WarningAlert: React.FC<Props> = (props) => {
  return (
    <Alert variant="warning" style={{ width: "100%" }}>
      <Warning size="1x" /> {props.title}
    </Alert>
  );
};
