import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQrcode } from "@fortawesome/free-solid-svg-icons";

type Props = {
  size: any;
  style?: any;
};

export const QR: React.FC<Props> = (props) => {
  return (
    <div>
      <FontAwesomeIcon icon={faQrcode} style={props.style} size={props.size} />
    </div>
  );
};
