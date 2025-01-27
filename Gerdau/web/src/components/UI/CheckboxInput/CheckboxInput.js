import React from "react";
import { Form } from "react-bootstrap";
import { createEvent } from "lib/eventUtils";

const CheckboxInput = ({ controlId, errorText, onChange, value, label }) => (
  <Form.Group controlId={controlId} className="mt-4">
    <Form.Check
      type="checkbox"
      label={label}
      onChange={(e) => createEvent(controlId, e.target.checked, onChange)}
      checked={value}
      name={controlId}
    />
    <Form.Control.Feedback type="invalid">{errorText}</Form.Control.Feedback>
  </Form.Group>
);

export default CheckboxInput;
