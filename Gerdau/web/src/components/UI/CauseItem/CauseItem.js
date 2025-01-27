import React, { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import { Button } from "components/Button";
import Switch from "react-switch";
import "./CauseItem.css";

const CauseItem = ({ cause, onDetailClick, onSelectClick }) => {
  const [receivedCause, setReceivedCause] = useState(cause);

  useEffect(() => {
    cause && setReceivedCause(cause);
  }, [cause]);

  const handleClick = () => {
    onSelectClick(receivedCause);
  };
  return (
    <Row
      className="cause-item-container mt-3 justify-content-between"
      style={{
        padding: "0px",
        margin: "0px",
        borderLeft: "10px solid #D7A800",
      }}
    >
      <Row className="mr-0 ml-2" style={{}}>
        {receivedCause.name}
      </Row>
      <Col className="d-flex justify-content-end align-items-center">
        <Button
          className="mr-3"
          variant="info"
          onClick={() => onDetailClick(receivedCause)}
        >
          Detalles
        </Button>
        <Switch
          checked={receivedCause.isSelected}
          onChange={handleClick}
          onColor="#86d3ff"
          onHandleColor="#2693e6"
          handleDiameter={30}
          uncheckedIcon={false}
          checkedIcon={false}
          boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
          activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
          height={20}
          width={48}
          className="react-switch"
          id="material-switch"
        />
      </Col>
    </Row>
  );
};

export default CauseItem;
