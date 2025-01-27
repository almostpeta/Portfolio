import React from "react";
import { Col, Row } from "react-bootstrap";
import "./PieceItem.css";

const CauseItem = ({ piece, onDetailClick, onSelectClick }) => (
  <Row
    className="piece-item-container"
    style={{ padding: "0px", margin: "0px" }}
  >
    <Col xs={6} lg={7}>
      {piece.internal_name}
    </Col>
    <Col xs={2} lg={2}>
      <button className="unbordered-btn" onClick={() => onDetailClick(piece)}>
        Detalles
      </button>
    </Col>
    <Col xs={4} lg={3}>
      <button className="unbordered-btn" onClick={() => onSelectClick(piece)}>
        Seleccionar
      </button>
    </Col>
  </Row>
);

export default CauseItem;
