import React from "react";
import { Form, Row, Button } from "react-bootstrap";
import { Button as CustomButton } from "components/Button";
import useForm from "hooks/useForm";
import Schema from "./Schema";
import { TextInput } from "components/UI/TextInput";
import useTranslate from "hooks/useTranslate";

const INITIAL_VALUES = {
  email: "",
};

const ResetPasswordForm = ({ initialValues, onCancel, onSubmit }) => {
  const t = useTranslate();
  const message = (field) => t(`containers.forget_password.form.${field}`);

  const {
    handleBlur,
    handleInputChange,
    handleSubmit,
    errors,
    inputs,
    touched,
  } = useForm(Schema, initialValues || INITIAL_VALUES, onSubmit);

  return (
    <Form onSubmit={handleSubmit}>
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

      <Row className="mr-0 justify-content-end mt-5 mb-5">
        <CustomButton onClick={onCancel} type="button" className="center mr-2">
          {message("cancel_btn")}
        </CustomButton>
        {/* <div style={{ display: "flex", justifyContent: "flex-end" }}> */}
        <CustomButton type="submit">{message("submit_btn")}</CustomButton>
        {/* </div> */}
      </Row>
    </Form>
  );
};

export default ResetPasswordForm;
