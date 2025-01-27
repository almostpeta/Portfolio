import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";

import React, { useEffect, useState } from "react";
import { BiTask } from "react-icons/bi";
import moment from "moment";
import { BiError } from "react-icons/bi";
import { GoCheck } from "react-icons/go";
import "./timeline.css";

const renderEvent = (event, onSelectEvent, index) => {
  let eventParams;
  switch (event.eventType) {
    case "fault":
      eventParams = {
        iconStyle: { background: "#FFD5D5", color: "#fff" },
        icon: <BiError size={30} color={"#FF4646"} />,
        className: "vertical-timeline-element--work",
        date: event.start_date_time,
        status: event.state,
        title: `Inició la falla: ${event.name}`,
      };
      break;
    case "task":
      eventParams = {
        iconStyle: { background: "#E2F2FF", color: "#fff" },
        icon: <BiTask size={50} color={"#3FA7FA"} />,
        className: "vertical-timeline-element--education",
        date: event.complete_date || event.start_date,
        status: event.status,
        title: event.complete_date
          ? `Se completó la tarea: ${event.name}`
          : `Inició la tarea: ${event.name}`,
      };
      break;
    default:
      eventParams = {
        iconStyle: { background: "#E2F2FF", color: "#fff" },
        className: "vertical-timeline-element--education",
      };
      break;
  }

  return (
    <VerticalTimelineElement
      key={index}
      onTimelineElementClick={() => onSelectEvent(index, event?.id)}
      className={eventParams.className}
      dateClassName={"vertical-timeline-element-date fw-bold date"}
      contentArrowStyle={{ borderRight: "7px solid white" }}
      contentStyle={{ color: "black" }}
      date={moment(eventParams.date).format("DD/MM/YYYY")}
      iconStyle={eventParams.iconStyle}
      icon={eventParams.icon}
    >
      <h3 className="vertical-timeline-element-title">{eventParams.title}</h3>
      <p>{event.description}</p>
      <span className="fw-bold ">{eventParams.status}</span>
    </VerticalTimelineElement>
  );
};

export const Timeline = ({ elements, onSelectEvent }) => {
  const [events, setEvents] = useState(elements);

  useEffect(() => {
    elements && setEvents(elements);
  }, [elements]);

  return (
    <div>
      <VerticalTimeline>
        {events &&
          events.map((event, index) =>
            renderEvent(event, onSelectEvent, index)
          )}
        <VerticalTimelineElement
          onSelectEvent={(e) => onSelectEvent(e)}
          iconStyle={{ background: "#D5FFD6", color: "#fff" }}
          icon={<GoCheck size={25} color={"#1BB41F"} />}
        />
      </VerticalTimeline>
    </div>
  );
};
