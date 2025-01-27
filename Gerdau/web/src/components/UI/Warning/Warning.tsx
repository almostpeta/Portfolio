import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";

type Props = {
  size: any;
  style?: any;
};

export const Warning: React.FC<Props> = (props) => {
  return (
    <FontAwesomeIcon
      icon={faExclamationTriangle}
      style={props.style}
      size={props.size}
    />
  );
};
