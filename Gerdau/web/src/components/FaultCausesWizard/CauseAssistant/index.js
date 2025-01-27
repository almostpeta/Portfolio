import React, { useEffect, useState } from "react";
import {
  getSuggestedCauses,
  associateCausesFromAssistant,
} from "service/fault";
import { getSimilarCauses } from "service/cause";
import { ModalComponent } from "components/Modal";
import AssistantModal from "./AssistantModal";
import SecondStep from "./SecondStep";
import CauseDetailModal from "components/UI/CauseDetailModal";
import SolutionDetailModal from "components/UI/SolutionDetailModal";
import SolutionsScreen from "components/FaultCausesWizard/SolutionsScreen";
import { NextBtn, BackBtn, StdButton } from "components/UI/ActionBtn";
import { Toast } from "components/Toast";
import SelectedCausesList from "./selectedCausesList";
import { Loading } from "components/Loading/index";
import { Title } from "./Title";
import { WarningAlert } from "components/UI/Alert";

const CauseAssistant = ({
  fault,
  faultId,
  faultCauses,
  onClose,
  onAssignSolutions,
}) => {
  const [suggestedCauses, setSuggestedCauses] = useState(null);
  const [secondStepSelectedCauses, setSecondStepSelectedCauses] = useState([]);
  const [firstStepSelectedCauses, setFirstStepSelectedCauses] = useState([]);
  const [currentCause, setCurrentCause] = useState(null);
  const [similarCauses, setSimilarCauses] = useState([]);
  const [step, setStep] = useState(0);
  const [solutions, setSolutions] = useState(null);
  const [currentSolution, setCurrentSolution] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleClickSecondStep = (cause, step = 1) => {
    const selectedCauses = [...secondStepSelectedCauses];
    let index = selectedCauses.findIndex(
      (s) => s.id.toString() === cause.id.toString()
    );
    cause.step = step;
    if (index !== -1) {
      selectedCauses.splice(index, 1);
      cause.isSelected = false;
    } else {
      cause.isSelected = true;
      selectedCauses.push(cause);
    }
    setSecondStepSelectedCauses(selectedCauses);
  };

  const handleClickFirstStep = (cause, step = 0) => {
    const selectedCauses = [...firstStepSelectedCauses];
    let index = selectedCauses.findIndex(
      (s) => s.id.toString() === cause.id.toString()
    );
    cause.step = step;
    if (index !== -1) {
      selectedCauses.splice(index, 1);
      cause.isSelected = false;
    } else {
      cause.isSelected = true;
      selectedCauses.push(cause);
    }
    setFirstStepSelectedCauses(selectedCauses);
  };

  const setSelected = (list) => {
    return (
      list &&
      list.map((c) => {
        c.isSelected = false;
        return c;
      })
    );
  };

  useEffect(() => {
    fetchCauses(faultId);
  }, [faultId]);

  const handleFirstStep = async () => {
    if (firstStepSelectedCauses && firstStepSelectedCauses.length > 0) {
      setStep(1);
      let receivedSimilarCauses = await getSimilarCauses(
        firstStepSelectedCauses &&
          firstStepSelectedCauses.map((cause) => cause.id)
      );
      setSimilarCauses(receivedSimilarCauses);
    } else {
      Toast("error", "Debes seleccionar al menos una causa");
    }
  };

  const handleStepBackFromSecondStep = () => {
    secondStepSelectedCauses.map((cause) => (cause.isSelected = false));
    setStep(0);
    setSecondStepSelectedCauses([]);
  };

  const fetchCauses = async (faultId) => {
    try {
      setIsLoading(true);
      let causes = await getSuggestedCauses(faultId);
      if (causes.relatedToPiece) {
        causes.relatedToPiece = setSelected(causes.relatedToPiece);
      }
      causes.relatedToComponent = setSelected(causes.relatedToComponent);
      causes.mostUsed = setSelected(causes.mostUsed);
      //toDo: Add other casuses besides suggested causes in initial cause list
      setSuggestedCauses(causes);
    } catch (e) {
      console.error(e);
      setSuggestedCauses([]);
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const relateCauses = async () => {
    try {
      setIsLoading(true);
      const allCauses = [
        ...firstStepSelectedCauses,
        ...secondStepSelectedCauses,
      ];
      const relatedSolutions = await associateCausesFromAssistant(
        faultId,
        allCauses.map((cause) => cause.id)
      );
      setSolutions(relatedSolutions);
      Toast("success", "Se han relacionado las causas");
      setStep(3);
    } catch (e) {
      setSolutions([]);
      setError(e.message);
      Toast("error", "No se pudieron relacionar correctamente");
    } finally {
      setIsLoading(false);
      onClose(true);
    }
  };

  return (
    <>
      {isLoading && <Loading />}
      {suggestedCauses && step === 0 && (
        <ModalComponent
          show={true}
          onClose={() => onClose()}
          title="Asistente de Causas"
          children={
            <>
              {!error && (
                <>
                  <Title> Paso 1- Selección de causas sugeridas</Title>
                  {faultCauses.length > 0 && (
                    <div className="p-2">
                      <WarningAlert
                        title={
                          "Parece que ya asociaste causas a esta falla. Por favor, recuerda que al usar el asistente de causas, las causas previamente asociadas se sobreescribirán."
                        }
                      />
                    </div>
                  )}
                  <AssistantModal
                    fault={fault}
                    relatedToPiece={suggestedCauses.relatedToPiece}
                    relatedToComponent={suggestedCauses.relatedToComponent}
                    mostUsed={suggestedCauses.mostUsed}
                    onSelectClick={(cause) => handleClickFirstStep(cause)}
                    onDetailClick={(cause) => setCurrentCause(cause)}
                  />
                </>
              )}
              {error && <div>{error}</div>}
            </>
          }
          footer={
            <>
              <div style={{ float: "right" }}>
                <StdButton title="Cancelar" handleClick={() => onClose()} />
              </div>
              {!error && (
                <div style={{ float: "right" }}>
                  <NextBtn
                    title="Siguiente"
                    handleClick={() => handleFirstStep()}
                  />
                </div>
              )}
            </>
          }
        />
      )}
      {similarCauses && step === 1 && (
        <ModalComponent
          show={true}
          onClose={() => onClose()}
          title="Asistente de Causas"
          children={
            <>
              {!error && (
                <>
                  <Title> Paso 2- Selección de causas similares</Title>
                  {similarCauses.similarCauses?.length === 0 &&
                    similarCauses.restOfCauses?.length > 0 &&
                    firstStepSelectedCauses && (
                      <div className="p-2">
                        <WarningAlert
                          title={
                            "Parece que la causas que seleccionaste aún no fueron asociadas a otras fallas. Por favor, vuelve al paso anterior para que podamos buscar causas que puedan coincidir con tú selección, o selecciona las que consideres pertinente del siguiente listado."
                          }
                        />
                      </div>
                    )}
                  {similarCauses.restOfCauses?.length === 0 &&
                    similarCauses.similarCauses?.length === 0 &&
                    firstStepSelectedCauses && (
                      <div className="p-2">
                        <WarningAlert
                          title={
                            "Parece que la causas que seleccionaste aún no fueron asociadas a otras fallas. Por favor, vuelve al paso anterior para que podamos buscar causas que puedan coincidir con tú selección, o haz clic en siguiente para avanzar al último paso."
                          }
                        />
                      </div>
                    )}

                  {
                    <SelectedCausesList
                      title={"Causas seleccionadas del Paso 1:"}
                      causes={firstStepSelectedCauses}
                    />
                  }
                  <SecondStep
                    similarCauses={similarCauses}
                    onDetailClick={(cause) => setCurrentCause(cause)}
                    onSelectClick={(cause) => handleClickSecondStep(cause)}
                  />
                </>
              )}
              {error && <div>{error}</div>}
            </>
          }
          footer={
            <>
              <div style={{ float: "right" }}>
                <StdButton title="Cancelar" handleClick={() => onClose()} />
              </div>
              <div style={{ float: "right" }}>
                <BackBtn
                  title="Volver"
                  handleClick={() => handleStepBackFromSecondStep()}
                />
              </div>
              {!error && (
                <div style={{ float: "right" }}>
                  <NextBtn title="Siguiente" handleClick={() => setStep(2)} />
                </div>
              )}
            </>
          }
        />
      )}

      {step === 2 && (
        <ModalComponent
          show={true}
          onClose={() => onClose()}
          title="Asistente de Causas"
          children={
            <>
              {!error && (
                <>
                  <Title> Resumen de causas seleccionadas</Title>
                  {
                    <SelectedCausesList
                      title={
                        "Causas seleccionadas del Paso 1 (Selección de causas sugeridas): "
                      }
                      causes={firstStepSelectedCauses}
                    />
                  }

                  <SelectedCausesList
                    title={
                      "Causas seleccionadas del Paso 2 (Selección de causas similares):"
                    }
                    causes={secondStepSelectedCauses}
                  />
                </>
              )}
              {error && <div>{error}</div>}
            </>
          }
          footer={
            <>
              <div style={{ float: "right" }}>
                <StdButton title="Cancelar" handleClick={() => onClose()} />
              </div>
              <div style={{ float: "right" }}>
                <BackBtn title="Volver" handleClick={() => setStep(1)} />
              </div>
              {!error && (
                <div style={{ float: "right" }}>
                  <NextBtn
                    title="Finalizar"
                    handleClick={() => relateCauses()}
                  />
                </div>
              )}
            </>
          }
        />
      )}
      {solutions && step === 3 && (
        <ModalComponent
          show={true}
          onClose={() => onClose(true)}
          title="Soluciones Encontradas"
          children={
            <>
              {!error && (
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
              )}
              {error && <div>{error}</div>}
            </>
          }
          footer={
            <>
              <div style={{ float: "right" }}>
                <StdButton title="Cerrar" handleClick={() => onClose(true)} />
              </div>
              <div style={{ float: "right" }}>
                <StdButton
                  title="Asignar Soluciones"
                  handleClick={() => onAssignSolutions()}
                />
              </div>
            </>
          }
        />
      )}
      {currentCause && (
        <CauseDetailModal
          cause={currentCause}
          onClose={() => setCurrentCause(null)}
        />
      )}
      {currentSolution && (
        <SolutionDetailModal
          solution={currentSolution}
          onClose={() => setCurrentSolution(null)}
        />
      )}
    </>
  );
};

export default CauseAssistant;
