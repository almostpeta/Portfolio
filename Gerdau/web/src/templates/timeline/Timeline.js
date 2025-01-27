import React, { useEffect, useState } from "react";
import "./timeline.css";
import { DetailBox } from "components/DetailBox";
import { useHistory } from "react-router-dom";
import { Form, Row, Col, Container } from "react-bootstrap";
import { Button } from "components/Button";
import Box from "components/UI/Box";
import { WarningAlert } from "components/UI/Alert";
import { EditBtn } from "components/UI/ActionBtn";
import useForm from "hooks/useForm";
import { createEvent } from "lib/eventUtils";
import { DateTimePicker, DateControl } from "components/UI/DatePicker";
import Schema from "./Schema";
import { Timeline } from "components/Timeline/index";
import { ModalComponent } from "components/Modal/Modal";
import useTranslate from "hooks/useTranslate";
import useUser from "hooks/useUser";
import { getFaultDetailValues } from "./faultDetail";
import { ListInput } from "components/UI/ListInput";
import { getTaskDetailValues } from "./taskDetail";
import { GenericCollapse } from "components/Collapse/index";

const TimelinePage = ({ variant, elements, initialValues, onSubmit }) => {
  const history = useHistory();
  const t = useTranslate();
  const { isAdmin } = useUser();
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState(elements);
  const [selectedEventData, setSelectedEventData] = useState(null);

  useEffect(() => {
    elements && setEvents(elements);
  }, [elements]);

  const handleEdit = () => {
    const resource = selectedEventData.eventType;
    history.push(`/${resource}/edit/${selectedEvent}`);
  };

  const onCloseDetailModal = () => {
    setShowDetailModal(false);
  };

  const findEventData = (index) => {
    return events[index];
  };

  const handleDetail = () => {
    const resource = selectedEventData.eventType;
    history.push(`/${resource}/detail/${selectedEvent}`);
  };

  const onSelectEvent = (index, id) => {
    setSelectedEvent(id);
    const eventData = findEventData(index);
    setSelectedEventData(eventData);
    setShowDetailModal(true);
  };

  const faultsMessages = "faults.detail";
  const selectFaultMessages = (value) => t(faultsMessages.concat("." + value));

  const taskMessages = "containers.tasks.detail";
  const selectTaskMessages = (value) => t(taskMessages.concat("." + value));

  const {
    handleBlur,
    handleInputChange,
    handleSubmit,
    resetForm,
    errors,
    inputs,
    touched,
  } = useForm(Schema, initialValues, onSubmit);

  const SORT_OPTIONS = [
    { value: "desc", label: "Descendente" },
    { value: "asc", label: "Ascendente" },
  ];

  const EVENT_TYPE = [
    { value: "fault", label: "Fallas" },
    { value: "task", label: "Tareas" },
    { value: "all", label: "Todos" },
  ];

  const getFormData = () => (
    <Form className="mt-3" onSubmit={handleSubmit}>
      <Row className="justify-content-between mb-2">
        <Col lg="6">
          <DateControl
            name="startDate"
            label={"Desde"}
            value={inputs.startDate}
            placeholder={"Fecha Inicial"}
            initialValue={inputs.startDate}
            onChange={(v) => createEvent("startDate", v, handleInputChange)}
            isInvalid={!!errors.startDate && touched.startDate}
            errorText={"Fecha Inicial inválida"}
          />
        </Col>
        <Col lg="6">
          <DateControl
            name="endDate"
            label={"Hasta"}
            placeholder={"Fecha Final"}
            initialValue={inputs.endDate}
            value={inputs.endDate}
            onChange={(v) => createEvent("endDate", v, handleInputChange)}
            isInvalid={!!errors.endDate && touched.endDate}
            errorText={"Fecha Final inválida"}
          />
        </Col>
      </Row>
      <Row className="justify-content-between mb-2">
        <Col lg="6">
          <ListInput
            label={"Orden"}
            placeholder={"Seleccionar Orden"}
            controlId="order"
            value={inputs.order}
            onBlur={handleBlur}
            onChange={handleInputChange}
            isInvalid={!!errors.order && touched.order}
            errorText={"Orden de eventos inválido"}
          >
            <option value="" hidden>
              {"Seleccionar Orden"}
            </option>
            {SORT_OPTIONS.map((option, i) => (
              <option key={i} value={option.value}>
                {option.label}
              </option>
            ))}
          </ListInput>
        </Col>
        <Col lg="6">
          <ListInput
            label={"Tipo de Evento"}
            placeholder={"Seleccionar Tipo de Evento"}
            controlId="type"
            value={inputs.type}
            onBlur={handleBlur}
            onChange={handleInputChange}
            isInvalid={!!errors.type && touched.type}
            errorText={"Tipo de evento inválido"}
          >
            <option value="" hidden>
              {"Seleccionar Tipo de Evento"}
            </option>
            {EVENT_TYPE.map((type, i) => (
              <option key={i} value={type.value}>
                {type.label}
              </option>
            ))}
          </ListInput>
        </Col>
      </Row>

      <Row className="justify-content-end mb-5">
        <Button
          variant="outline-primary"
          onClick={() => resetForm()}
          type="button"
          className="center mr-2"
        >
          Reiniciar Filtros
        </Button>
        <Button variant="primary" type="submit" className="center" size="lg">
          Filtrar
        </Button>
      </Row>
    </Form>
  );

  return (
    <Container fluid>
      <Row className="mt-4">
        <GenericCollapse
          childrens={getFormData()}
          headerPlaceholder={"Ingresar nombre interno del Componente"}
          defaultTitle={"Filtros"}
          titleProp={"internal_name"}
        />
      </Row>

      {elements.length > 0 && (
        <Row>
          <Box title={"Línea de tiempo de la máquina"}>
            <div className="customTimeline">
              <Timeline onSelectEvent={onSelectEvent} elements={events} />
            </div>
          </Box>
          {showDetailModal && (
            <ModalComponent
              onClose={onCloseDetailModal}
              show={showDetailModal}
              title={selectedEventData?.name}
              // style={{ backgroundColor: "white" }}
              children={
                <div>
                  <Row
                    className="d-flex justify-content-end"
                    style={{
                      position: "relative",
                      maxWidth: "100%",
                    }}
                  >
                    <EditBtn handleClick={handleEdit} title={"editar"} />
                    <div className="d-flex justify-content-end mb-3 ml-1 mr-1">
                      <Button onClick={() => handleDetail()}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          Resumen
                        </div>
                      </Button>
                    </div>
                  </Row>
                  <Row className="m-2">
                    <DetailBox
                      title={"Detalles"}
                      style={{
                        position: "relative",
                        maxWidth: "100%",
                      }}
                      children={
                        selectedEventData.eventType === "fault"
                          ? getFaultDetailValues(
                              selectFaultMessages,
                              selectedEventData
                            )
                          : getTaskDetailValues(
                              selectTaskMessages,
                              selectedEventData
                            )
                      }
                    />
                  </Row>
                </div>
              }
            ></ModalComponent>
          )}
        </Row>
      )}

      {elements.length === 0 && (
        <Row style={{ margin: "10px" }}>
          <WarningAlert title={"No se encontraron eventos."} />
        </Row>
      )}
    </Container>
  );
};

export default TimelinePage;
