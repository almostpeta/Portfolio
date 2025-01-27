import React from "react";
import "../../machines/Detail/detail.css";
import { useHistory } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import moment from "moment";
import useTranslate from "hooks/useTranslate";
import { DetailBox } from "components/DetailBox";
import { FilesRelatedList } from "templates/Files";
import { ResponsiveQRGenerator } from "components/UI/QRGenerator";
import { DeleteBtn, EditBtn } from "components/UI/ActionBtn";
import useUser from "hooks/useUser";

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

const getDetailValues = (component, selectMessage) => [
  {
    label: `${selectMessage("internal_name")}: `,
    value: component.internal_name,
  },
  {
    label: `${selectMessage("serie_number")}: `,
    value: component.serie_number,
  },
  {
    label: `${selectMessage("purchase_number")}: `,
    value: component.purchase_number,
  },
  {
    label: `${selectMessage("machine")}: `,
    value: component.machine?.internal_name,
    variant: "link",
    href: `/machine/detail/${component.machine?.id}`,
  },
  {
    label: `${selectMessage("model")}: `,
    value: component.model,
  },
  {
    label: `${selectMessage("make")}: `,
    value: component.make,
  },
  {
    label: `${selectMessage("user")}: `,
    value: component.user?.name,
  },
  {
    label: `${selectMessage("manufacturer")}: `,
    value: component.manufacturer,
  },
  {
    label: `${selectMessage("maintenance_responsible")}: `,
    value: component.maintenance_responsible?.name,
  },
  {
    label: `${selectMessage("provider")}: `,
    value: component.provider,
  },
  {
    label: `${selectMessage("type")}: `,
    value: component.type,
  },
  {
    label: `${selectMessage("state")}: `,
    value: selectState(component.state).state,
    variant: "state",
    color: selectState(component.state).color,
    background: selectState(component.state).background,
  },
];

const getDescriptionValues = (component, selectMessage) => [
  {
    label: `${selectMessage("description")}: `,
    value: component.description,
  },
];

const getRelevantDataValues = (component, selectMessage) => [
  {
    label: `${selectMessage("relevant_data")}: `,
    value: component.relevant_data,
  },
];

const getRelevantDateValues = (component, selectMessage) => [
  {
    label: `${selectMessage("working_from_date")}: `,
    value:
      component.working_from_date &&
      moment(component.working_from_date).format("MMMM Do YYYY"),
  },
];

const DetailPage = ({ component, onDelete }) => {
  const history = useHistory();
  const t = useTranslate();
  const { isAdmin, isAdminView, setIsAdminView } = useUser();

  const componentMessages = "components.detail";
  const selectMessage = (value) => t(componentMessages.concat("." + value));

  const handleEditClick = () => {
    if (!isAdminView) {
      setIsAdminView(true);
    }
    history.push(`/admin/machine/edit/${component.machineId}`, {
      variant: "component",
      recordId: component.id,
    });
  };

  return (
    <Container fluid>
      <Row
        className="d-flex justify-content-end"
        style={{ marginTop: "40px", display: "flex", justifyItems: "end" }}
      >
        {isAdmin && (
          <>
            <div className="mr-2">
              <EditBtn
                handleClick={() => handleEditClick()}
                title={selectMessage("edit_btn")}
              />
            </div>
            <DeleteBtn
              handleClick={() => onDelete()}
              title={selectMessage("delete_btn")}
            />
          </>
        )}
      </Row>
      <Row>
        <Col lg="9">
          <DetailBox
            title={selectMessage("detail_title")}
            children={getDetailValues(component, selectMessage)}
          />
        </Col>
        <Col sm="3">
          <ResponsiveQRGenerator
            clazz="col-12 offset-2 pt-4"
            value={window.location.href}
          />
        </Col>
      </Row>
      <Row>
        <DetailBox
          title={selectMessage("description")}
          children={getDescriptionValues(component, selectMessage)}
        />
      </Row>
      <Row>
        <DetailBox
          title={selectMessage("relevant_data")}
          children={getRelevantDataValues(component, selectMessage)}
        />
      </Row>
      <Row>
        <DetailBox
          title={selectMessage("relevant_dates_title")}
          children={getRelevantDateValues(component, selectMessage)}
        />
      </Row>
      <Row>
        <Col xs={6} md={3} className="p-0">
          <DetailBox
            title={selectMessage("electric_faults")}
            children={[
              {
                variant: "number",
                value: component.electric_faults_count ?? "0",
              },
            ]}
          />
        </Col>
        <Col xs={6} md={3}>
          <DetailBox
            title={selectMessage("neumatic_faults")}
            children={[
              {
                variant: "number",
                value: component.neumatic_faults_count ?? "0",
              },
            ]}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={6} md={3} className="p-0">
          <DetailBox
            title={selectMessage("hydraulic_faults")}
            children={[
              {
                variant: "number",
                value: component.hydraulic_faults_count || "0",
              },
            ]}
          />
        </Col>
        <Col xs={6} md={3}>
          <DetailBox
            title={selectMessage("mechanic_faults")}
            children={[
              {
                variant: "number",
                value: component.mechanic_faults_count || "0",
              },
            ]}
          />
        </Col>
      </Row>

      {component && Object.keys(component).length === 0 && (
        <div>No Se encontraron datos del componente.</div>
      )}
      <div>
        {component && (
          <FilesRelatedList files={component.files} variant="components" />
        )}
      </div>
    </Container>
  );
};

export default DetailPage;
