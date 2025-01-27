import React, { useState } from "react";
import { Form, Row } from "react-bootstrap";
import { createEvent } from "lib/eventUtils";
import { Micro } from "components/UI/Microphone/index";
import { Button } from "components/Button";
import { VoiceReproducer } from "components/VoiceReproducer";
import { TrashButton } from "components/UI/Trash";
import { VoiceModal } from "components/VoiceModal";
import "./TextInput.css";

export const LongTextInput = ({
  controlId,
  errorText,
  includeMicro = false,
  initRecord = null,
  isInvalid,
  label,
  onBlur,
  recordName,
  onChange,
  placeholder,
  readOnly = false,
  rows = 3,
  value,
}) => {
  const [record, setRecord] = useState(initRecord);
  const handleRecordChange = (name, newRecord) => {
    if (!newRecord) {
      return;
    }

    let file = null;
    if (newRecord) {
      file = new File([newRecord.arrayBuffer], `${name}.webm`, {
        type: "audio/webm",
      });
      file.relatedTo = name;
    } else {
      file = new File([record.arrayBuffer], `${name}.webm`, {
        type: "audio/webm",
      });
      file.relatedTo = name;
      file.isActive = false;
    }
    setRecord(newRecord);
    createEvent(name, file, onChange);
    !newRecord && createEvent("deleteFiles", file, onChange);
  };

  return (
    <Form.Group controlId={controlId} className="mt-4">
      <Form.Label>{label}</Form.Label>
      <div className="input-group area-container">
        <textarea
          style={{ height: "100%" }}
          name={controlId}
          className="form-control"
          onBlur={onBlur}
          aria-label="With textarea"
          onChange={onChange}
          placeholder={placeholder}
          value={value}
          rows={rows}
          readOnly={readOnly}
        ></textarea>
        {isInvalid && (
          <div className="invalid-feedback d-block">{errorText}</div>
        )}
        {includeMicro && (
          <MicroComponent
            initRecord={initRecord}
            onRecord={(record) => handleRecordChange(recordName, record)}
          />
        )}
      </div>
      {record && (
        <Row>
          <div
            style={{
              display: "flex",
              width: "100%",
              alignItems: "center",
              marginTop: "10px",
            }}
          >
            <VoiceReproducer src={record.blobURL} />
            <TrashButton
              onClick={() => handleRecordChange(recordName, null)}
              style={{
                marginLeft: "5px",
                marginBottom: "15px",
              }}
              size="1x"
            />
          </div>
        </Row>
      )}
    </Form.Group>
  );
};

export const TextInput = ({
  controlId,
  errorText,
  isInvalid,
  label,
  onBlur,
  onChange,
  placeholder,
  value,
  type = "text",
}) => (
  <Form.Group controlId={controlId} className="mt-4">
    <Form.Label>{label}</Form.Label>
    <Form.Control
      type={type}
      placeholder={placeholder}
      onChange={onChange}
      onBlur={onBlur}
      value={value}
      isInvalid={isInvalid}
      name={controlId}
    />
    <Form.Control.Feedback type="invalid">{errorText}</Form.Control.Feedback>
  </Form.Group>
);

export default TextInput;

const MicroComponent = ({ onRecord, initRecord }) => {
  const [showModal, setShowModal] = useState(false);
  return (
    <div>
      <Button
        onClick={() => setShowModal(true)}
        style={{ borderRadius: "0 2px 2px 0", height: "100%" }}
      >
        <Micro size="lg" />
      </Button>
      <VoiceModal
        initRecord={initRecord}
        show={showModal}
        onClose={() => setShowModal(false)}
        onRecord={(record) => onRecord(record)}
      />
    </div>
  );
};
