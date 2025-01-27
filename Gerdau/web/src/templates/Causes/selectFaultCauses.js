import React, { useState, useEffect } from "react";
import { Container, Col, Form, Row } from "react-bootstrap";
import { ModalComponent } from "components/Modal/Modal";
import { Button } from "components/Button";
import "./styles.css";
import { useHistory } from "react-router-dom";

const renderCause = (cause, onChange, checked = false) => (
  <Col lg="6" sm="12" className="justify-content-center p-1">
    <div className="p-0 m-0">
      <label
        className="d-flex align-items-center p-2"
        style={{ background: " #E6E9EB", borderRadius: "4px" }}
      >
        <input
          className="myinput large mr-1 p-0"
          name="numberOfGuests"
          type="checkbox"
          value={checked}
          eventKey={cause}
          defaultChecked={checked}
          onChange={(e) => onChange(cause, e.target.checked)}
        />
        <a href={`/cause/detail/${cause.id}`}>{cause.name}</a>
      </label>
      {/* <input type="checkbox" name="check" eventKey={cause} defaultChecked={checked} onChange={(e) => onChange(cause, e.target.checked)} />
      <label for="check"> </label><br> */}
      {/* <Form.Check
        type='checkbox'
        label=""
        defaultChecked={checked}
        eventKey={cause}
        onChange={(e) => onChange(cause, e.target.checked)}
      /> */}
    </div>
  </Col>
);

export const SelectFaultCauses = ({
  causes,
  onConfirm,
  onCancel,
  initialCauses,
}) => {
  const history = useHistory();
  const [selectedCauses, setSelectedCauses] = useState([]);
  // const [selectedCauseIdsToDelete, setSelectedCauseIdsToDelete] = useState([]);
  const [_causes, set_Causes] = useState([]);

  useEffect(() => {
    causes.forEach((c) => {
      const checked =
        initialCauses.findIndex((cause) => cause.id === c.id) >= 0;
      if (checked) {
        c.checked = true;
        c.existsInDB = true;
      }
    });

    set_Causes(causes);
  }, [initialCauses, causes]);

  const handleChange = (selectedCause, value) => {
    const cleanSelectedCauses = [...selectedCauses];
    const foundCause = selectedCauses.find((c) => c.id === selectedCause.id);
    const existsInDB = foundCause?.existsInDB;
    if (foundCause && !existsInDB) {
      cleanSelectedCauses.splice(foundCause, 1);
    } else if (foundCause) {
      foundCause.checked = value;
    } else {
      selectedCause.checked = value;
      cleanSelectedCauses.push(selectedCause);
    }
    setSelectedCauses(cleanSelectedCauses);
    console.log(cleanSelectedCauses);
  };

  const handleCancel = () => {
    if (selectedCauses.length > 0) {
      if (window.confirm("Los datos se perderán. Desea continuar?")) {
        onCancel();
      }
    } else {
      onCancel();
    }
  };

  const handleNewCause = () => {
    if (selectedCauses.length > 0) {
      if (window.confirm("Los datos se perderán. Desea continuar?")) {
        history.push("/cause/new");
      }
    } else {
      history.push("/cause/new");
    }
  };

  const handleConfirm = () => {
    const causesToAdd = selectedCauses.filter(
      (c) => c.checked && !c.existsInDB
    );
    const causesToDelete = selectedCauses.filter(
      (c) => !c.checked && c.existsInDB
    );
    onConfirm({ causesToAdd, causesToDelete });
  };

  return (
    <>
      <ModalComponent
        title={"Seleccione las causas de la Falla"}
        show={true}
        onClose={() => handleCancel()}
        style={{ backgroundColor: "white" }}
        children={
          <Container fluid style={{ backgroundColor: "white" }}>
            <Row className="mt-2">
              <Col className="d-flex flex-row-reverse">
                <Button onClick={() => handleNewCause()}>
                  Registrar nueva causa
                </Button>
              </Col>
            </Row>
            <Row className="m-2">
              {_causes.map((c) => {
                console.log(c);
                return renderCause(c, handleChange, c.checked);
              })}
            </Row>
          </Container>
        }
        footer={
          <>
            <Button variant="outline-primary" onClick={() => handleConfirm()}>
              Confirmar
            </Button>
            <Button variant="outline-danger" onClick={() => handleCancel()}>
              Cancelar
            </Button>
          </>
        }
      />
    </>
  );
};
