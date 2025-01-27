import React from "react";
import "./Header.css";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";

interface IProps {
  onDelete: Function;
  onSubmit: Function;
  showDelete: Boolean;
  title: String;
}

export const Header = ({ title, onSubmit, onDelete, showDelete }: IProps) => {
  return (
    <div className="HeaderContainer">
      {/* <div className="HeaderTitle">{title}</div> */}

      <Button
        variant="primary"
        className="btn-class"
        onClick={() => onSubmit(true)}
      >
        Guardar
      </Button>
      {showDelete && (
        <Button
          variant="danger"
          className="btn-class"
          onClick={(e) => onDelete(e)}
        >
          Eliminar
        </Button>
      )}
    </div>
  );
};
