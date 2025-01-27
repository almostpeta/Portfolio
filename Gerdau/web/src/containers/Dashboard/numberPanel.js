import React, { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";

import "./dashboard.css";
import AnimatedNumber from "react-animated-number";

const NumberPanel = ({ title, elements, isFirstOfSection }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    elements && setData(elements);
  }, [elements]);

  return (
    <div>
      <Row
        className={`d-flex m-0 w-100 justify-content-center align-items-centermt-3  ${
          isFirstOfSection ? "mt-3" : "mt-5"
        }`}
      >
        <div className="d-block">
          <h4 style={{ color: "#01516a" }}>{title}</h4>
          <hr />
        </div>
      </Row>
      <Row className="d-flex m-0 w-100 justify-content-center align-items-center">
        {data &&
          data.map((element) => {
            return (
              <Col size="sm" sm="2" className="dashboardCard text-center">
                <div
                  className="font-weight-bold"
                  style={{ color: "rgb(1, 81, 106)" }}
                >
                  {element?.name}
                </div>
                <AnimatedNumber
                  component="text"
                  value={element.value}
                  style={{
                    transition: "2s ease-out",
                    fontSize: 55,
                    transitionProperty: "background-color, color, opacity",
                  }}
                  frameStyle={(perc) =>
                    perc === 200 ? {} : { backgroundColor: "white" }
                  }
                  stepPrecision={0}
                  duration={350}
                />
              </Col>
            );
          })}
      </Row>
    </div>
  );
};

export default NumberPanel;
