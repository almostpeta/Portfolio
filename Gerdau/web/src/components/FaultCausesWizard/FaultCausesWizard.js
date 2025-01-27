import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import { StdButton } from "components/UI/ActionBtn";
import { ModalComponent } from "components/Modal";
import CauseAssistant from "./CauseAssistant";
import ManualCauses from "./ManualCauses";

const FaultCausesWizard = ({
  createdCause,
  fault,
  faultId,
  faultCauses,
  onClose,
  onAssignSolutions,
}) => {
  const [showManualCausesModal, setShowManualCausesModal] = useState(false);
  const [showSuggestedCausesModal, setShowSuggestedCausesModal] = useState(
    false
  );
  const [showDispatcherModal, setShowDispatcherModal] = useState(true);
  const history = useHistory();

  const handleClose = (forceFetch = false) => {
    setShowDispatcherModal(false);
    setShowManualCausesModal(false);
    onClose(forceFetch);
  };

  const handleShowSuggestedCauseModal = () => {
    setShowSuggestedCausesModal(true);
    setShowDispatcherModal(false);
  };

  const handleShowManualCauseModal = () => {
    setShowManualCausesModal(true);
    setShowDispatcherModal(false);
  };

  const handleCreateNewCause = () => {
    if (
      !window.confirm(
        "Será redirigido a la pantalla de nueva causa.\n¿Desea continuar?"
      )
    ) {
      return;
    }
    history.push("/cause/new", {
      fallback: `/fault/detail/${faultId}`,
    });
  };

  const getDispatcherModal = () => {
    return (
      <Row>
        <Col xs={4}>
          <StdButton
            style={{ justifyContent: "center" }}
            handleClick={() => handleShowSuggestedCauseModal()}
            variant="primary"
            title="Asistente de Causas"
          />
        </Col>
        <Col xs={4}>
          <StdButton
            style={{ justifyContent: "center" }}
            handleClick={() => handleShowManualCauseModal()}
            variant="primary"
            title="Asignar Manualmente"
          />
        </Col>
        <Col xs={4}>
          <StdButton
            style={{ justifyContent: "center" }}
            handleClick={() => handleCreateNewCause()}
            variant="primary"
            title="Nueva Causa"
          />
        </Col>
      </Row>
    );
  };
  return (
    <>
      {showDispatcherModal && (
        <ModalComponent
          onClose={() => handleClose()}
          show={showDispatcherModal}
          title="Asignar Causas"
          children={getDispatcherModal()}
        />
      )}
      {showSuggestedCausesModal && (
        <CauseAssistant
          fault={fault}
          faultId={faultId}
          faultCauses={faultCauses}
          onClose={(forceFetch) => handleClose(forceFetch)}
          onAssignSolutions={() => onAssignSolutions()}
        />
      )}
      {showManualCausesModal && (
        <ManualCauses
          createdCause={createdCause}
          faultId={faultId}
          faultCauses={faultCauses}
          onClose={(forceFetch) => handleClose(forceFetch)}
          onCreateNewCause={handleCreateNewCause}
        />
      )}
    </>
  );
};

export default FaultCausesWizard;
