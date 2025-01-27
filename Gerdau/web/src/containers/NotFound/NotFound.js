import React from "react";
import { Container, Row } from "react-bootstrap";
import useUser from "hooks/useUser";
import { useHistory } from "react-router-dom";
import "./NotFound.css";
import { Button } from "components/Button";

const NotFound = () => {
  const { isAdmin, isAdminView, setIsAdminView } = useUser();
  const history = useHistory();

  const handleLoginClick = () => {
    history.push("/login");
  };

  const handleHomeClick = () => {
    isAdminView ? history.push("/admin/home") : history.push("/home");
  };

  return (
    <Container className="text-center mt-5">
      <h1>Página no encontrada</h1>
      <h4>Parece que la página solicitada no es válida</h4>
      <Row className="align-items-center justify-content-center align-items-center">
        <Button onClick={handleLoginClick}>Ir a Login</Button>
        <Button className="ml-2" onClick={handleHomeClick}>
          Ir a Inicio
        </Button>
        {isAdmin}
      </Row>
    </Container>
  );
};

export default NotFound;
