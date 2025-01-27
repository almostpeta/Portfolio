import React from "react";
import { ModalComponent } from "components/Modal";
import { DetailBox } from "components/DetailBox";
import { StdButton } from "components/UI/ActionBtn";

const getDetailValues = (cause) => [
  {
    label: "",
    value: cause.description,
  },
];
const getReasonValues = (cause) => [
  {
    label: "",
    value: cause.reason,
  },
];
const getRelevantDataValues = (cause) => [
  {
    label: "",
    value: cause.relevant_data,
  },
];

const CauseDetailModal = ({ cause, onClose }) => {
  const getChildren = () => (
    <>
      <DetailBox
        key="description"
        title="Descripción"
        children={getDetailValues(cause)}
      />
      <DetailBox
        key="reason"
        title="Motivo"
        children={getReasonValues(cause)}
      />
      <DetailBox
        key="relevantData"
        title="Otros Datos Relevantes"
        children={getRelevantDataValues(cause)}
      />
    </>
  );

  return (
    <ModalComponent
      show={true}
      title={cause.name}
      onClose={onClose}
      children={getChildren()}
      footer={
        <div style={{ float: "right" }}>
          <StdButton title="Cerrar" handleClick={() => onClose()} />
        </div>
      }
    />
  );
};

export default CauseDetailModal;
