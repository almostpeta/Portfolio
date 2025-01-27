import React, { useState } from "react";
import { Container, Form, Row, Button } from "react-bootstrap";
import { Button as CustomButton } from "components/Button";
import useForm from "hooks/useForm";
import Schema from "./Schema";
import { TextInput } from "components/UI/TextInput";
import { ListInput } from "components/UI/ListInput";
import { DateTimePicker } from "components/UI/DatePicker";
import { createEvent } from "lib/eventUtils";
import { TASK_STATUSES } from "utils/constants";
import useUser from "hooks/useUser";
import useTranslate from "hooks/useTranslate";

const STATUSES = [
  { value: TASK_STATUSES.NOT_COMPLETED, label: "No Completado" },
  { value: TASK_STATUSES.COMPLETED, label: "Completado" },
];

const INITIAL_VALUES = {
  name: "",
  description: "",
  reason: "",
  deadline: new Date(),
  start_date: new Date(),
  responsibleId: "",
  requestedId: "",
  complete_date: undefined,
  status: STATUSES[0].value,
  machineId: "",
  componentId: "",
  pieceId: "",
};

const UserForm = ({
  onCancel,
  onSubmit,
  initValues,
  datalists,
  isEditing = false,
}) => {
  const t = useTranslate();
  const { isAdmin, user } = useUser();
  if (initValues) {
    initValues.requestedId = initValues.requestedId
      ? initValues.requestedId
      : user?.user.id || "";
  } else {
    INITIAL_VALUES.requestedId = user?.user.id || "";
  }

  const [components, setComponents] = useState(datalists.components);
  const [pieces, setPieces] = useState(datalists.pieces);

  const message = (field) => t(`containers.tasks.form.${field}`);
  const {
    handleBlur,
    handleInputChange,
    handleSubmit,
    errors,
    inputs,
    touched,
  } = useForm(Schema, initValues || INITIAL_VALUES, onSubmit);

  const handleMachineChange = (event) => {
    const machineId = event.target.value;
    setComponents(components.filter((c) => c.machineId == machineId));
    createEvent("machineId", machineId, handleInputChange);
  };

  const handleComponentChange = (event) => {
    const componentId = event.target.value;
    setPieces(pieces.filter((p) => p.componentId == componentId));
    createEvent("componentId", componentId, handleInputChange);
  };

  return (
    <Container>
      <Row className="justify-content-md-center mt-5 text-left">
        <h2 style={{ color: "#01516a" }}>
          {message(`${isEditing ? "edit_title" : "new_title"}`)}
        </h2>
        <hr />
      </Row>

      <Form onSubmit={handleSubmit}>
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
        <TextInput
          label={`*${message("description")}`}
          placeholder={message("description")}
          controlId="description"
          name="description"
          value={inputs.description}
          onBlur={handleBlur}
          onChange={handleInputChange}
          isInvalid={!!errors.description && touched.description}
          errorText={touched.description && errors.description}
        />
        <TextInput
          label={`*${message("reason")}`}
          placeholder={message("reason")}
          controlId="reason"
          name="reason"
          value={inputs.reason}
          onBlur={handleBlur}
          onChange={handleInputChange}
          isInvalid={!!errors.reason && touched.reason}
          errorText={touched.reason && errors.reason}
        />
        <DateTimePicker
          label={`*${message("start_date")}`}
          name="start_date"
          value={inputs.start_date}
          initialValue={inputs.start_date}
          onChange={(v) => createEvent("start_date", v, handleInputChange)}
          isInvalid={!!errors.start_date && touched.start_date}
          errorText={touched.start_date && errors.start_date}
        />
        <DateTimePicker
          label={`*${message("deadline")}`}
          name="deadline"
          value={inputs.deadline}
          initialValue={inputs.deadline}
          onChange={(v) => createEvent("deadline", v, handleInputChange)}
          isInvalid={!!errors.deadline && touched.deadline}
          errorText={touched.deadline && errors.deadline}
        />
        {isAdmin && (
          <ListInput
            label={`*${message("status")}`}
            placeholder={message("status")}
            controlId="status"
            value={inputs.status}
            onBlur={handleBlur}
            onChange={handleInputChange}
            isInvalid={!!errors.status && touched.status}
            errorText={touched.status && errors.status}
          >
            <option key="" value="">
              Seleccionar Estado
            </option>
            {STATUSES?.map((status) => (
              <option key={status.value}>{status.label}</option>
            ))}
          </ListInput>
        )}
        <ListInput
          label={`*${message("responsibleId")}`}
          placeholder={message("responsibleId")}
          controlId="responsibleId"
          value={inputs.responsibleId}
          onBlur={handleBlur}
          onChange={handleInputChange}
          isInvalid={!!errors.responsibleId && touched.responsibleId}
          errorText={touched.responsibleId && errors.responsibleId}
        >
          <option key={""}>Seleccione Usuario</option>
          {datalists.users?.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </ListInput>
        <ListInput
          label={`*${message("requestedId")}`}
          placeholder={message("requestedId")}
          controlId="requestedId"
          value={inputs.requestedId}
          onBlur={handleBlur}
          onChange={handleInputChange}
          isInvalid={!!errors.requestedId && touched.requestedId}
          errorText={touched.requestedId && errors.requestedId}
        >
          <option key={""}>Seleccione Usuario</option>
          {datalists.users?.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </ListInput>
        {isAdmin && (
          <DateTimePicker
            label={`${message("completed_date")}`}
            name="complete_date"
            value={inputs.complete_date}
            initialValue={inputs.complete_date}
            onChange={(v) => createEvent("complete_date", v, handleInputChange)}
            isInvalid={!!errors.complete_date && touched.complete_date}
            errorText={touched.complete_date && errors.complete_date}
            placeholder="Ingrese una Fecha"
          />
        )}
        <ListInput
          label={`${message("machineId")}`}
          placeholder={message("machineId")}
          controlId="machineId"
          value={inputs.machineId}
          onBlur={handleBlur}
          onChange={handleMachineChange}
          isInvalid={!!errors.machineId && touched.machineId}
          errorText={touched.machineId && errors.machineId}
        >
          <option key={""}>Seleccione Máquina</option>
          {datalists.machines?.map((machine) => (
            <option key={machine.id} value={machine.id}>
              {machine.internal_name}
            </option>
          ))}
        </ListInput>
        <ListInput
          label={`${message("componentId")}`}
          placeholder={message("componentId")}
          controlId="componentId"
          value={inputs.componentId}
          onBlur={handleBlur}
          onChange={handleComponentChange}
          isInvalid={!!errors.componentId && touched.componentId}
          errorText={touched.componentId && errors.componentId}
        >
          <option key={""}>Seleccione Componente</option>
          {components?.map((component) => (
            <option key={component.id} value={component.id}>
              {component.internal_name}
            </option>
          ))}
        </ListInput>
        <ListInput
          label={`${message("pieceId")}`}
          placeholder={message("pieceId")}
          controlId="pieceId"
          value={inputs.pieceId}
          onBlur={handleBlur}
          onChange={handleInputChange}
          isInvalid={!!errors.pieceId && touched.pieceId}
          errorText={touched.pieceId && errors.pieceId}
        >
          <option key={""}>Seleccione Pieza</option>
          {pieces?.map((piece) => (
            <option key={piece.id} value={piece.id}>
              {piece.internal_name}
            </option>
          ))}
        </ListInput>
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
    </Container>
  );
};

export default UserForm;
