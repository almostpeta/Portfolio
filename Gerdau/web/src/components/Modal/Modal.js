import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import PDFViewer from "components/UI/PDFViewer";
import InnerImageZoom from "react-inner-image-zoom";

export const ModalComponent = ({
  onClose,
  show,
  children,
  title,
  footer,
  style,
}) => {
  return (
    <>
      <Modal
        show={show}
        onHide={onClose}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        style={{ maxHeight: "95vh" }}
      >
        <Modal.Header closeButton>
          <Modal.Title
            id="contained-modal-title-vcenter"
            className="text-center col-11 pl-8"
          >
            {title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            maxHeight: "70vh",
            overflowY: "scroll",
            backgroundColor: "white",
          }}
        >
          <div style={style}>{children}</div>
        </Modal.Body>
        {footer && <Modal.Footer>{footer}</Modal.Footer>}
      </Modal>
    </>
  );
};

export const FilesModal = ({ file, onClose, show, title }) => {
  const displayModalContent = (file) => {
    let content;
    switch (file.customType) {
      case "image":
        content = (
          <InnerImageZoom
            style={{ maxHeight: "80vh" }}
            src={file.url}
            zoomSrc={file.url}
            fullscreenOnMobile={true}
            moveType="drag"
          />
        );
        break;
      case "pdf":
        content = (
          <div>
            <PDFViewer url={file.url} />
          </div>
        );
        break;
    }
    return content;
  };

  return (
    <ModalComponent
      title={title}
      show={show}
      onClose={onClose}
      children={displayModalContent(file)}
    />
  );
};
