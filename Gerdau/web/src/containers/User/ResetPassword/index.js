import React from "react";
import { Container, Row } from "react-bootstrap";
import { NavbarComponent } from "components/Navbar";
import useTranslate from "hooks/useTranslate";
import Form from "./Form";

const RegisterContainer = (props) => {
  const t = useTranslate();

  let token = "";
  let isNewUser = false;
  if (props.location?.search) {
    const searchParams = new URLSearchParams(props.location.search);
    token = searchParams.get("t");
    isNewUser = searchParams.get("isNewUser") === "true";
  }

  return (
    <>
      <Container>
        <Row className="justify-content-md-center mt-5 text-left">
          <h2 style={{ color: "#01516a" }}>
            {isNewUser
              ? t("containers.reset_password.confirm_register_form.title")
              : t("containers.reset_password.form.title")}
          </h2>
          <hr />
        </Row>
        <Form isNewUser={isNewUser} token={token} />
      </Container>
    </>
  );
};

export default RegisterContainer;
