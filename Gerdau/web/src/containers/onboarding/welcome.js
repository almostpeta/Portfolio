import React from "react";
import imageMedia from "assets/images/undraw_browsing.svg";
import { Card } from "components/Card/index.tsx";
import "./welcome.css";
import { useHistory } from "react-router-dom";
import { Button, Container } from "react-bootstrap";
import useUser from "hooks/useUser";

const Welcome = () => {
  const history = useHistory();
  const { isAdminView } = useUser();

  function handleClick() {
    history.push(`${isAdminView ? "/admin/" : "/"}home`);
  }

  return (
    <Container>
      <Card
        header={<h2>Bienvenido al Historial Clínico de Máquinas! 🎉</h2>}
        content={
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ fontSize: "20px", color: "gray" }}>
              Empieza para poder registrar y dar seguimiento a máquinas!
            </div>
            <img
              src={imageMedia}
              style={{
                width: "100%",
                height: "200px",
                maxHeight: "200px",
                marginTop: "20px",
              }}
            />
          </div>
        }
        footer={
          <div
            style={{
              width: "100%",
            }}
          >
            <Button
              style={{
                width: "100%",
              }}
              onClick={() => handleClick()}
            >
              {" "}
              Empezar!
            </Button>
          </div>
        }
      />
    </Container>
  );
};

export default Welcome;
