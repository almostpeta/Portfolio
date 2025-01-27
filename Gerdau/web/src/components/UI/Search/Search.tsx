import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

type Props = {
  size: any;
  style?: any;
};

export const Search: React.FC<Props> = (props) => {
  return (
    <div>
      <FontAwesomeIcon icon={faSearch} style={props.style} size={props.size} />
    </div>
  );
};
