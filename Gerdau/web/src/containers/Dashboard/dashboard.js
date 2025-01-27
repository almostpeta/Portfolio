import React, { useEffect, useState } from "react";
import { Row, Col, Container, Form } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { ImWarning } from "react-icons/im";
import { generateCSV } from "service/report";
import PendingFaults from "./pendingFaults";
import moment from "moment";
import { GiHexagonalNut } from "react-icons/gi";
import { saveAs } from "file-saver";
import useTranslate from "hooks/useTranslate";
import { FAULT_TYPES } from "utils/constants";
import { REPORT_OPTIONS } from "./types";
import "./dashboard.css";
import {
  LineChart,
  Line,
  CartesianGrid,
  Tooltip,
  BarChart,
  Label,
  LabelList,
  Sector,
  Bar,
  XAxis,
  YAxis,
  Cell,
  ResponsiveContainer,
} from "recharts";
import useUser from "hooks/useUser";
import { Pie } from "react-chartjs-2";
import { Button } from "components/Button";
import { BiTask } from "react-icons/bi";
import NumberPanel from "./numberPanel";
import { FaFileExport } from "react-icons/fa";

const DashboardPage = ({ data }) => {
  const history = useHistory();
  const [reportsData, setReportsData] = useState([]);
  const [reportOption, setReportOption] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const t = useTranslate();
  const { isAdmin } = useUser();
  const [reportOptions] = useState(REPORT_OPTIONS);

  useEffect(() => {
    data && setReportsData(data);
  }, [data]);

  const dataPie = () => {
    const {
      mechanicFaults,
      electricalFaults,
      hydraulicFaults,
      neumaticFaults,
    } = formatPieData();
    return {
      labels: ["Mecánica", "Hidráulica", "Neumática", "Eléctrica"],
      datasets: [
        {
          label: "# fallas",
          data: [
            mechanicFaults,
            hydraulicFaults,
            neumaticFaults,
            electricalFaults,
          ],
          backgroundColor: ["#961706", "rgb(0, 58, 76)", "#DFAF01", "#068596"],
          borderColor: ["#961706", "rgb(0, 58, 76)", "#DFAF01", "#068596"],
          borderWidth: 1,
        },
      ],
    };
  };

  const formatPieData = () => {
    let mechanicFaults = 0;
    let electricalFaults = 0;
    let hydraulicFaults = 0;
    let neumaticFaults = 0;
    reportsData.faultsByType &&
      reportsData.faultsByType.map((element) => {
        const { type, faults } = element;
        switch (type) {
          case FAULT_TYPES.MECHANICAL:
            mechanicFaults += faults;
            break;
          case FAULT_TYPES.HYDRAULIC:
            hydraulicFaults += faults;
            break;

          case FAULT_TYPES.NEUMATICAL:
            neumaticFaults += faults;
            break;
          case FAULT_TYPES.ELECTRICAL:
            electricalFaults += faults;
            break;
        }
      });
    return {
      mechanicFaults,
      electricalFaults,
      hydraulicFaults,
      neumaticFaults,
    };
  };

  const handleGenerateReport = async () => {
    setSubmitted(true);
    const date = moment().format("DD/MM/YYYY");
    const name = reportOptions.find((element) => element.value === reportOption)
      ?.label;
    reportOption &&
      generateCSV(reportOption)
        .then((csv) => {
          const csvData = new Blob([csv], { type: "text/csv;charset=utf-8;" });
          saveAs(csvData, `${name}-${date}`);
        })
        .finally(setSubmitted(false));
  };

  return (
    <Container>
      <Row
        className={`d-flex m-3 w-100 justify-content-center ${
          submitted && !reportOption ? "align-items-center" : "align-items-end"
        }`}
      >
        <div
          className="d-flex m-3 w-100  align-items-center"
          style={{
            color: "#01516a",
            width: "100%",
            padding: ".75rem 1.25rem",
            marginBottom: 0,
            backgroundColor: "rgba(0,0,0,.08)",
            border: "none",
            height: "45px",
            background: "rgb(1, 81, 106)",
            color: "white",
            borderRadius: "10px 0 10px 0",
          }}
        >
          <h3
            style={{
              color: "white",
            }}
          >
            Exportar datos <FaFileExport size={20} />
          </h3>
        </div>
        <Form.Group controlId="reportOption" className="mt-0 mb-0">
          <Form.Label>Tipo de Reporte</Form.Label>
          <Form.Control
            as="select"
            value={reportOption}
            isInvalid={submitted && !reportOption}
            onChange={(e) => setReportOption(e.target.value)}
          >
            <option value="" hidden>
              {"Seleccionar Tipo de Reporte"}
            </option>
            {reportOptions &&
              reportOptions.map((u, i) => (
                <option key={i} value={u.value}>
                  {u.label}
                </option>
              ))}
          </Form.Control>
          <Form.Control.Feedback type="invalid">
            {"Seleccione un tipo de reporte"}
          </Form.Control.Feedback>
        </Form.Group>
        <Button className="ml-sm-4" onClick={handleGenerateReport}>
          Exportar
        </Button>
      </Row>
      <Row className="d-flex m-3 w-100 justify-content-center align-items-center">
        <div
          className="d-flex m-3 w-100  align-items-center"
          style={{
            color: "#01516a",
            width: "100%",
            padding: ".75rem 1.25rem",
            marginBottom: 0,
            backgroundColor: "rgba(0,0,0,.08)",
            border: "none",
            height: "45px",
            background: "rgb(1, 81, 106)",
            color: "white",
            borderRadius: "10px 0 10px 0",
          }}
        >
          <h3
            style={{
              color: "white",
            }}
          >
            Máquinas <GiHexagonalNut size={20} />
          </h3>
        </div>
      </Row>
      <NumberPanel
        title="Total de Máquinas"
        isFirstOfSection
        elements={[
          {
            value:
              reportsData?.machinesTotalNumber &&
              reportsData?.machinesTotalNumber[0].total,
          },
        ]}
      />
      <NumberPanel
        title="Total de Máquinas por estado"
        elements={[
          {
            name: "Producción",
            value:
              reportsData?.machinesTotalNumber &&
              reportsData?.machinesTotalNumber[0].produccion,
          },
          {
            name: "Mantenimiento",

            value:
              reportsData?.machinesTotalNumber &&
              reportsData?.machinesTotalNumber[0].mantenimiento,
          },
          {
            name: "Detenidas",
            value:
              reportsData?.machinesTotalNumber &&
              reportsData?.machinesTotalNumber[0].detenida,
          },
        ]}
      />
      <Row className="d-flex m-3 w-100 justify-content-center align-items-center">
        <div
          className="d-flex m-3 w-100  align-items-center"
          style={{
            color: "#01516a",
            width: "100%",
            padding: ".75rem 1.25rem",
            marginBottom: 0,
            backgroundColor: "rgba(0,0,0,.08)",
            border: "none",
            height: "45px",
            background: "rgb(1, 81, 106)",
            color: "white",
            borderRadius: "10px 0 10px 0",
          }}
        >
          <h3
            style={{
              color: "white",
            }}
          >
            Fallas <ImWarning size={20} color="white" />
          </h3>
        </div>
      </Row>
      <NumberPanel
        title="Total de fallas en últimos períodos"
        isFirstOfSection
        elements={[
          {
            name: "Últimos 365 días",
            value:
              reportsData?.faultsNumbersByPeriod &&
              reportsData?.faultsNumbersByPeriod[0].año,
          },
          {
            name: "Últimos 30 días",

            value:
              reportsData?.faultsNumbersByPeriod &&
              reportsData?.faultsNumbersByPeriod[0].mes,
          },
          {
            name: "Últimos 7 días",
            value:
              reportsData?.faultsNumbersByPeriod &&
              reportsData?.faultsNumbersByPeriod[0].semana,
          },
        ]}
      />

      <NumberPanel
        title="Total de fallas actual"
        elements={[
          {
            value:
              reportsData?.faultsTotalNumber &&
              reportsData?.faultsTotalNumber[0].total,
          },
        ]}
      />
      <NumberPanel
        title="Total de fallas actual por estado"
        elements={[
          {
            name: "Pendientes",
            value:
              reportsData?.faultsTotalNumber &&
              reportsData?.faultsTotalNumber[0].Pendiente,
          },
          {
            name: "En Progreso",

            value:
              reportsData?.faultsTotalNumber &&
              reportsData?.faultsTotalNumber[0].EnProgreso,
          },
          {
            name: "Resueltas",
            value:
              reportsData?.faultsTotalNumber &&
              reportsData?.faultsTotalNumber[0].Resuelta,
          },
        ]}
      />
      <Row className="d-flex m-0 w-70 justify-content-center align-items-center">
        <div className="d-block ml-3 mr-3 mt-5">
          <h4 style={{ color: "#01516a" }}>Total de fallas por tipo</h4>
          <hr />
        </div>
      </Row>
      <Row className="d-flex m-0 h-100 w-100 justify-content-center align-items-center">
        <div className="dashboardCard h-100">
          <Pie data={dataPie()} />
        </div>
      </Row>
      <Row className="d-flex m-3 w-100 justify-content-center align-items-center">
        <div className="d-block ml-3 mr-3 mt-5">
          <h4 style={{ color: "#01516a" }}>
            Total de fallas por máquina - desde el comienzo
          </h4>
          <hr />
        </div>
      </Row>
      <Row
        className="d-flex m-3 w-100 justify-content-center dashboardCard align-items-center"
        style={{ height: "350px" }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={330}
            data={reportsData.faultsByMachine}
            // layout="vertical"
          >
            <XAxis dataKey="internal_name" />
            <Tooltip />
            <YAxis dataKey="faultCount" />
            <Bar dataKey="faultCount" fill="#961706" />
          </BarChart>
        </ResponsiveContainer>
      </Row>
      <Row className="d-flex m-3 w-70 justify-content-center align-items-center">
        <div className="d-block ml-3 mr-3 mt-5">
          <h4 style={{ color: "#01516a" }}>
            Total de fallas por mes - durante el año actual
          </h4>
          <hr />
        </div>
      </Row>
      <Row
        className="d-flex m-3 w-100 justify-content-center  dashboardCard align-items-center"
        style={{ height: "350px" }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={330}
            data={reportsData.faultsPerMonth}
            // layout="vertical"
          >
            <XAxis dataKey="month" />
            <Tooltip />
            <YAxis dataKey="faults" />
            <Bar dataKey="faults" fill="#068596" />
          </BarChart>
        </ResponsiveContainer>
      </Row>

      <Row className="d-flex m-3 w-70 justify-content-center align-items-center">
        <div className="d-block ml-3 mr-3 mt-5">
          <h4 style={{ color: "#01516a" }}>Fallas pendientes actuales</h4>
          <hr />
        </div>
      </Row>
      {
        <Row
          className="d-flex m-3 w-100 justify-content-center  dashboardCard align-items-center"
          style={{ height: "350px" }}
        >
          {reportsData.pendingFaults &&
            reportsData.pendingFaults.length > 0 && (
              <PendingFaults elements={reportsData.pendingFaults} />
            )}
          {!reportsData.pendingFaults ||
            (reportsData.pendingFaults.length === 0 && (
              <div className="font-weight-bold">
                No existen fallas pendientes. ¡Estás al día! &#128079;
              </div>
            ))}
        </Row>
      }
      <Row className="d-flex m-3 mt-5 w-100 justify-content-center align-items-center">
        <div
          className="d-flex w-100 align-items-center"
          style={{
            color: "#01516a",
            width: "100%",
            padding: ".75rem 1.25rem",
            marginBottom: 0,
            backgroundColor: "rgba(0,0,0,.08)",
            border: "none",
            height: "45px",
            background: "rgb(1, 81, 106)",
            color: "white",
            borderRadius: "10px 0 10px 0",
          }}
        >
          <h3
            style={{
              color: "white",
            }}
          >
            Tareas <BiTask size={25} color="white" />
          </h3>
        </div>
      </Row>
      <NumberPanel
        title="Total de tareas en últimos períodos"
        isFirstOfSection
        elements={[
          {
            name: "Últimos 365 días",
            value:
              reportsData?.tasksNumberByPeriod &&
              reportsData?.tasksNumberByPeriod[0].año,
          },
          {
            name: "Últimos 30 días",

            value:
              reportsData?.tasksNumberByPeriod &&
              reportsData?.tasksNumberByPeriod[0].mes,
          },
          {
            name: "Últimos 7 días",
            value:
              reportsData?.tasksNumberByPeriod &&
              reportsData?.tasksNumberByPeriod[0].semana,
          },
        ]}
      />

      <NumberPanel
        title="Total de tareas actual"
        elements={[
          {
            value:
              reportsData?.tasksTotalNumber &&
              reportsData?.tasksTotalNumber[0].Total,
          },
        ]}
      />
      <NumberPanel
        title="Total de tareas actual por estado"
        elements={[
          {
            name: "No Completadas",
            value:
              reportsData?.tasksTotalNumber &&
              reportsData?.tasksTotalNumber[0].NoCompletado,
          },
          {
            name: "Completadas",

            value:
              reportsData?.tasksTotalNumber &&
              reportsData?.tasksTotalNumber[0].Completado,
          },
        ]}
      />
      <Row className="d-flex m-3 w-100 justify-content-center align-items-center">
        <div className="d-block ml-3 mr-3 mt-5">
          <h4 style={{ color: "#01516a" }}>
            Tareas por mes - durante el año actual
          </h4>
          <hr />
        </div>
      </Row>
      <Row
        className="d-flex m-3 w-100 justify-content-center  dashboardCard align-items-center"
        style={{ height: "350px" }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={330}
            data={reportsData.tasksPerMonth}
            // layout="vertical"
          >
            <XAxis dataKey="month" />
            <Tooltip />
            <YAxis dataKey="tasks" />
            <Bar dataKey="tasks" fill="#003a4c" />
          </BarChart>
        </ResponsiveContainer>
      </Row>
      <Row className="d-flex m-3 w-100 justify-content-center align-items-center">
        <div className="d-block ml-3 mr-3 mt-5">
          <h4 style={{ color: "#01516a" }}>
            Cantidad total de tareas por máquina
          </h4>
          <hr />
        </div>
      </Row>
      <Row
        className="d-flex m-3 w-100 justify-content-center  dashboardCard align-items-center"
        style={{ height: "350px" }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={330}
            data={reportsData.tasksPerMachine}
            // layout="vertical"
          >
            <XAxis dataKey="internal_name" />
            <Tooltip />
            <YAxis dataKey="taskPerMachine" />
            <Bar dataKey="taskPerMachine" fill="rgb(150, 23, 6)" />
          </BarChart>
        </ResponsiveContainer>
      </Row>
    </Container>
  );
};

export default DashboardPage;
