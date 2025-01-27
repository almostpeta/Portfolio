import React from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import { Button as CustomButton } from "components/Button";
import useForm from "hooks/useForm";
import Schema from "./Schema";
import { TextInput, LongTextInput } from "components/UI/TextInput";
import { ListInput } from "components/UI/ListInput";
import { FilesUploader } from "components/FilesUploader";
import { SOLUTION_STATUSES } from "utils/constants";
import useTranslate from "hooks/useTranslate";
import useUser from "hooks/useUser";
import "./styles.css";

const STATUSES = [
  { value: SOLUTION_STATUSES.REQUESTED, label: "Solicitada" },
  { value: SOLUTION_STATUSES.APPROVED, label: "Aprobada" },
  { value: SOLUTION_STATUSES.REJECTED, label: "Rechazada" },
];

const SolutionForm = ({
  onCancel,
  onSubmit,
  initValues,
  variant = "new",
  causeId,
  causes,
  users,
}) => {
  const INITIAL_VALUES = {
    name: "",
    description: "",
    relevant_data: "",
    status: STATUSES[0].value,
    requestedId: "",
    cause: causeId,
    reject_reason: "",
    deleteFiles: [],
    files: [],
  };
  const t = useTranslate();
  const { isAdmin } = useUser();
  const message = (field) => t(`containers.solutions.${variant}.${field}`);
  const {
    handleBlur,
    handleInputChange,
    handleSubmit,
    errors,
    inputs,
    touched,
  } = useForm(Schema, initValues || INITIAL_VALUES, onSubmit);
  const handleFileChange = (files) => {
    const eventTarget = {
      name: "files",
      value: files,
    };

    handleInputChange({ target: eventTarget });
  };

  const handleFileDelete = (file) => {
    const cleanFileId = file[0].id; // it always return a list with the deleted file
    const cleanF = [...inputs.deleteFiles];
    cleanFileId && cleanF.push(cleanFileId);

    const eventTarget = {
      name: "deleteFiles",
      value: cleanF,
    };

    handleInputChange({ target: eventTarget });
  };

  return (
    <Form onSubmit={(inputs) => handleSubmit(inputs, false)}>
      <TextInput
        label={`*${message("name")}`}
        placeholder={message("name")}
        controlId="name"
        name="name"
        value={inputs.name}
        onBlur={handleBlur}
        onChange={handleInputChange}
        isInvalid={!!errors.name && touched.name}
        errorText={touched.name && errors.name}
      />
      <LongTextInput
        label={`*${message("description")}`}
        placeholder={message("description")}
        controlId="description"
        value={inputs.description}
        onBlur={handleBlur}
        onChange={handleInputChange}
        isInvalid={!!errors.description && touched.description}
        errorText={touched.description && errors.description}
      />
      <LongTextInput
        label={message("relevant_data")}
        placeholder={message("relevant_data")}
        controlId="relevant_data"
        value={inputs.relevant_data}
        onBlur={handleBlur}
        onChange={handleInputChange}
        isInvalid={!!errors.relevant_data && touched.relevant_data}
        errorText={touched.relevant_data && errors.relevant_data}
      />
      {isAdmin && (
        <>
          <ListInput
            label={message("status")}
            placeholder={message("status")}
            controlId="status"
            value={inputs.status}
            onBlur={handleBlur}
            onChange={handleInputChange}
            isInvalid={!!errors.status && touched.status}
            errorText={touched.status && errors.status}
          >
            <option value="" hidden>
              {"Seleccionar Estado"}
            </option>
            {STATUSES.map((status, i) => (
              <option key={i} value={status.value}>
                {status.label}
              </option>
            ))}
          </ListInput>
          <ListInput
            label={message("requestedId")}
            placeholder={message("requestedId")}
            controlId="requestedId"
            value={inputs.requestedId}
            onBlur={handleBlur}
            onChange={handleInputChange}
            isInvalid={!!errors.requestedId && touched.requestedId}
            errorText={touched.requestedId && errors.requestedId}
          >
            <option value="" hidden>
              {"Seleccionar Usuario"}
            </option>
            {users.map((user, i) => (
              <option key={i} value={user.id}>
                {user.name}
              </option>
            ))}
          </ListInput>
        </>
      )}
      <ListInput
        label={message("cause")}
        placeholder={message("cause")}
        controlId="cause"
        value={inputs.cause}
        onBlur={handleBlur}
        onChange={handleInputChange}
        isInvalid={!!errors.cause && touched.cause}
        errorText={touched.cause && errors.cause}
      >
        <option value="" hidden>
          {"Seleccionar Causa"}
        </option>
        {causes &&
          causes.map((cause, i) => (
            <option key={i} value={cause.id}>
              {cause.name}
            </option>
          ))}
      </ListInput>
      <FilesUploader
        title={message("files")}
        onChange={(files) => handleFileChange(files)}
        onDeleteFile={(files) => handleFileDelete(files)}
        initFiles={inputs.files}
      />
      <Row className="justify-content-end mb-5">
        <CustomButton
          variant="outline-primary"
          onClick={onCancel}
          type="button"
          className="center mr-2"
        >
          Cancelar
        </CustomButton>
        <Button variant="primary" type="submit" className="center">
          {message("submit")}
        </Button>
        {variant === "new" && (
          <Button
            variant="primary"
            type="button"
            onClick={(inputs) => handleSubmit(inputs, true)}
            className="center new"
          >
            {message("submit_with_methods")}
          </Button>
        )}
      </Row>
    </Form>
  );
};

export default SolutionForm;
