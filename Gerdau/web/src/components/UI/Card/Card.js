import React from "react";
import { Card } from "react-bootstrap";

const machinesStyles = {
  width: "22rem",
  float: "left",
  position: "relative",
  alignItems: "left",
  justifyContent: "flex-start",
  border: "none",
  borderRadius: "10px",
  boxShadow: "1px 1px 8px #e2e2e2",
  background: "none",
};

const homeStyles = {
  float: "left",
  position: "relative",
  alignItems: "left",
  justifyContent: "flex-start",
  width: "95%",
  border: "none",
  borderRadius: "10px",
  boxShadow: "none",
  background: "none",
};

const pickStyle = (screen) => {
  let style;
  switch (screen) {
    case "Machines":
      style = machinesStyles;
      break;
    case "Home":
      style = homeStyles;
      break;
  }
  return style;
};

export const CardComponent = ({
  id,
  header,
  title,
  children,
  onClick,
  fromScreen,
}) => (
  <Card
    value={id}
    className="item"
    border="primary"
    style={pickStyle(fromScreen)}
    onClick={(e) => onClick && onClick(id)}
  >
    <Card.Header
      style={{
        padding: ".75rem 1.25rem",
        marginBottom: 0,
        backgroundColor: "rgba(0,0,0,.08)",
        border: "none",
        height: "45px",
        background: "rgb(1, 81, 106)",
        color: "white",
        borderRadius: "10px 0 10px 0",
      }}
    >
      <Card.Title
        style={{ marginBottom: "15px", fontSize: 20, fontWeight: "bold" }}
      >
        {title}
      </Card.Title>
    </Card.Header>
    <Card.Body style={{ background: "none" }}>{children}</Card.Body>
  </Card>
);
