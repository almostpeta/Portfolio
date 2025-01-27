import React from "react";
import "./Card.css";
import { Col, Row } from "react-bootstrap";

interface IProps {
  header: any;
  content: any;
  footer: any;
}

export const Card = ({ header, content, footer }: IProps) => {
  return (
    <Row>
      <Col
        style={{
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
        }}
      >
        <div className="CardContainer">
          <div className="Header">{header}</div>
          <div className="CardContent">{content}</div>
          <div className="Footer">{footer}</div>
        </div>
      </Col>
    </Row>
  );
};
