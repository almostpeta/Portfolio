import React from "react";
import { Container, Row } from "react-bootstrap";
import { NavbarComponent } from "components/Navbar";
import useTranslate from "hooks/useTranslate";
import RegisterForm from "./Register";

const RegisterContainer = () => {
  const t = useTranslate();
  return (
    <>
      <NavbarComponent />
      <Container>
        <Row className="d-block mt-5 ml-0 mr-0">
          <h2 style={{ color: "#01516a" }}>
            {t("containers.register.form.title")}
            <hr />
          </h2>
        </Row>
        <RegisterForm />
      </Container>
    </>
  );
};

export default RegisterContainer;
