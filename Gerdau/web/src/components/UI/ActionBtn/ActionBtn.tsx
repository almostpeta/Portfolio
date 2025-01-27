import React from "react";
import { defaults } from "lodash";
import {
  BsPencil,
  BsPlusSquare,
  BsWrench,
  BsFillTrashFill,
  BsHammer,
  BsArrowRepeat,
  BsCheck,
} from "react-icons/bs";
import { GoCheck, GoTasklist } from "react-icons/go";
import { FaChevronRight, FaChevronLeft, FaGavel } from "react-icons/fa";
import { BiDownload } from "react-icons/bi";
import { Button } from "components/Button";
import { X } from "react-bootstrap-icons";

type Props = {
  style?: any;
  handleClick: Function;
  icon?: any;
  title: any;
  variant?: any;
  isIconAtLeft?: Boolean;
  isIconAtRight?: Boolean;
};

const BtnContainer: React.FC<Props> = (props) => {
  const style = defaults({}, props.style, {
    justifyContent: "end",
  });
  return (
    <>
      <div className="d-flex mb-3" style={style}>
        <Button onClick={() => props.handleClick()} variant={props.variant}>
          {" "}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {props.isIconAtLeft && props.icon}
            {`${props.title} `}
            {props.isIconAtRight && props.icon}
          </div>
        </Button>
      </div>
    </>
  );
};

export const StdButton: React.FC<Props> = (props) => {
  return (
    <BtnContainer
      style={props.style}
      handleClick={() => props.handleClick()}
      title={props.title}
    />
  );
};

export const AddBtn: React.FC<Props> = (props) => {
  const btn = <BsPlusSquare size={17} style={{ marginRight: "3px" }} />;
  return (
    <BtnContainer
      isIconAtLeft={true}
      icon={btn}
      handleClick={() => props.handleClick()}
      title={props.title}
    />
  );
};

export const EditBtn: React.FC<Props> = (props) => {
  const btn = <BsPencil size={17} style={{ marginRight: "3px" }} />;
  return (
    <BtnContainer
      isIconAtLeft={true}
      icon={btn}
      handleClick={() => props.handleClick()}
      title={props.title}
    />
  );
};

export const ReportFaultBtn: React.FC<Props> = (props) => {
  const btn = <BsWrench size={17} style={{ marginRight: "3px" }} />;
  return (
    <BtnContainer
      icon={btn}
      isIconAtLeft={true}
      handleClick={() => props.handleClick()}
      title={props.title}
    />
  );
};

export const DeleteBtn: React.FC<Props> = (props) => {
  const btn = <BsFillTrashFill size={17} style={{ marginRight: "3px" }} />;
  return (
    <BtnContainer
      variant="outline-danger"
      style={{ color: "red" }}
      icon={btn}
      isIconAtLeft={true}
      handleClick={() => props.handleClick()}
      title={props.title}
    />
  );
};

export const RejectBtn: React.FC<Props> = (props) => {
  const btn = <X size={20} style={{ marginRight: "3px" }} />;
  return (
    <BtnContainer
      variant="danger"
      icon={btn}
      isIconAtLeft={true}
      handleClick={() => props.handleClick()}
      title={props.title}
    />
  );
};

export const ApproveBtn: React.FC<Props> = (props) => {
  const btn = <GoCheck size={20} style={{ marginRight: "3px" }} />;
  return (
    <BtnContainer
      variant="success"
      icon={btn}
      isIconAtLeft={true}
      handleClick={() => props.handleClick()}
      title={props.title}
    />
  );
};

export const RelateCauseBtn: React.FC<Props> = (props) => {
  const btn = <BsHammer size={17} style={{ marginRight: "3px" }} />;
  return (
    <BtnContainer
      icon={btn}
      isIconAtLeft={true}
      handleClick={() => props.handleClick()}
      title={props.title}
    />
  );
};

export const ResendCauseBtn: React.FC<Props> = (props) => {
  const btn = <BsArrowRepeat size={17} style={{ marginRight: "3px" }} />;
  return (
    <BtnContainer
      icon={btn}
      isIconAtLeft={true}
      handleClick={() => props.handleClick()}
      title={props.title}
    />
  );
};

export const NextBtn: React.FC<Props> = (props) => {
  const btn = <FaChevronRight size={17} style={{ marginRight: "3px" }} />;
  return (
    <BtnContainer
      icon={btn}
      isIconAtRight={true}
      handleClick={() => props.handleClick()}
      title={props.title}
    />
  );
};

export const BackBtn: React.FC<Props> = (props) => {
  const btn = <FaChevronLeft size={17} style={{ marginRight: "3px" }} />;
  return (
    <BtnContainer
      icon={btn}
      isIconAtLeft={true}
      handleClick={() => props.handleClick()}
      title={props.title}
    />
  );
};

export const ResolveFaultBtn: React.FC<Props> = (props) => {
  const btn = <FaGavel size={17} style={{ marginRight: "3px" }} />;
  return (
    <BtnContainer
      icon={btn}
      isIconAtLeft={true}
      handleClick={() => props.handleClick()}
      title={props.title}
    />
  );
};

export const DownloadFaultBtn: React.FC<Props> = (props) => {
  const btn = <BiDownload size={17} style={{ marginRight: "3px" }} />;
  return (
    <BtnContainer
      icon={btn}
      isIconAtLeft={true}
      handleClick={() => props.handleClick()}
      title={props.title}
    />
  );
};

export const CompleteTaskBtn: React.FC<Props> = (props) => {
  const btn = <BsCheck size={17} style={{ marginRight: "3px" }} />;
  return (
    <BtnContainer
      icon={btn}
      isIconAtLeft={true}
      handleClick={() => props.handleClick()}
      title={props.title}
    />
  );
};

export const CreateFollowUpTask: React.FC<Props> = (props) => {
  const btn = <GoTasklist size={17} style={{ marginRight: "3px" }} />;
  return (
    <BtnContainer
      icon={btn}
      isIconAtLeft={true}
      handleClick={() => props.handleClick()}
      title={props.title}
    />
  );
};
