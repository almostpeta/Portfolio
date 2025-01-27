import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { CardComponent } from "components/UI/Card/index";
import { Loading } from "components/Loading/index";
import { useHistory } from "react-router-dom";
import useTranslate from "hooks/useTranslate";
import { NavbarComponent } from "components/Navbar";
import useUser from "hooks/useUser";
import "./list.css";
import { connect } from "react-redux";
import { WarningAlert } from "components/UI/Alert";

import { doFetchMachines } from "redux/machine/action";

const mapDispatch = (dispatch) => ({
  doFetchMachinesAction: () => dispatch(doFetchMachines()),
});
const mapStateToProps = (state) => {
  return {
    allMachines: state.machine.machines,
    machinesLoading: state.machine.loading,
  };
};

const connector = connect(mapStateToProps, mapDispatch);

const ListMachines = (props) => {
  const t = useTranslate();

  const { doFetchMachinesAction, allMachines, machinesLoading } = props;
  const history = useHistory();
  const [machinesData, setMachinesData] = useState([]);
  const handleClick = (id) => {
    history.push(`/machine/detail/${id}`);
  };

  useEffect(() => {
    doFetchMachinesAction();
  }, [doFetchMachinesAction]);

  useEffect(() => {
    allMachines && setMachinesData(allMachines);
  }, [allMachines]);

  const selectState = (state) => {
    let color = "";
    let text = "";
    let background = "";
    switch (state) {
      // case "Producción":
      case "1":
        color = "#136401";
        text = "Producción";
        background = "#EAFAF1";
        break;
      // case "Mantenimiento":
      case "2":
        background = "#FDF2E9";
        color = "#DC7633";
        text = "Mantenimiento";
        break;
      // case "Detenida":
      case "3":
        background = "#F9EBEA";
        color = "#A2331A";
        text = "Detenida";
        break;
    }
    return { background, color, state: text };
  };

  const displayBody = (machine) => {
    return (
      <div className="CardContent">
        <div className="location">
          {machine.plant && (
            <div style={{ marginBottom: "15px" }}>
              {" "}
              <span style={{ fontWeight: "bold", marginBottom: "15px" }}>
                Planta:{" "}
              </span>{" "}
              {machine.plant.name}
            </div>
          )}
          {machine.area && (
            <div style={{ marginBottom: "15px" }}>
              {" "}
              <span style={{ fontWeight: "bold", marginBottom: "15px" }}>
                Area:
              </span>{" "}
              {machine.area.name}
            </div>
          )}
          {machine.sublevel && (
            <div style={{ marginBottom: "15px" }}>
              {" "}
              <span style={{ fontWeight: "bold", marginBottom: "15px" }}>
                Subnivel:{" "}
              </span>{" "}
              {machine.sublevel.name}
            </div>
          )}
        </div>

        <div className="description">{machine.description}</div>
        <div
          className="state"
          style={{
            backgroundColor: selectState(machine.state).background,
            color: selectState(machine.state).color,
            display: "flex",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          {selectState(machine.state).state}
        </div>
      </div>
    );
  };
  return (
    <div>
      <NavbarComponent />
      <Container
        style={{
          maxHeight: "100vh",
          height: "100vh",
        }}
      >
        <Row className="d-block mt-5">
          <h2 style={{ color: "#01516a" }}>Máquinas</h2>
          <hr />
        </Row>
        {machinesData?.length > 0 && (
          <Row className="dispay-flex justify-content-start">
            {machinesData.map((machine, index) => (
              <Col lg="sm">
                <CardComponent
                  id={machine.id}
                  className="item"
                  fromScreen="Machines"
                  onClick={(e) => handleClick(e)}
                  key={index}
                  title={machine.internal_name}
                  children={displayBody(machine)}
                />
              </Col>
            ))}
          </Row>
        )}
        {machinesLoading && <Loading />}
        {machinesData.length === 0 && !machinesLoading && (
          <Row style={{ display: "flex", justifyItems: "end", margin: "3rem" }}>
            <WarningAlert
              style={{ width: "100%" }}
              title="No se encontraron maquinas disponibles"
            />
          </Row>
        )}
      </Container>
    </div>
  );
};

export default connector(ListMachines);
