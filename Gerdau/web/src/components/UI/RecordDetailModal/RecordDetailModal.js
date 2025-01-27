import React from "react";
import { ModalComponent } from "components/Modal";
import { DetailBox } from "components/DetailBox";
import { StdButton } from "components/UI/ActionBtn";
import { Button } from "components/Button";

const SolutionDetailModal = ({
  title,
  valuesByKey,
  onClose,
  onClickDetail,
}) => {
  const getChildren = () => (
    <>
      {onClickDetail && (
        <div className="d-flex justify-content-end mb-3 ml-1 mr-1">
          <Button onClick={onClickDetail}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              Ir a Detalles
            </div>
          </Button>
        </div>
      )}
      {Object.keys(valuesByKey).map((key) => (
        <>
          {valuesByKey[key].value && (
            <DetailBox
              key={key}
              title={valuesByKey[key].title}
              children={[{ label: "", value: valuesByKey[key].value }]}
            />
          )}
        </>
      ))}
    </>
  );

  return (
    <ModalComponent
      show={true}
      title={title}
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
