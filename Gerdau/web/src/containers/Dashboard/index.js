import React, { useEffect, useState } from "react";
import { Container, Row } from "react-bootstrap";
import {
  tasksPerMonth,
  tasksPerMachine,
  faultsByType,
  machinesTotalNumber,
  faultsByMachine,
  faultsPerMonth,
  pendingFaults,
  faultsTotalNumbers,
  faultsNumbersByPeriod,
  tasksTotalNumbers,
  tasksNumbersByPeriod,
} from "service/report";
import { NavbarComponent } from "components/Navbar";
import { Loading } from "components/Loading/index";
import { Toast } from "components/Toast";
import Dashboard from "./dashboard";

const DetailPage = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [tasksPerMonthResponse, setTasksPerMonthResponse] = useState({});
  const [faultsByTypeResponse, setFaultsByTypeResponse] = useState({});
  const [faultsPerMonthResponse, setFaultsPerMonthResponse] = useState({});
  const [machinesTotalResponse, setMachinesTotalResponse] = useState({});
  const [tasksPerMachineResponse, setTasksPerMachineResponse] = useState({});
  const [pendingFaultsResponse, setPendingFaultsResponse] = useState({});
  const [faultsByMachineResponse, setFaultsByMachineResponse] = useState({});
  const [faultsTotalNumbersResponse, setFaultsTotalNumbersResponse] = useState(
    {}
  );
  const [
    faultsNumbersByPeriodResponse,
    setFaultsNumbersByPeriodResponse,
  ] = useState({});
  const [tasksTotalNumbersResponse, setTasksTotalNumbersResponse] = useState(
    {}
  );
  const [
    tasksNumbersByPeriodResponse,
    setTasksNumbersByPeriodResponse,
  ] = useState({});

  useEffect(async () => {
    tasksPerMonth().then((res) =>
      setTasksPerMonthResponse({ tasksPerMonth: res })
    );
    faultsByType().then((res) => {
      setFaultsByTypeResponse({ faultsByType: res });
    });
    faultsPerMonth().then((res) =>
      setFaultsPerMonthResponse({ faultsPerMonth: res })
    );
    machinesTotalNumber().then((res) =>
      setMachinesTotalResponse({ machinesTotalNumber: res })
    );
    tasksPerMachine().then((res) =>
      setTasksPerMachineResponse({ tasksPerMachine: res })
    );

    pendingFaults().then((res) =>
      setPendingFaultsResponse({ pendingFaults: res })
    );

    faultsByMachine().then((res) =>
      setFaultsByMachineResponse({ faultsByMachine: res })
    );

    faultsTotalNumbers().then((res) =>
      setFaultsTotalNumbersResponse({ faultsTotalNumber: res })
    );

    faultsNumbersByPeriod().then((res) =>
      setFaultsNumbersByPeriodResponse({ faultsNumbersByPeriod: res })
    );

    tasksTotalNumbers().then((res) =>
      setTasksTotalNumbersResponse({ tasksTotalNumber: res })
    );

    tasksNumbersByPeriod().then((res) =>
      setTasksNumbersByPeriodResponse({ tasksNumberByPeriod: res })
    );
  }, []);

  return (
    <>
      {isLoading && (
        <div>
          <Loading />
        </div>
      )}
      {!isLoading && (
        <div>
          <NavbarComponent />
          <Container
            style={{
              maxHeight: "100vh",
              height: "100vh",
            }}
          >
            <Row className="d-block mt-5 ml-0 mr-0">
              <h2 style={{ color: "#01516a" }}>Vista General</h2>
              <hr />
            </Row>
            <Dashboard
              data={{
                ...tasksPerMonthResponse,
                ...faultsByTypeResponse,
                ...faultsPerMonthResponse,
                ...machinesTotalResponse,
                ...tasksPerMachineResponse,
                ...pendingFaultsResponse,
                ...faultsByMachineResponse,
                ...faultsTotalNumbersResponse,
                ...faultsNumbersByPeriodResponse,
                ...tasksTotalNumbersResponse,
                ...tasksNumbersByPeriodResponse,
              }}
            />
          </Container>
        </div>
      )}
    </>
  );
};

export default DetailPage;
