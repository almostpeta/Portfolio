import React, { useState, useEffect } from "react";
import {
  getResolveFaultCauses,
  associateMethods,
  setResolved,
} from "service/fault";
import { WarningAlert } from "components/UI/Alert";
import { Button } from "components/Button";
import CustomCollapse from "components/CustomCollapse";
import ThreeLevelCollapse from "components/ThreeLevelCollapse";
import { useHistory } from "react-router-dom";
import { ModalComponent } from "components/Modal";
import SolutionDetailModal from "components/UI/SolutionDetailModal";
import { BackBtn, StdButton, NextBtn } from "components/UI/ActionBtn";
import { Toast } from "components/Toast";
import { Loading } from "components/Loading";

const FaultSolutionsModalContainer = ({
  faultId,
  onClose,
  onAssociateCauses,
}) => {
  const history = useHistory();
  const [causes, setCauses] = useState([]);
  const [error, setError] = useState("");
  const [selectedSolutions, setSelectedSolutions] = useState([]);
  const [selectedMethods, setSelectedMethods] = useState([]);
  const [step, setStep] = useState(0);
  const [formattedCauses, setFormattedCauses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);

  useEffect(() => {
    fetchCauses();
  }, [faultId]);

  const fetchCauses = async () => {
    try {
      setIsLoading(true);
      const retrievedCauses = await getResolveFaultCauses(faultId);
      setCauses([...retrievedCauses]);
      // if (retrievedSolutions.length === 0) {
      //   setError(
      //     "No se ha encontrado ninguna solución posible a la falla. Por favor, revisa que las causas que asociaste a la falla tengán soluciones asociadas."
      //   );
      // }
      if (retrievedCauses.length === 0) {
        setError(
          "No se ha encontrado ninguna causa asociada a la falla. Por favor, asocia alguna causa a la falla para poder resolver la falla."
        );
      }
    } catch (e) {
      setCauses([]);
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSolutionChange = (record) => {
    const cleanSelectedRecords = [...selectedSolutions];
    let index = cleanSelectedRecords.findIndex(
      (s) => s.id.toString() === record.id.toString()
    );
    if (index !== -1) {
      cleanSelectedRecords.splice(index, 1);
      record.isSelected = false;
    } else {
      record.isSelected = true;
      cleanSelectedRecords.push(record);
    }
    setSelectedSolutions(cleanSelectedRecords);
    // setSelectedCauses()
  };

  const handleMethodChange = (record) => {
    const cleanSelectedRecords = [...selectedMethods];
    let index = cleanSelectedRecords.findIndex(
      (s) => s.id.toString() === record.id.toString()
    );
    if (index !== -1) {
      cleanSelectedRecords.splice(index, 1);
      record.isSelected = false;
    } else {
      record.isSelected = true;
      cleanSelectedRecords.push(record);
    }
    setSelectedMethods(cleanSelectedRecords);
  };

  const formatFirstStepData = () => {
    let data = causes.map((cause) => ({
      ...cause,
      children: [...cause.solutions],
    }));
    //setting the state after mapping brings an error(infinite loop)
    // setFormattedCauses(data);
    return data;
  };

  const formatSecondStepData = () => {
    let selectedCauseIds = [];
    selectedSolutions.map(
      (sol) =>
        !selectedCauseIds.includes(sol.causeId.toString()) &&
        selectedCauseIds.push(sol.causeId.toString())
    );
    //toDo:add this as state, instead of calling the same function
    const formattedFirstStepData = formatFirstStepData();
    let selectedCauses = formattedFirstStepData.filter((cause) =>
      selectedCauseIds.includes(cause.id.toString())
    );
    let selectedSolutionsIds = selectedSolutions.map((sol) =>
      sol.id.toString()
    );
    let causesWithFilteredChildren = selectedCauses.map((cause) => ({
      ...cause,
      children: cause.children.filter((sol) =>
        selectedSolutionsIds.includes(sol.id.toString())
      ),
    }));
    return causesWithFilteredChildren;
  };

  const handleFinish = async () => {
    try {
      setIsLoading(true);
      if (selectedMethods.length > 0) {
        await associateMethods(faultId, selectedMethods);
        await setResolved(faultId);
        onClose(true);
        Toast("success", "Se ha resuelto la falla");
      } else {
        Toast(
          "error",
          "Para resolver la falla debe seleccionar al menos un método"
        );
      }
    } catch (e) {
      Toast("error", "No se ha podido marcar la falla como resuelta");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextStep = () => {
    if (selectedSolutions?.length > 0) {
      setStep(1);
    } else {
      Toast("error", "Para continuar debe seleccionar una o más soluciones");
    }
  };

  const handleStepBack = () => {
    selectedMethods.map((method) => (method.isSelected = false));
    setStep(0);
    setSelectedMethods([]);
  };

  const handleAddSolution = (causeId) => {
    if (
      window.confirm(
        "Será redirigido a la pantalla de nueva solución\n¿Desea continuar?"
      )
    ) {
      history.push("/solution/new", {
        fallback: `/fault/detail/${faultId}`,
        causeId,
      });
    }
  };

  const handleAddMethod = (solutionId) => {
    if (
      window.confirm(
        "Será redirigido a la pantalla de nuevo método\n¿Desea continuar?"
      )
    ) {
      history.push("/method/new", {
        fallback: `/fault/detail/${faultId}`,
        solutionId,
      });
    }
  };

  return (
    <>
      {isLoading && <Loading />}

      {step === 0 && (
        <ModalComponent
          show={true}
          onClose={() => onClose()}
          title="Resolución de Falla"
          children={
            <>
              {!error && (
                <>
                  <div className="col-11" style={{ textAlign: "center" }}>
                    Seleccione las soluciones con las que se resolvió la falla.
                  </div>
                </>
              )}
              {error && <WarningAlert title={error} />}
              <CustomCollapse
                data={formatFirstStepData()}
                onSelectClick={(solution) => handleSolutionChange(solution)}
                onAdd={handleAddSolution}
                onDetailClick={(solution) => setCurrentRecord(solution)}
                parentItemVariant={"cause"}
                itemVariant={"solution"}
                firstLevelWarning={
                  "No se han encontrado soluciones para esta causa"
                }
              />
            </>
          }
          footer={
            <>
              <StdButton
                style={{ float: "right" }}
                title="Cancelar"
                handleClick={() => onClose()}
              />
              {/asocia alguna causa/.test(error) && (
                <StdButton
                  style={{ float: "right" }}
                  title="Asociar Causas"
                  handleClick={onAssociateCauses}
                />
              )}
              {!error && (
                <div style={{ float: "right" }}>
                  <NextBtn title="Siguiente" handleClick={handleNextStep} />
                </div>
              )}
            </>
          }
        />
      )}
      {step === 1 && (
        <ModalComponent
          show={true}
          onClose={() => onClose()}
          title="Resolución de Falla"
          children={
            <>
              {!error && (
                <>
                  <div className="col-11" style={{ textAlign: "center" }}>
                    Seleccione los métodos que utilizó para resolver la falla.
                  </div>
                  <ThreeLevelCollapse
                    data={formatSecondStepData()}
                    onAddFirstParent={(e) => handleAddSolution(e)}
                    onAddSecondParent={(e) => handleAddMethod(e)}
                    onSelectClick={(method) => handleMethodChange(method)}
                    onDetailClick={(method) => setCurrentRecord(method)}
                    firstLevelWarning={
                      "No se han encontrado soluciones para esta causa"
                    }
                    secondLevelWarning={
                      "No se han encontrado métodos para esta solución"
                    }
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
                <BackBtn title="Volver" handleClick={() => handleStepBack()} />
              </div>
              <div style={{ float: "right" }}>
                <NextBtn title="Finalizar" handleClick={() => handleFinish()} />
              </div>
            </>
          }
        />
      )}
      {currentRecord && (
        <SolutionDetailModal
          solution={currentRecord}
          onClose={() => setCurrentRecord(null)}
        />
      )}
    </>
  );
};

export default FaultSolutionsModalContainer;
