import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";

interface IProps {
  options: any;
  onChange: Function;
  label: string;
  dataKey: string;
  placeholder: string;
}

export const Select = ({
  label,
  onChange,
  options = [{ label: "undefined", value: "undefined" }],
  dataKey,
  placeholder,
}: IProps) => {
  const [optionsData, setOptionsData] = useState(options);

  useEffect(() => {
    options && setOptionsData(options);
  }, [options]);

  return (
    <Form.Group controlId="state" className="mt-4">
      <Form.Label>{label}</Form.Label>
      <Form.Control as="select" onChange={(e) => onChange(e.target.value)}>
        <option value="" hidden>
          {placeholder}
        </option>
        {optionsData.map((u: any, i: any) => (
          <option key={i} value={u.id}>
            {u[dataKey]}
          </option>
        ))}
      </Form.Control>
    </Form.Group>
  );
};
