import React from "react";
import { Form, Row, Button } from "react-bootstrap";
import { Button as CustomButton } from "components/Button";
import useForm from "hooks/useForm";
import Schema from "./Schema";
import { TextInput } from "components/UI/TextInput";
import { ListInput } from "components/UI/ListInput";
import useTranslate from "hooks/useTranslate";

const INITIAL_VALUES = {
  firstName: "",
  lastName: "",
  email: "",
  role: "Mecánico",
};

const ROLES = [
  { value: "Admin", label: "Admin" },
  { value: "Mecánico", label: "Mecánico" },
  { value: "Operador", label: "Operador" },
];

const UserForm = ({ onCancel, onSubmit, initValues }) => {
  const t = useTranslate();
  const message = (field) => t(`containers.register.form.${field}`);
  const {
    handleBlur,
    handleInputChange,
    handleSubmit,
    errors,
    inputs,
    touched,
  } = useForm(Schema, initValues || INITIAL_VALUES, onSubmit);

  return (
    <Form onSubmit={handleSubmit}>
      <TextInput
        label={`*${message("firstName")}`}
        placeholder={message("firstName")}
        controlId="firstName"
        name="firstName"
        value={inputs.firstName}
        onBlur={handleBlur}
        onChange={handleInputChange}
        isInvalid={!!errors.firstName && touched.firstName}
        errorText={touched.firstName && errors.firstName}
      />
      <TextInput
        label={`*${message("lastName")}`}
        placeholder={message("lastName")}
        controlId="lastName"
        name="lastName"
        value={inputs.lastName}
        onBlur={handleBlur}
        onChange={handleInputChange}
        isInvalid={!!errors.lastName && touched.lastName}
        errorText={touched.lastName && errors.lastName}
      />
      <TextInput
        label={`*${message("email")}`}
        placeholder={message("email")}
        controlId="email"
        name="email"
        value={inputs.email}
        onBlur={handleBlur}
        onChange={handleInputChange}
        isInvalid={!!errors.email && touched.email}
        errorText={touched.email && errors.email}
      />
      <ListInput
        label={`*${message("role")}`}
        placeholder={message("role")}
        controlId="role"
        value={inputs.role}
        onBlur={handleBlur}
        onChange={handleInputChange}
        isInvalid={!!errors.role && touched.role}
        errorText={touched.role && errors.role}
      >
        {ROLES.map((role) => (
          <option key={role.value}>{role.label}</option>
        ))}
      </ListInput>
      <Row className="justify-content-end mr-0 mt-5 mb-5">
        <CustomButton
          variant="outline-primary"
          onClick={onCancel}
          type="button"
          className="center mr-2"
        >
          {message("cancel_btn")}
        </CustomButton>
        <Button variant="primary" type="submit" className="center">
          {message("submit_btn")}
        </Button>
      </Row>
    </Form>
  );
};

export default UserForm;
