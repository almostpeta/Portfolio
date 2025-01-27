import React from "react";
import { Form, Row, Button } from "react-bootstrap";
import { Button as CustomButton } from "components/Button";
import useForm from "hooks/useForm";
import Schema from "./Schema";
import { TextInput } from "components/UI/TextInput";
import useTranslate from "hooks/useTranslate";

const INITIAL_VALUES = {
  password: "",
  repeated_password: "",
};

const ResetPasswordForm = ({ isNewUser, onCancel, onSubmit }) => {
  const t = useTranslate();
  const message = (field) =>
    isNewUser
      ? t(`containers.reset_password.confirm_register_form.${field}`)
      : t(`containers.reset_password.form.${field}`);

  const {
    handleBlur,
    handleInputChange,
    handleSubmit,
    errors,
    inputs,
    touched,
  } = useForm(Schema, INITIAL_VALUES, onSubmit);

  return (
    <Form onSubmit={handleSubmit}>
      <TextInput
        type="password"
        label={`*${message("password")}`}
        placeholder={message("password")}
        controlId="password"
        name="password"
        value={inputs.password}
        onBlur={handleBlur}
        onChange={handleInputChange}
        isInvalid={!!errors.password && touched.password}
        errorText={touched.password && errors.password}
      />
      <TextInput
        type="password"
        label={`*${message("repeated_password")}`}
        placeholder={message("repeated_password")}
        controlId="repeated_password"
        name="repeated_password"
        value={inputs.repeated_password}
        onBlur={handleBlur}
        onChange={handleInputChange}
        isInvalid={!!errors.repeated_password && touched.repeated_password}
        errorText={touched.repeated_password && errors.repeated_password}
      />
      <Row className="justify-content-end mt-5 mb-5">
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

export default ResetPasswordForm;
