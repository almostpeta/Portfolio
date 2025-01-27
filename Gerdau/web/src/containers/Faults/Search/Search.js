import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Form, Container, Row } from "react-bootstrap";
import { getFaultsByCauses } from "service/fault";
import { BackBtn, NextBtn } from "components/UI/ActionBtn";
import RecordDetailModal from "components/UI/RecordDetailModal";
import { WarningAlert } from "components/UI/Alert";
import CauseItem from "components/UI/CauseItem";
import FaultItem from "components/UI/FaultItem";
// import Step1 from "./Steps/Step1";

const Title = ({ label, variant = "title" }) => (
  <Row className="d-block mt-5 ml-0 mr-0">
    {variant === "title" ? (
      <>
        <h2 style={{ color: "#01516a" }}>{label}</h2>
        <hr />
      </>
    ) : (
      <h4 style={{ color: "#01516a" }}>{label}</h4>
    )}
  </Row>
);

const Search = ({ allCauses, setIsLoading }) => {
  const history = useHistory();
  const [causes, setCauses] = useState(allCauses);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [selectedCauses, setSelectedCauses] = useState([]);
  const [foundFaults, setFoundFaults] = useState(null);
  const [step, setStep] = useState(0);

  const handleSelectClick = (cause) => {
    const cleanSelectedCauses = [...selectedCauses];

    let index = cleanSelectedCauses.findIndex(
      (s) => s.id.toString() === cause.id.toString()
    );
    if (index !== -1) {
      cleanSelectedCauses.splice(index, 1);
      cause.isSelected = false;
    } else {
      cause.isSelected = true;
      cleanSelectedCauses.push(cause);
    }
    setSelectedCauses(cleanSelectedCauses);
  };

  const filterCauses = (name) => {
    const cleanCauses = [...allCauses];
    if (name) {
      const filtered = cleanCauses.filter((c) =>
        c.name.toLowerCase().includes(name.toLowerCase())
      );
      setCauses(filtered);
    } else {
      setCauses(allCauses);
    }
  };

  const handleInputChange = (e) => {
    filterCauses(e.target.value);
  };

  const handleNextClick = async () => {
    try {
      setIsLoading(true);
      const causeIds = selectedCauses.map((c) => c.id);
      const retrievedFaults = await getFaultsByCauses(causeIds);

      setFoundFaults(retrievedFaults);
      setStep(1);
    } catch (e) {
      setFoundFaults([]);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRedirectToDetailClick = (fault) => {
    history.push(`/fault/detail/${fault.id}`);
  };

  const handleRecordClick = (record, type) => {
    record.type = type;
    setCurrentRecord(record);
  };

  return (
    <Container>
      <Title label="Buscar Falla por Causas" />
      {step === 0 && (
        <>
          <Title label="Seleccione las causas" variant="subtitle" />
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              return false;
            }}
          >
            <Form.Group controlId="formBasicEmail">
              <Form.Control
                onChange={handleInputChange}
                type="text"
                placeholder="Ingrese el nombre de una causa"
              />
              <Form.Text className="text-muted">
                Filtrar causas por nombre
              </Form.Text>
            </Form.Group>
          </Form>
          <div style={{ maxHeight: "60vh", overflowY: "scroll" }}>
            {causes.map((cause) => (
              <CauseItem
                key={cause.id}
                cause={cause}
                onDetailClick={(c) => handleRecordClick(c, "cause")}
                onSelectClick={(c) => handleSelectClick(c)}
              />
            ))}
          </div>
          <div className="mt-2" style={{ float: "right" }}>
            <NextBtn title="Siguiente" handleClick={() => handleNextClick()} />
          </div>
        </>
      )}
      {step === 1 && (
        <>
          <Title
            label="Fallas encontradas en base a las Causas"
            variant="subtitle"
          />
          <div style={{ maxHeight: "60vh", overflowY: "scroll" }}>
            {foundFaults.length > 0 &&
              foundFaults.map((f) => (
                <FaultItem
                  fault={f}
                  onDetailClick={(fault) => handleRecordClick(fault, "fault")}
                />
              ))}
          </div>
          {foundFaults.length === 0 && (
            <Row>
              <WarningAlert title="No se han encontrado fallas para las causas seleccionadas" />
            </Row>
          )}
          <div className="mt-2" style={{ float: "right" }}>
            <BackBtn title="Volver" handleClick={() => setStep(0)} />
          </div>
        </>
      )}

      {currentRecord && (
        <RecordDetailModal
          title={currentRecord.type === "fault" ? "Falla" : "Causa"}
          valuesByKey={{
            component: {
              title: "Componente",
              value: currentRecord.component?.internal_name,
            },
            piece: {
              title: "Pieza",
              value: currentRecord.piece?.internal_name,
            },
            clasification: {
              title: "Clasificación",
              value: currentRecord.clasification,
            },
            description: {
              title: "Descripción",
              value: currentRecord.description,
            },
            relevant_data: {
              title: "Datos Relevantes",
              value: currentRecord.relevant_data,
            },
          }}
          onClose={() => setCurrentRecord(null)}
          onClickDetail={() =>
            history.push(`/${currentRecord.type}/detail/${currentRecord?.id}`)
          }
        />
      )}
    </Container>
  );
};

export default Search;
