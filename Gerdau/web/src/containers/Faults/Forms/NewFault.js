import React, { useEffect, useState } from "react";
import { Form, Row, Button } from "react-bootstrap";
import { Button as CustomButton } from "components/Button";
import useForm from "hooks/useForm";
import Schema from "./Schema";
import { TextInput, LongTextInput } from "components/UI/TextInput";
import { ListInput } from "components/UI/ListInput";
import CheckboxInput from "components/UI/CheckboxInput";
import { FilesUploader } from "components/FilesUploader";
import { DateTimePicker } from "components/UI/DatePicker";
import { createEvent } from "lib/eventUtils";
import MultiselectInput from "components/UI/MultiselectInput";
import useTranslate from "hooks/useTranslate";
import {
  selectFileMimeType,
  selectFileType,
  getBlobContentBase64,
} from "lib/fileUtils";
import { FAULT_STATES } from "utils/constants";
import useUser from "hooks/useUser";

const STATES = [
  { label: "Pendiente", value: FAULT_STATES.PENDING },
  { label: "En progreso", value: FAULT_STATES.IN_PROGRESS },
  { label: "Resuelta", value: FAULT_STATES.RESOLVED },
];

const PRIORITIES = [
  { label: "Baja", value: "Baja" },
  { label: "Media", value: "Media" },
  { label: "Alta", value: "Alta" },
];

const CLASIFICATIONS = [
  { label: "Eléctrica", value: "Eléctrica" },
  { label: "Mecánica", value: "Mecánica" },
  { label: "Hidráulica", value: "Hidráulica" },
  { label: "Neumática", value: "Neumática" },
];

const INITIAL_VALUES = {
  name: "",
  type: "",
  state: STATES[0].value,
  clasification: [],
  description: "",
  start_date_time: new Date(),
  end_date_time: null,
  consequences: "",
  stageId: "",
  relevant_data: "",
  priority: PRIORITIES[1].value,
  analyzed_measures: "",
  fault_number: "",
  machine: "",
  componentId: "",
  pieceId: "",
  reporters: [],
  responsibleId: "",
  are_measures: false,
  description_record: null,
  consequences_record: null,
  relevant_data_record: null,
  files: [],
};

const FaultForm = ({
  datalists = {},
  initValues,
  isEditing,
  onCancel,
  onSubmit,
  variant = "new",
}) => {
  const t = useTranslate();
  const message = (field) => t(`containers.faults.${variant}.${field}`);
  const [availableComponents, setAvailableComponents] = useState(
    datalists.components
  );
  const [availablePieces, setAvailablePieces] = useState(datalists.pieces);
  const [machineStages, setMachineStages] = useState([]);
  const [areMeasures, setAreMeasures] = useState(initValues.are_measures);
  const [initFiles, setInitFiles] = useState([]);
  const { isAdmin, user } = useUser();

  const {
    handleBlur,
    handleInputChange,
    handleInputChangeWithCallback,
    handleSubmit,
    errors,
    inputs,
    touched,
  } = useForm(
    Schema,
    (initValues && Object.assign(INITIAL_VALUES, initValues)) || INITIAL_VALUES,
    onSubmit
  );

  useEffect(() => {
    if (initValues.machine || initValues.componentId || initValues.pieceId) {
      initRecords();
    }
  }, [initValues]);

  const initRecords = () => {
    let machineId = initValues.machine;
    if (initValues.componentId) {
      const component = datalists.components.find(
        (c) => c.id === initValues.componentId
      );
      createEvent("componentId", initValues.componentId, handleInputChange);
      machineId = component?.machineId;
      createEvent("machine", machineId, handleInputChange);
    }
    if (initValues.pieceId) {
      const piece = datalists.pieces.find((p) => p.id === initValues.pieceId);
      createEvent("componentId", piece?.componentId, handleInputChange);
      const component = datalists.components.find(
        (c) => c.id === piece?.componentId
      );
      createEvent("machine", machineId, handleInputChange);
    }

    const activeFiles = [];
    initValues.files &&
      initValues.files.map((file) => {
        if (file.isActive) {
          activeFiles.push({
            name: file.originalName,
            url: getBlobContentBase64(file),
            customType: selectFileType(file.file),
          });
        }
      });

    const cleanClasifications = [];
    initValues.clasification.forEach(
      (c) => c.value && cleanClasifications.push(c.value)
    );
    initValues.clasification = cleanClasifications;
    setInitFiles(activeFiles);
    setAvailableStages(machineId);
  };

  const handleFileChange = (files) => {
    const eventTarget = {
      name: "files",
      value: files,
    };

    handleInputChange({ target: eventTarget });
  };

  const handleFileDelete = (file) => {
    const cleanFileId = file[0].id; // it always return a list with the deleted file
    const cleanF = (inputs.deleteFiles && [...inputs.deleteFiles]) || [];
    cleanFileId && cleanF.push(cleanFileId);

    const eventTarget = {
      name: "deleteFiles",
      value: cleanF,
    };

    handleInputChange({ target: eventTarget });
  };

  const handleMachineChange = (name, machineId) => {
    createEvent("pieceId", null, handleInputChange); // clean piece field
    createEvent("componentId", null, handleInputChange); // clean component field

    const components = datalists.components.filter(
      (c) => +c.machineId === +machineId
    );
    setAvailableComponents(components);
    setAvailableStages(machineId);
  };

  const setAvailableStages = (machineId) => {
    const machine = datalists.machines.find((m) => m.id === +machineId);
    const stages = machine?.stages.map((stage) => ({
      label: stage.name,
      value: stage.id,
    }));

    stages && setMachineStages([...stages]);
  };

  const handleComponentChange = (name, componentId) => {
    createEvent("pieceId", null, handleInputChange); // clean piece field
    const pieces = datalists.pieces.filter(
      (p) => +p.componentId === +componentId
    );
    setAvailablePieces(pieces);
  };

  const handleMeasuresChange = (event) => {
    setAreMeasures(event.target.value);
    handleInputChange(event);
  };

  return (
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
      {isAdmin && (
        <ListInput
          label={`*${message("state")}`}
          placeholder={message("state")}
          controlId="state"
          value={inputs.state}
          onBlur={handleBlur}
          onChange={handleInputChange}
          isInvalid={!!errors.state && touched.state}
          errorText={touched.state && errors.state}
        >
          {STATES.map((state) => (
            <option key={state.value} value={state.value}>
              {state.label}
            </option>
          ))}
        </ListInput>
      )}
      <DateTimePicker
        label={`*${message("start_date_time")}`}
        name="start_date_time"
        initialValue={inputs.start_date_time}
        onChange={(v) => createEvent("start_date_time", v, handleInputChange)}
        placeholder="Ingrese Fecha de Falla"
        isInvalid={!!errors.start_date_time && touched.start_date_time}
        errorText={touched.start_date_time && errors.start_date_time}
      />
      <DateTimePicker
        label={message("end_date_time")}
        name="end_date_time"
        initialValue={inputs.end_date_time}
        onChange={(v) => createEvent("end_date_time", v, handleInputChange)}
        placeholder="Ingrese Fecha Resolución"
        isInvalid={!!errors.end_date_time && touched.end_date_time}
        errorText={touched.end_date_time && errors.end_date_time}
      />
      <LongTextInput
        label={`${message("description")}`}
        placeholder={message("description")}
        controlId="description"
        value={inputs.description}
        includeMicro
        initRecord={inputs.description_record}
        recordName="description_record"
        onBlur={handleBlur}
        onChange={handleInputChange}
        isInvalid={!!errors.description && touched.description}
        errorText={touched.description && errors.description}
      />
      <ListInput
        label={`*${message("machine")}`}
        placeholder={message("machine")}
        controlId="machine"
        value={inputs.machine}
        onBlur={handleBlur}
        onChange={(e) => handleInputChangeWithCallback(e, handleMachineChange)}
        isInvalid={!!errors.machine && touched.machine}
        errorText={touched.machine && errors.machine}
      >
        <option key="" value="">
          Seleccionar Máquina
        </option>
        {datalists.machines?.map((machine) => (
          <option key={machine.id} value={machine.id}>
            {machine.internal_name}
          </option>
        ))}
      </ListInput>
      <ListInput
        label={`*${message("componentId")}`}
        placeholder={message("componentId")}
        controlId="componentId"
        value={inputs.componentId}
        onBlur={handleBlur}
        onChange={(e) =>
          handleInputChangeWithCallback(e, handleComponentChange)
        }
        isInvalid={!!errors.componentId && touched.componentId}
        errorText={touched.componentId && errors.componentId}
      >
        <option key="" value="">
          Seleccionar Componente
        </option>
        {availableComponents?.map((component) => (
          <option value={component.id} key={component.id}>
            {component.internal_name}
          </option>
        ))}
      </ListInput>
      <ListInput
        label={message("pieceId")}
        placeholder={message("pieceId")}
        controlId="pieceId"
        value={inputs.pieceId}
        onBlur={handleBlur}
        onChange={handleInputChange}
        isInvalid={!!errors.pieceId && touched.pieceId}
        errorText={touched.pieceId && errors.pieceId}
      >
        <option key="" value="">
          Seleccionar Pieza
        </option>
        {availablePieces?.map((piece) => (
          <option value={piece.id} key={piece.id}>
            {piece.internal_name}
          </option>
        ))}
      </ListInput>
      <MultiselectInput
        controlId="reporters"
        errorText={touched.reporters && errors.reporters}
        isInvalid={!!errors.reporters && touched.reporters}
        label={`*${message("reporters")}`}
        name="reporters"
        onChange={handleInputChange}
        options={datalists.users}
        placeholder={message("reporters")}
        placeholder={message("reporters")}
        values={inputs.reporters}
      />
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
        <option key="" value="">
          Seleccionar Responsable
        </option>
        {datalists.users?.map((user) => (
          <option value={user.id} key={user.id}>
            {user.name}
          </option>
        ))}
      </ListInput>
      <TextInput
        label={message("fault_number")}
        placeholder={message("fault_number")}
        controlId="fault_number"
        name="fault_number"
        value={inputs.fault_number}
        onBlur={handleBlur}
        onChange={handleInputChange}
        isInvalid={!!errors.fault_number && touched.fault_number}
        errorText={touched.fault_number && errors.fault_number}
      />
      <MultiselectInput
        controlId="clasification"
        errorText={touched.clasification && errors.clasification}
        isInvalid={!!errors.clasification && touched.clasification}
        label={`*${message("clasification")}`}
        name="clasification"
        onChange={handleInputChange}
        options={CLASIFICATIONS}
        placeholder={message("clasification")}
        placeholder={message("clasification")}
        values={inputs.clasification}
        labelKey="label"
        valueKey="value"
      />
      <ListInput
        label={`*${message("priority")}`}
        placeholder={message("priority")}
        controlId="priority"
        value={inputs.priority}
        onBlur={handleBlur}
        onChange={handleInputChange}
        isInvalid={!!errors.priority && touched.priority}
        errorText={touched.priority && errors.priority}
      >
        <option value="" key="">
          Seleccionar Prioridad
        </option>
        {PRIORITIES.map((priority) => (
          <option key={priority.value} value={priority.value}>
            {priority.label}
          </option>
        ))}
      </ListInput>
      <ListInput
        label={message("stage")}
        placeholder={message("stage")}
        controlId="stageId"
        value={inputs.stageId}
        onBlur={handleBlur}
        onChange={handleInputChange}
        isInvalid={!!errors.stageId && touched.stageId}
        errorText={touched.stageId && errors.stageId}
      >
        {inputs.machine ? (
          <option value="">Seleccionar Etapa </option>
        ) : (
          <option value="">Seleccionar Máquina</option>
        )}
        {machineStages.map((stage) => (
          <option value={stage.value} key={stage.value}>
            {stage.label}
          </option>
        ))}
      </ListInput>
      <CheckboxInput
        label={`${message("are_measures")}`}
        controlId="are_measures"
        name="are_measures"
        value={inputs.are_measures}
        checked={inputs.are_measures}
        onChange={handleMeasuresChange}
      />
      {areMeasures && (
        <LongTextInput
          label={`${message("analyzed_measures")}`}
          placeholder={message("analyzed_measures")}
          name="analyzed_measures"
          controlId="analyzed_measures"
          value={inputs.analyzed_measures}
          includeMicro
          initRecord={inputs.analyzed_measures_record}
          recordName="analyzed_measures_record"
          onBlur={handleBlur}
          onChange={handleInputChange}
          isInvalid={!!errors.analyzed_measures && touched.analyzed_measures}
          errorText={touched.analyzed_measures && errors.analyzed_measures}
        />
      )}
      <LongTextInput
        label={message("consequences")}
        placeholder={message("consequences")}
        controlId="consequences"
        value={inputs.consequences}
        includeMicro
        initRecord={inputs.consequences_record}
        recordName="consequences_record"
        onBlur={handleBlur}
        onChange={handleInputChange}
        isInvalid={!!errors.consequences && touched.consequences}
        errorText={touched.consequences && errors.consequences}
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
      <FilesUploader
        title={message("files")}
        onChange={(files) => handleFileChange(files)}
        onDeleteFile={(files) => handleFileDelete(files)}
        initFiles={initFiles}
      />
      <Row className="justify-content-between mt-5 mb-5">
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
      </Row>
    </Form>
  );
};

export default FaultForm;
