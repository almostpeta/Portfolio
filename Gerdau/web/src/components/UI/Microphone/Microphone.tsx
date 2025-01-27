import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophoneAlt } from "@fortawesome/free-solid-svg-icons";

type Props = {
  size: any;
  style?: any;
};

export const Micro: React.FC<Props> = (props) => {
  return (
    <div>
      <FontAwesomeIcon
        icon={faMicrophoneAlt}
        style={props.style}
        size={props.size}
      />
    </div>
  );
};

export const BorderedMicro: React.FC<Props> = (props) => {
  return (
    <div style={{ border: "round" }}>
      <FontAwesomeIcon
        icon={faMicrophoneAlt}
        style={props.style}
        size={props.size}
      />
    </div>
  );
};
