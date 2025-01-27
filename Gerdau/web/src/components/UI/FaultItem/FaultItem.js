import React from "react";
import { Col, Row } from "react-bootstrap";
import { Button } from "components/Button";
import "./FaultItem.css";

const FaultItem = ({ fault, onDetailClick }) => (
  <Row
    className="fault-item-container mt-3 justify-content-between"
    style={{ padding: "0px", margin: "0px", borderLeft: "10px solid #961706" }}
  >
    <Col xs={6} lg={7}>
      {fault.name}
    </Col>
    <Col xs={2} lg={2}>
      <Button
        className="mr-3"
        variant="info"
        onClick={() => onDetailClick(fault)}
      >
        Detalles
      </Button>
    </Col>
  </Row>
);

export default FaultItem;
