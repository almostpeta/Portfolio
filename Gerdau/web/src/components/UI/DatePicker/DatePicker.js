import React from "react";
import Datetime from "react-datetime";
import { Form } from "react-bootstrap";
import moment from "moment";
import "./DatePicker.css";
import "react-datetime/css/react-datetime.css";
import ReactDatePicker, { registerLocale } from "react-datepicker";
import es from "date-fns/locale/es";

registerLocale("es", es);

export const DatePicker = ({ date, onChange, placeholder, initialValue }) => (
  <ReactDatePicker
    className="form-control"
    selected={date}
    initialValue={initialValue}
    placeholder={placeholder}
    onChange={(date) => onChange(date)}
    dateFormat="MMMM d, yyyy h:mm aa"
    locale="en-GB"
  />
);

export const DateTimePicker = ({
  errorText,
  isInvalid,
  label,
  name,
  onChange,
  placeholder,
  initialValue,
  value,
}) => (
  <Form.Group
    controlId={name}
    styles={{
      control: (styles) => ({
        ...styles,
        borderColor: isInvalid ? "red" : styles.borderColor,
        "&:hover": {
          borderColor: isInvalid ? "red" : styles["&:hover"].borderColor,
        },
      }),
    }}
  >
    <Form.Label>{label}</Form.Label>
    <Datetime
      timeFormat="hh:mm a"
      dateFormat="DD/MM/YYYY"
      onChange={(e) => onChange(e)}
      initialValue={
        initialValue && moment(initialValue).format("DD/MM/YYYY hh:mm a")
      }
      inputProps={{ placeholder }}
    />
    {isInvalid && <div className="invalid-feedback d-block">{errorText}</div>}
  </Form.Group>
);

export const DateControl = ({
  errorText,
  isInvalid,
  label,
  name,
  onChange,
  placeholder,
  initialValue,
  value,
}) => (
  <Form.Group
    controlId={name}
    styles={{
      control: (styles) => ({
        ...styles,
        borderColor: isInvalid ? "red" : styles.borderColor,
        "&:hover": {
          borderColor: isInvalid ? "red" : styles["&:hover"].borderColor,
        },
      }),
    }}
  >
    <Form.Label>{label}</Form.Label>
    <ReactDatePicker
      className="form-control"
      selected={value}
      initialValue={initialValue}
      placeholder={placeholder}
      onChange={(date) => onChange(date)}
      dateFormat="dd/MM/yyyy"
      locale="es"
    />
    {isInvalid && <div className="invalid-feedback d-block">{errorText}</div>}
  </Form.Group>
);

export default DatePicker;
