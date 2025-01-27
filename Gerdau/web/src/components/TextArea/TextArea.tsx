import React, { useState, useEffect } from "react";
import "./TextArea.css";
import { Micro } from "../UI/Microphone/index";
import { Button } from "components/Button";
import { VoiceModal } from "../VoiceModal";
import { ReactMicComponent } from "../ReactMic";
import { faRecordVinyl } from "../../../node_modules/@fortawesome/free-solid-svg-icons";

type Props = {
  controlId?: string;
  errorText?: string;
  includeMicro: boolean;
  initRecord: any;
  isInvalid: boolean;
  label?: string;
  name: string;
  onBlur: any;
  onChange: any;
  onRecord: Function;
  placeholder?: string;
  readOnly: boolean;
  rows?: number;
  value: string;
};

type BlobProps = {
  blobURL: string;
};

export const TextArea = ({
  name,
  placeholder,
  rows,
  onBlur,
  onChange,
  includeMicro,
  onRecord,
  initRecord,
  value,
  readOnly,
  isInvalid,
}: Props) => {
  const [data, setData] = useState(value);

  useEffect(() => {
    setData(value);
  }, [value]);

  return (
    <div className="input-group area-container">
      <textarea
        name={name}
        className="form-control"
        onBlur={onBlur}
        aria-label="With textarea"
        onChange={(e) => onChange(e)}
        placeholder={placeholder}
        value={value}
        readOnly={readOnly}
      ></textarea>
      {includeMicro && (
        <MicroComponent
          initRecord={initRecord}
          onRecord={(record: any) => onRecord(record)}
        />
      )}
    </div>
  );
};

const MicroComponent = ({ onRecord, initRecord }: any) => {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <Button
        onClick={() => setShowModal(true)}
        style={{ borderRadius: "0 2px 2px 0" }}
      >
        <Micro size="lg" />
      </Button>
      <VoiceModal
        initRecord={initRecord}
        show={showModal}
        onClose={() => setShowModal(false)}
        onRecord={(record: any) => onRecord(record)}
      />
    </>
  );
};
