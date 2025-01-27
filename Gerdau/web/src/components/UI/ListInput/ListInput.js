import React from "react";
import { Form } from "react-bootstrap";

export const ListInput = ({
  controlId,
  children,
  errorText,
  isInvalid,
  label,
  onBlur,
  onChange,
  placeholder,
  value,
}) => (
  <Form.Group controlId={controlId} className="mt-4">
    <Form.Label>{label}</Form.Label>
    <Form.Control
      as="select"
      placeholder={placeholder}
      onChange={onChange}
      onBlur={onBlur}
      value={value}
      isInvalid={isInvalid}
      name={controlId}
    >
      {children}
    </Form.Control>
    <Form.Control.Feedback type="invalid">{errorText}</Form.Control.Feedback>
  </Form.Group>
);

export default ListInput;
