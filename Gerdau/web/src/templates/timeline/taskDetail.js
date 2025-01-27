import React, { useEffect, useState } from "react";
import "./timeline.css";
import { Row, Col, Container } from "react-bootstrap";
import moment from "moment";

export const getTaskDetailValues = (selectMessage, selectedEventData) => [
  {
    label: `${selectMessage("name")}: `,
    value: selectedEventData?.name,
  },
  {
    label: `${selectMessage("description")}: `,
    value: selectedEventData?.description,
  },
  {
    label: `${selectMessage("reason")}: `,
    value: selectedEventData?.reason,
  },
  {
    label: `${selectMessage("start_date")}: `,
    value: moment(selectedEventData?.start_date).format("MMMM Do YYYY"),
  },
  {
    label: `${selectMessage("deadline")}: `,
    value: moment(selectedEventData?.deadline).format("MMMM Do YYYY"),
  },
  {
    label: `${selectMessage("status")}: `,
    value: selectedEventData?.status,
  },
  {
    label: `${selectMessage("responsibleId")}: `,
    value: selectedEventData?.responsible?.name,
  },
  {
    label: `${selectMessage("requestedId")}: `,
    value: selectedEventData?.requested?.name,
  },
  {
    label: `${selectMessage("completed_date")}: `,
    value: moment(selectedEventData?.complete_date).format("MMMM Do YYYY"),
  },
  {
    label: `${selectMessage("machineId")}: `,
    value: selectedEventData?.machine?.internal_name,
  },
  {
    label: `${selectMessage("componentId")}: `,
    value: selectedEventData?.component?.internal_name,
  },
  {
    label: `${selectMessage("pieceId")}: `,
    value: selectedEventData?.piece?.internal_name,
  },
];
