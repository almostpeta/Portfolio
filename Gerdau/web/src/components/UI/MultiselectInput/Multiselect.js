import React from "react";
import { Form } from "react-bootstrap";
import { createEvent } from "lib/eventUtils";
import { MultiSelect } from "components/MultiSelect";

const MultiselectInput = ({
  controlId,
  errorText,
  isInvalid,
  label,
  labelKey = "name",
  name,
  onChange,
  options,
  placeholder,
  valueKey = "id",
  values,
}) => {
  const handleChange = (records) => {
    // const _values = records?.map((r) => r);
    createEvent(name, records || [], onChange);
    // console.log(_values || []);
  };

  return (
    <Form.Group controlId={controlId} className="mt-4">
      <Form.Label>{label}</Form.Label>
      <MultiSelect
        options={options?.map((opt) => {
          if (typeof opt === "object") {
            return {
              value: opt[valueKey],
              label: opt[labelKey],
            };
          }
          return opt;
        })}
        values={values}
        placeholder={placeholder}
        onChange={(c) => handleChange(c)}
      />
      {isInvalid && <div className="invalid-feedback d-block">{errorText}</div>}
    </Form.Group>
  );
};

export default MultiselectInput;
