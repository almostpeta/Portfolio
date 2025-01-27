import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { ModalComponent } from "components/Modal/Modal";
import { deleteMachine } from "service/machine.js";
import useTranslate from "hooks/useTranslate";
import "./delete.css";

const DeleteForm = ({ onClose, machineId }) => {
  const t = useTranslate();

  const handleDelete = async () => {
    await deleteMachine(machineId);
    alert("La máquina ha sido eliminada");
  };

  return (
    <>
      {t("containers.machines.delete.subtitle")} <br />
      <div style={{ float: "right" }}>
        <Button
          className="btn-class"
          onClick={() => onClose()}
          variant="primary"
        >
          Cancelar
        </Button>
        <Button
          className="btn-class"
          onClick={() => handleDelete()}
          variant="danger"
        >
          Eliminar
        </Button>
      </div>
    </>
  );
};

const DeleteModal = ({ showModal, onClose, machineId, onDelete }) => {
  const t = useTranslate();

  return (
    <>
      <ModalComponent
        title={t("containers.machines.delete.title")}
        show={showModal}
        onClose={() => onClose()}
        children={
          <DeleteForm
            machineId={machineId}
            onClose={() => onClose()}
            onDelete={() => onDelete()}
          />
        }
      />
    </>
  );
};

export default DeleteModal;
