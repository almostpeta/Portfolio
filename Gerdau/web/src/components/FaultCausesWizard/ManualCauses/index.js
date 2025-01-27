import React, { useEffect, useState } from "react";
import { getApprovedOrRequestedCauses } from "service/cause";
import { ModalComponent } from "components/Modal";
import { StdButton } from "components/UI/ActionBtn";
import { relateCausesToFault } from "service/fault";
import { Toast } from "components/Toast";
import CauseDetailModal from "components/UI/CauseDetailModal";
import ManualCausesModal from "./ManualCauses";
import SolutionDetailModal from "components/UI/SolutionDetailModal";
import SolutionsScreen from "components/FaultCausesWizard/SolutionsScreen";
import { WarningAlert } from "components/UI/Alert";

const ManualCauses = ({
  createdCause,
  faultId,
  faultCauses,
  onClose,
  onCreateNewCause,
}) => {
  const [causes, setCauses] = useState([]);
  const [step, setStep] = useState(1);
  const [currentCause, setCurrentCause] = useState(null);
  const [currentSolution, setCurrentSolution] = useState(null);
  const [selectedCauses, setSelectedCauses] = useState([]);
  const [solutions, setSolutions] = useState([]);

  useEffect(() => {
    fetchAllCauses();
  }, []);

  const fetchAllCauses = async () => {
    try {
      const retrievedCauses = await getApprovedOrRequestedCauses();
      retrievedCauses.forEach((c) => {
        const foundCause = faultCauses.find((cause) => cause.id === c.id);
        if (foundCause) {
          c.isSelected = true;
          c.existsInDB = true;
        }
      });

      // move the created cause at the beginning
      if (createdCause) {
        const createdCauseIndex = retrievedCauses.findIndex(
          (c) => c.id === createdCause.id
        );
        retrievedCauses.splice(createdCauseIndex, 1);
        retrievedCauses.unshift(createdCause);
      }

      setCauses(retrievedCauses);
    } catch (e) {
      setCauses([]);
    }
  };

  const handleSelectClick = (cause) => {
    const cleanSelectedCauses = [...selectedCauses];
    const foundCause = selectedCauses.find((c) => c.id === cause.id);
    const existsInDB = foundCause?.existsInDB;
    if (foundCause && !existsInDB) {
      cleanSelectedCauses.splice(foundCause, 1);
    } else if (foundCause) {
      foundCause.isSelected = !cause.isSelected;
    } else {
      cause.isSelected = !cause.isSelected;
      cleanSelectedCauses.push(cause);
    }
    setSelectedCauses(cleanSelectedCauses);
  };

  const handleSubmit = async () => {
    try {
      const causesToAdd = selectedCauses.filter(
        (c) => c.isSelected && !c.existsInDB
      );
      const causesToDelete = selectedCauses.filter(
        (c) => !c.isSelected && c.existsInDB
      );

      const retrivedSolutions = await relateCausesToFault(faultId, {
        causesToAdd,
        causesToDelete,
      });
      setSolutions(retrivedSolutions);
      Toast("success", "Se han relacionado las causas");
      setStep(2);
    } catch (e) {
      Toast("error", "No se han podido relacionar las causas");
    }
  };

  const handleCancel = () => {
    if (window.confirm("Se perderán los datos al cancelar")) {
      onClose();
    }
  };

  return (
    <>
      {step === 1 && (
        <ModalComponent
          onClose={() => onClose()}
          show={true}
          title="Asociar Causas Manualmente"
          children={
            <>
              <div className="col-11" style={{ textAlign: "center" }}>
                Seleccione las causas que considere pertinentes
              </div>
              <ManualCausesModal
                causes={causes}
                onDetailClick={(cause) => setCurrentCause(cause)}
                onSelectClick={(cause) => handleSelectClick(cause)}
              />
            </>
          }
          footer={
            <>
              <div style={{ float: "right" }}>
                <StdButton title="Cancelar" handleClick={handleCancel} />
              </div>
              <div style={{ float: "right" }}>
                <StdButton title="Nueva Causa" handleClick={onCreateNewCause} />
              </div>
              <div style={{ float: "right" }}>
                <StdButton
                  title="Finalizar"
                  handleClick={() => handleSubmit()}
                />
              </div>
            </>
          }
        />
      )}
      {step === 2 && (
        <ModalComponent
          show={true}
          onClose={() => onClose(true)}
          title="Soluciones Encontradas"
          children={
            <>
              <div className="col-11" style={{ textAlign: "center" }}>
                Soluciones encontradas en base a las causas seleccionadas
              </div>
              {solutions.length > 0 && (
                <SolutionsScreen
                  solutions={solutions}
                  onDetailClick={(solution) => setCurrentSolution(solution)}
                />
              )}
              {solutions.length === 0 && (
                <div className="p-2">
                  <WarningAlert title="No se han encontrado soluciones relacionadas a las causas" />
                </div>
              )}
            </>
          }
          footer={
            <div style={{ float: "right" }}>
              <StdButton title="Cerrar" handleClick={() => onClose(true)} />
            </div>
          }
        />
      )}
      {currentSolution && (
        <SolutionDetailModal
          solution={currentSolution}
          onClose={() => setCurrentSolution(null)}
        />
      )}
      {currentCause && (
        <CauseDetailModal
          cause={currentCause}
          onClose={() => setCurrentCause(null)}
        />
      )}
    </>
  );
};

export default ManualCauses;
