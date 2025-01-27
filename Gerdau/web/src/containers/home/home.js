import React from "react";
import { GiHexagonalNut } from "react-icons/gi";
import { FaUserPlus, FaSearch } from "react-icons/fa";
import { FiUsers } from "react-icons/fi";
import { ImList } from "react-icons/im";
import useTranslate from "hooks/useTranslate";
import { BiTask } from "react-icons/bi";
import { ImCalendar } from "react-icons/im";

import { BiError } from "react-icons/bi";
import { NavbarComponent } from "components/Navbar";
import { Row, Container } from "react-bootstrap";
import { CardComponent } from "components/UI/Card/index";
import { RiOilFill } from "react-icons/ri";
import { useHistory } from "react-router-dom";
import "./home.css";

const Home = () => {
  const t = useTranslate();
  const history = useHistory();

  function handleClickListMachine() {
    history.push("/machines");
  }

  function handleClickListTasks() {
    history.push("/task/list");
  }

  function handleClickCalendar() {
    history.push("/task/calendar");
  }

  function handleClickNewFault() {
    history.push("/fault/new");
  }

  function handleClickListFaults() {
    history.push("/fault/list");
  }

  function handleSearchFaultsClick() {
    history.push("/fault/search");
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
            title={"Fallas"}
            fromScreen="Home"
            children={
              <Row className="d-flex">
                <div
                  className="homeButton"
                  onClick={() => handleClickListFaults()}
                >
                  <ImList size={50} />
                  <p style={{ color: "#01516a", fontSize: "20px" }}>
                    Listar todas las fallas
                  </p>
                </div>

                <div
                  className="homeButton"
                  onClick={() => handleClickNewFault()}
                >
                  <BiError size={65} />
                  <p style={{ color: "#01516a", fontSize: "20px" }}>
                    {t("containers.home.reportFault")}
                  </p>
                </div>
                <div
                  className="homeButton"
                  onClick={() => handleSearchFaultsClick()}
                >
                  <FaSearch size={55} />
                  <p style={{ color: "#01516a", fontSize: "20px" }}>
                    Buscar Fallas por Causas
                  </p>
                </div>
              </Row>
            }
          />
        </Row>
        <Row className="d-flex m-3  w-100">
          <CardComponent
            className="item"
            title={"Tareas"}
            fromScreen="Home"
            children={
              <Row className="d-flex">
                <div
                  className="homeButton"
                  onClick={() => handleClickCalendar()}
                >
                  <ImCalendar size={50} />
                  <p style={{ color: "#01516a", fontSize: "20px" }}>
                    {"Ver Calendario"}
                  </p>
                </div>
                <div
                  className="homeButton"
                  onClick={() => handleClickListTasks()}
                >
                  <BiTask size={50} />
                  <p style={{ color: "#01516a", fontSize: "20px" }}>
                    {"Listar Mis Tareas"}
                  </p>
                </div>
              </Row>
            }
          />
        </Row>
        <Row className="d-flex m-3 w-100">
          <CardComponent
            className="item"
            title={"Máquinas"}
            fromScreen="Home"
            children={
              <Row className="d-flex">
                <div
                  className="homeButton"
                  onClick={() => handleClickListMachine()}
                >
                  <GiHexagonalNut size={50} />
                  <p style={{ color: "#01516a", fontSize: "20px" }}>
                    {t("containers.home.listAllMachines")}
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

export default Home;
