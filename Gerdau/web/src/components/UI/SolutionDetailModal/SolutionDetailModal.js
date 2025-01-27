import React from "react";
import { ModalComponent } from "components/Modal";
import { DetailBox } from "components/DetailBox";
import { StdButton } from "components/UI/ActionBtn";

const getDetailValues = (solution) => [
  {
    label: "",
    value: solution.description,
  },
];

const getRelevantDataValues = (solution) => [
  {
    label: "",
    value: solution.relevant_data,
  },
];

const SolutionDetailModal = ({ solution, onClose }) => {
  const getChildren = () => (
    <>
      <DetailBox
        key="description"
        title="Descripción"
        children={getDetailValues(solution)}
      />
      <DetailBox
        key="relevantData"
        title="Otros Datos Relevantes"
        children={getRelevantDataValues(solution)}
      />
    </>
  );

  return (
    <ModalComponent
      show={true}
      title={solution.name}
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

export default SolutionDetailModal;
