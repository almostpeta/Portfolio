import React from "react";
import { GiHexagonalNut } from "react-icons/gi";
import { BiUserPlus, BiUser } from "react-icons/bi";
import { AiOutlineDashboard } from "react-icons/ai";

import useTranslate from "hooks/useTranslate";
import { NavbarComponent } from "components/Navbar";
import { Row, Container } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { CardComponent } from "components/UI/Card/index";
import "./home.css";

const adminPrefix = "/admin";

const AdminHome = () => {
  const t = useTranslate();
  const history = useHistory();

  function handleClickNewMachine() {
    history.push(`${adminPrefix}/machine/new`);
  }

  function handleClickListUsers() {
    history.push(`${adminPrefix}/user/list`);
  }

  function handleClickRegisterUser() {
    history.push(`${adminPrefix}/user/new`);
  }

  function handleClickDashboard() {
    history.push(`${adminPrefix}/report/dashboard`);
  }

  return (
    <div className="home">
      <NavbarComponent />
      <Container
        fluid
        className="homePanel"
        style={{ maxHeight: "100vh", overflowY: "scroll", height: "100vh" }}
      >
        <div className="d-block ml-3 mr-3 mt-5">
          <h2 style={{ color: "#01516a" }}>Accesos Rápidos</h2>
          <hr />
        </div>
        <Row className="d-flex m-3 w-100">
          <CardComponent
            className="item"
            title={"Máquinas"}
            fromScreen="Home"
            children={
              <Row className="d-flex">
                <div
                  className="homeButton"
                  onClick={() => handleClickNewMachine()}
                >
                  <GiHexagonalNut size={50} />
                  <p style={{ color: "#01516a", fontSize: "20px" }}>
                    {t("containers.home.addNewMachine")}
                  </p>
                </div>
              </Row>
            }
          />
        </Row>

        <Row className="d-flex m-3  w-100">
          <CardComponent
            className="item"
            title={"Usuarios"}
            fromScreen="Home"
            children={
              <Row className="d-flex">
                <div
                  className="homeButton"
                  onClick={() => handleClickListUsers()}
                >
                  <BiUser size={50} />
                  <p style={{ color: "#01516a", fontSize: "20px" }}>
                    {t("containers.home.list_users")}
                  </p>
                </div>

                <div
                  className="homeButton"
                  onClick={() => handleClickRegisterUser()}
                >
                  <BiUserPlus size={50} />
                  <p style={{ color: "#01516a", fontSize: "20px" }}>
                    {t("containers.home.register")}
                  </p>
                </div>
              </Row>
            }
          />
        </Row>
        <Row className="d-flex m-3  w-100">
          <CardComponent
            className="item"
            title={"Reportes"}
            fromScreen="Home"
            children={
              <Row className="d-flex">
                <div
                  className="homeButton"
                  onClick={() => handleClickDashboard()}
                >
                  <AiOutlineDashboard size={50} />
                  <p style={{ color: "#01516a", fontSize: "20px" }}>
                    {"Vista general"}
                  </p>
                </div>
              </Row>
            }
          />
        </Row>
      </Container>
    </div>
  );
};

export default AdminHome;
