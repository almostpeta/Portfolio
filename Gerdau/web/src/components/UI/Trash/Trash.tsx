import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "react-bootstrap";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

type Props = {
  size: any;
  style?: any;
};

type ButtonProps = {
  size: any;
  style?: any;
  onClick: Function;
};

export const Trash: React.FC<Props> = (props) => {
  return (
    <div>
      <FontAwesomeIcon icon={faTrash} style={props.style} size={props.size} />
    </div>
  );
};

export const TrashButton: React.FC<ButtonProps> = (props) => {
  return (
    <Button
      onClick={() => props.onClick()}
      style={props.style}
      variant="danger"
    >
      <Trash size={props.size} />
    </Button>
  );
};
