import React from "react";
import { Container, Row } from "react-bootstrap";
import { NavbarComponent } from "components/Navbar";
import useTranslate from "hooks/useTranslate";
import Form from "./Form";

const ForgetPasswordContainer = (props) => {
  const t = useTranslate();
  return (
    <>
      <Container>
        <Row className="d-block mt-5 ml-0 mr-0">
          <h2 style={{ color: "#01516a" }}>
            {t("containers.forget_password.form.title")}
          </h2>
          <hr />
        </Row>
        <Form props={props} />
      </Container>
    </>
  );
};

export default ForgetPasswordContainer;
