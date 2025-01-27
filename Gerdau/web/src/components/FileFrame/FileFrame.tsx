import "./FileFrame.css";
import { X } from "react-bootstrap-icons";
import { File } from "types";
import React, { useState } from "react";
import ExcelImage from "assets/images/excel.png";
import CsvImage from "assets/images/csv.png";
import WordImage from "assets/images/word.png";
import PdfImage from "assets/images/pdf.png";
import VideoImage from "assets/images/video.png";
import { BiDownload } from "react-icons/bi";

// This component is introduced
// import FileViewer from 'react-file-viewer';

interface IProps {
  file: any;
  onClick?: Function;
  onClose?: Function;
}

const isPreviewable = (file: any) =>
  file.customType === "pdf" ||
  file.customType === "video" ||
  file.customType === "image";

const displayContent = (file: any) => {
  const fileType = file.customType;
  let content;
  switch (fileType) {
    case "image":
      content = <img src={file.url} />;
      break;
    case "video":
      content = <img src={VideoImage} width={100} height={100} />;
      break;
    case "csv":
      content = <img src={CsvImage} width={90} height={90} />;
      break;
    case "docx":
      content = <img src={WordImage} width={100} height={100} />;
      break;
    case "xlsx":
      content = <img src={ExcelImage} width={100} height={100} />;
      break;
    case "pdf":
      content = <img src={PdfImage} width={100} height={100} />;
      break;
  }
  return content;
};

export const FileFrame = ({ file, onClick, onClose }: IProps) => {
  return (
    <div className="Container">
      {onClose && (
        <div className="FrameHeader">
          <div
            onClick={() => onClose && onClose()}
            style={{
              cursor: "pointer",
              background: "white",
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
              position: "absolute",
              top: "5px",
              right: "5px",
            }}
          >
            <X color={"black"} size={20} />
          </div>
        </div>
      )}
      <div
        className="Content"
        onClick={() => onClick && isPreviewable(file) && onClick()}
      >
        {displayContent(file)}
      </div>
      <div className="FrameFooter">
        <span className="FileName"> {file.name}</span>
        <a
          href={file.url}
          target="_blank"
          rel="noopener noreferrer"
          download={file.name}
        >
          <BiDownload size={25} color={"black"} />
        </a>
      </div>
    </div>
  );
};
