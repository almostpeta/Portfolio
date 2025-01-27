import React, { useEffect, useState } from "react";
import "./timeline.css";
import { Row, Col, Container } from "react-bootstrap";
import moment from "moment";

export const getFaultDetailValues = (selectMessage, selectedEventData) => [
  {
    label: `${selectMessage("name")}: `,
    value: selectedEventData?.name,
  },
  {
    label: `${selectMessage("state")}: `,
    value: selectedEventData?.state,
  },
  {
    label: `${selectMessage("date")}: `,
    value: moment(selectedEventData?.start_date_time).format("MMMM Do YYYY"),
  },
  {
    label: `${selectMessage("end_date")}: `,
    value: moment(selectedEventData?.end_date_time).format("MMMM Do YYYY"),
  },
  {
    label: `${selectMessage("resolution_date")}: `,
    value:
      selectedEventData?.resolution_date &&
      moment(selectedEventData?.resolution_date).format("MMMM Do YYYY"),
  },
  {
    label: `${selectMessage("description")}: `,
    value: selectedEventData?.description,
  },
  {
    label: `${selectMessage("machine")}: `,
    value: selectedEventData?.internal_name,
    variant: "link",
    href: `/machine/detail/${selectedEventData?.machine?.id}`,
  },
  {
    label: `${selectMessage("component")}: `,
    value: selectedEventData?.component?.internal_name,
    variant: "link",
    href: `/component/detail/${selectedEventData?.component?.id}`,
  },
  {
    label: `${selectMessage("piece")}: `,
    value: selectedEventData?.piece?.internal_name,
    variant: "link",
    href: `/piece/detail/${selectedEventData?.piece?.id}`,
  },
  {
    label: `${selectMessage("fault_number")}: `,
    value: selectedEventData?.fault_number,
  },
  {
    label: `${selectMessage("clasification")}: `,
    value: selectedEventData?.clasification,
  },
  {
    label: `${selectMessage("priority")}: `,
    value: selectedEventData?.priority,
  },
  {
    label: `${selectMessage("stage")}: `,
    value: selectedEventData?.stage,
  },
];
