import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { ModalComponent } from "components/Modal/Modal";
import { Button } from "components/Button";
import { TextArea } from "components/TextArea";

const RejectModal = ({ onReject, onClose, show, style, title }) => {
  const [reason, setReason] = useState("");

  return (
    <ModalComponent onClose={onClose} show={show} style={style} title={title}>
      <div className="d-flex justify-content-center flex-column p-3">
        <Form.Label>Motivo de rechazo</Form.Label>
        <TextArea
          name="rejectReason"
          rows={4}
          placeholder={"Ingresar Motivo de Rechazo"}
          onChange={(e) => setReason(e.target.value)}
          value={reason}
        />
        <div className="d-flex justify-content-end mt-3">
          <Button
            onClick={() => onReject(reason)}
            children={"Enviar"}
            size="lg"
          />
        </div>
      </div>
    </ModalComponent>
  );
};

export default RejectModal;
