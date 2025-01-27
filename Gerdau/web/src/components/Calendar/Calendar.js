import React, { useState, useEffect } from "react";
import {
  Calendar as CalendarComponent,
  momentLocalizer,
} from "react-big-calendar";
import moment from "moment";
import { getCalendarTaskStateStyles } from "utils/status";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "moment/locale/es";
const localizer = momentLocalizer(moment);

export const Calendar = ({ tasks, onCreateTask, onSelectTask }) => {
  const [events, setEvents] = useState(tasks);

  useEffect(() => {
    tasks && setEvents(tasks);
  }, [tasks]);

  const eventStyleGetter = (event, start, end, isSelected) => {
    var style = getCalendarTaskStateStyles(event.state);
    return { style };
  };

  return (
    <div>
      <CalendarComponent
        popup
        selectable
        localizer={localizer}
        events={events}
        onSelectSlot={(event) => onCreateTask(event)}
        scrollToTime={new Date(1970, 1, 1, 6)}
        onSelectEvent={(event) => onSelectTask(event)}
        startAccessor="start"
        endAccessor="end"
        onSelectDate={(day) => {
          console.log(day);
        }}
        eventPropGetter={eventStyleGetter}
        style={{ height: 700 }}
        messages={{
          next: "Siguiente",
          previous: "Anterior",
          today: "Hoy",
          month: "Mes",
          week: "Semana",
          day: "Día",
        }}
      />
    </div>
  );
};
