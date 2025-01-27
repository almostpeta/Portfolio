import React from "react";
import "./detail.css";
import { Row, Col, Container } from "react-bootstrap";
import moment from "moment";
import { DetailBox } from "components/DetailBox";
import { useHistory } from "react-router-dom";
import { WarningAlert } from "components/UI/Alert";
import { ReportFaultBtn, EditBtn, DeleteBtn } from "components/UI/ActionBtn";
import { ResponsiveQRGenerator } from "components/UI/QRGenerator";
import useTranslate from "hooks/useTranslate";
import useUser from "hooks/useUser";

const DetailPage = ({ machine, onDelete }) => {
  const history = useHistory();
  const t = useTranslate();
  const { isAdmin, isAdminView, setIsAdminView } = useUser();

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
        text = "Fuera de uso";
        break;
    }
    return { background, color, state: text };
  };

  const handleEdit = () => {
    if (!isAdminView) {
      setIsAdminView(true);
    }
    history.push(`/admin/machine/edit/${machine.id}`);
  };

  const studyMessages = "study.detail";
  const selectMessage = (value) => t(studyMessages.concat("." + value));

  const getDetailValues = () => {
    return [
      {
        label: `${selectMessage("internal_name")}: `,
        value: machine?.internal_name,
      },
      {
        label: "Numero de Serie:",
        value: machine?.serie_number,
      },
      {
        label: "Numero de compra:",
        value: machine?.purchase_number,
      },
      {
        label: "Marca:",
        value: machine?.make,
      },
      {
        label: "Modelo:",
        value: machine?.model,
      },
      {
        label: "Fabricante:",
        value: machine?.manufacturer,
      },
      {
        label: "Responsable:",
        value: machine?.user?.name,
      },
      {
        label: "Tipo de Máquina:",
        value: machine?.type,
      },
      {
        label: "Etapas de Proceso:",
        value: machine?.stages?.map((s) => s.name).join(", "),
      },
      {
        label: `${selectMessage("user")}: `,
        value: selectState(machine.state).state,
        variant: "state",
        color: selectState(machine.state).color,
        background: selectState(machine.state).background,
      },
    ];
  };

  const getLocationValues = () => {
    return [
      {
        label: "Planta",
        value: machine?.plant?.name,
      },
      {
        label: "Área:",
        value: machine?.area?.name,
      },
      {
        label: "Subnivel:",
        value: machine?.sublevel?.name,
      },
    ];
  };

  const getDescriptionValues = () => {
    return [
      {
        value: machine?.description,
      },
    ];
  };
  const getRelevantDataValues = () => {
    return [
      {
        value: machine?.relevant_data,
      },
    ];
  };

  const getElectricFaultsValues = () => {
    return [
      {
        variant: "number",
        value: machine.electric_faults_count || 0,
      },
    ];
  };

  const getNeumaticFaultsValues = () => {
    return [
      {
        variant: "number",
        value: machine.neumatic_faults_count || 0,
      },
    ];
  };
  const getHydraulicFaultsValues = () => {
    return [
      {
        variant: "number",
        value: machine.hydraulic_faults_count || 0,
      },
    ];
  };

  const getMechanicFaultsValues = () => {
    return [
      {
        variant: "number",
        value: machine.mechanic_faults_count || 0,
      },
    ];
  };

  const getKeyDatesValues = () => {
    return [
      {
        label: "Fecha de Colocación:",
        value: moment(machine?.working_from_date).format("L"),
      },
    ];
  };
  return (
    <Container fluid>
      <Row className="mt-3">
        <Col
          style={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          {isAdmin && (
            <>
              <div className="mr-2">
                <EditBtn handleClick={() => handleEdit()} title="Editar" />
              </div>
              <div>
                <DeleteBtn handleClick={() => onDelete()} title="Eliminar" />
              </div>
            </>
          )}
        </Col>
      </Row>
      <Row style={{ alignItems: "start" }}>
        <Col lg="8" md="7">
          <DetailBox
            title={selectMessage("detail_title")}
            children={getDetailValues()}
          />
        </Col>
        <Col md="4">
          <ResponsiveQRGenerator value={window.location.href} />
          <DetailBox title={"Ubicación"} children={getLocationValues()} />
        </Col>
      </Row>

      <Row>
        <Col sm="12">
          <DetailBox title={"Descripción"} children={getDescriptionValues()} />
        </Col>
      </Row>
      <Row>
        <Col sm="12">
          <DetailBox
            title={"Datos Relevantes"}
            children={getRelevantDataValues()}
          />
        </Col>
      </Row>
      <Row>
        <Col lg="4" sm="6">
          <DetailBox
            title={"Fallas eléctricas"}
            children={getElectricFaultsValues()}
          />
        </Col>
        <Col lg="4" sm="6">
          <DetailBox
            title={"Fallas neumáticas"}
            children={getNeumaticFaultsValues()}
          />
        </Col>
      </Row>

      <Row>
        <Col lg="4" sm="6">
          <DetailBox
            title={"Fallas hidráulicas"}
            children={getHydraulicFaultsValues()}
          />
        </Col>
        <Col lg="4" sm="6">
          <DetailBox
            title={"Fallas mecánicas"}
            children={getMechanicFaultsValues()}
          />
        </Col>
      </Row>
      <Row>
        <Col lg="12">
          <DetailBox
            title={"Fechas Importantes"}
            children={getKeyDatesValues()}
          />
        </Col>
      </Row>
      {machine && Object.keys(machine).length === 0 && (
        <Row style={{ margin: "10px" }}>
          <WarningAlert title={"No se encontraron datos de la máquina."} />
        </Row>
      )}
    </Container>
  );
};

export default DetailPage;
