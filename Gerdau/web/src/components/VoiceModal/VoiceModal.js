import React, { useState, useEffect } from "react";
import { ModalComponent } from "components/Modal";
import { Button } from "components/Button";
import { ReactMicComponent } from "components/ReactMic";
import useTranslate from "hooks/useTranslate";
import { BsPlayFill } from "react-icons/bs";
import { FaStopCircle } from "react-icons/fa";
import "./modal.css";

export const VoiceModal = ({ onClose, show, onRecord, initRecord }) => {
  const t = useTranslate();
  const [recording, setRecording] = useState(false);
  const [record, setRecord] = useState(null);

  useEffect(() => {
    initRecord && setRecord(initRecord);
  }, [initRecord]);

  const handleConfirm = () => {
    onRecord(record);
    onClose();
  };

  return (
    <ModalComponent
      title={t("components.voiceModal.title")}
      onClose={() => onClose()}
      show={show}
      style={{ backgrounColor: "#212121" }}
    >
      <div>
        <ReactMicComponent
          initRecord={initRecord}
          recording={recording}
          onStop={(record) => setRecord(record)}
          style={{ width: "100%" }}
        />
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ margin: "2px 0 2px 0" }}>
            <Button onClick={() => setRecording(true)} variant="info">
              <BsPlayFill size={25} />
            </Button>
          </div>
          <div style={{ margin: "2px" }}>
            {" "}
            <Button onClick={() => setRecording(false)} variant="info">
              <FaStopCircle size={25} />
            </Button>
          </div>

          <div style={{ margin: "2px" }}>
            <Button onClick={() => handleConfirm()} variant="success">
              {t("components.voiceModal.confirm")}
            </Button>
          </div>
          <div style={{ margin: "2px" }}>
            <Button onClick={() => onClose()} variant="danger">
              {t("components.voiceModal.cancel")}
            </Button>
          </div>
        </div>
      </div>
    </ModalComponent>
  );
};
