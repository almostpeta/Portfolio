import React, { useState, useEffect } from "react";
import { Col, Collapse, Row } from "react-bootstrap";
import { BiCheckCircle } from "react-icons/bi";
import { Subtitle } from "./Title";
import "./styles.css";

const SelectedCausesList = ({ title, causes }) => {
  const [receivedCauses, setReceivedCauses] = useState(causes);

  useEffect(() => {
    causes && setReceivedCauses(causes);
  }, [causes]);

  return (
    <div className="my-2 mx-2">
      {receivedCauses.length > 0 && (
        <>
          <Subtitle>{title}</Subtitle>
          <Col>
            {receivedCauses.map((cause) => (
              <Row className="selected-cause mt-2" key={cause.id}>
                <div className="ml-2">
                  <BiCheckCircle color="green" size={20} />
                </div>
                <span className="ml-2 font-weight-normal">{cause.name}</span>
              </Row>
            ))}
          </Col>
        </>
      )}
    </div>
  );
};

export default SelectedCausesList;
