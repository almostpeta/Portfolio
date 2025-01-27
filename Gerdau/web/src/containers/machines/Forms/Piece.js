import React, { useState, useEffect } from "react";
import { TextArea } from "components/TextArea";
import { FilesUploader } from "components/FilesUploader";
import { Form, Container, Row } from "react-bootstrap";
import { DatePicker } from "components/UI/DatePicker/index";
import useTranslate from "hooks/useTranslate";
import { MultiSelect } from "components/MultiSelect";
import {
  selectFileMimeType,
  selectFileType,
  getBlobContentBase64,
} from "lib/fileUtils";

export const PieceForm = ({
  onChange,
  index,
  data,
  machinesData,
  componentsData,
  usersData,
  isSubmitted,
  isEditing,
  files,
  onChangeFiles,
  onDeleteFile,
}) => {
  
  const componentsOptions = (data) => {
    const objects =
      data &&
      data.map((component, index) => ({
        name: component.internal_name || "",
        id: component.id || "",
      }));
    return objects;
  };

  const selectComponent = (componentId) => {
    const lowercasedValue = componentId && componentId.toLowerCase().trim();
    const data =
      components &&
      components.filter((item) => {
        return Object.keys(item).some((key) => {
          return ["id"].includes(key)
            ? item[key].toString().toLowerCase().includes(lowercasedValue)
            : false;
        });
      });
    return data[0] ? data[0] : null;
  };

  const selectOption = (text, list, field) => {
    const lowercasedValue = text && text.toLowerCase().trim();
    const data =
      list &&
      list.filter((item) => {
        return Object.keys(item).some((key) => {
          return [field].includes(key)
            ? item[key].toString().toLowerCase().includes(lowercasedValue)
            : false;
        });
      });
    return data[0] ? data[0] : null;
  };

  const searchTypes = (elements, allTypes) => {
    const selectedTypes =
      elements &&
      elements.map((element) => selectOption(element, allTypes, "label"));
    return selectedTypes;
  };

  const [machines, setMachines] = useState([]);
  const [pieceData, setPieceData] = useState(data);
  const [pieceFiles, setPieceFiles] = useState(files || []);
  const [users, setUsers] = useState([]);
  const [manufacturerTypes, setManufacturerTypes] = useState([
    { name: "Original", id: "1" },
    { name: "Según Plano", id: "2" },
  ]);
  const [submited, setSubmited] = useState(isSubmitted);
  const [piecesTypes, setPiecesTypes] = useState([
    { label: "Hidráulica", value: "1" },
    { label: "Mecánica", value: "2" },
    { label: "Neumática", value: "3" },
    { label: "Eléctrica", value: "4" },
  ]);
  const [components, setComponents] = useState(componentsData || []);
  const [states, setStates] = useState([]);

  const [workingSinceDate, setWorkingSinceDate] = useState(
    (pieceData["working_from_date"] &&
      new Date(pieceData["working_from_date"])) ||
      new Date()
  );

  const [component, setComponent] = useState(pieceData["componentId"]);
  const [selectedComponent, setSelectedComponent] = useState(
    (pieceData["componentId"] &&
      selectComponent(pieceData["componentId"].toString())) ||
      null
  );

  const [machineId, setMachineId] = useState(
    (selectedComponent && selectedComponent.machineId.toString()) || null
  );

  const [internalName, setInternalName] = useState(pieceData["internal_name"]);
  const [identifier, setIdentifier] = useState(pieceData["identifier"]);
  const [make, setMake] = useState(pieceData["make"]);
  const [model, setModel] = useState(pieceData["model"]);
  const [pieceState, setPieceState] = useState(pieceData["piece_state"]);
  const [specifications, setSpecifications] = useState(
    pieceData["specifications"]
  );
  const [maintenanceResponsible, setMaintenanceResponsible] = useState(
    pieceData["responsibleId"]
  );
  const [selectedTypes, setSelectedTypes] = useState(
    pieceData["type"] && searchTypes(pieceData["type"].split(","), piecesTypes)
  );
  const [manufacturer, setManufacturer] = useState(pieceData["manufacturer"]);
  const [provider, setProvider] = useState(pieceData["provider"]);
  const [manufacturerType, setManufacturerType] = useState(
    pieceData["manufacturer_type"]
  );
  const [flatNumber, setFlatNumber] = useState(pieceData["flat_number"]);
  const [relevantData, setRelevantData] = useState(pieceData["relevant_data"]);
  const machineMessages = "containers.machines.machine";
  const t = useTranslate();

  const selectMessage = (value) => {
    return t(machineMessages.concat("." + value));
  };

  const handleSelectDate = (prop, date) => {
    onChange(index, prop, date);
    setWorkingSinceDate(date);
  };

  useEffect(() => {
    data && setPieceData(data);
    if (data && isEditing) {
      // setPieceData(data);
      // const selectedType = selectOption(data.type, piecesTypes, "label");
      const selectedManufacturerType = selectOption(
        data.manufacturer_type,
        manufacturerTypes,
        "name"
      );
      // const selectedState = selectOption(data.state, states);
      // selectedState && setComponentState(selectedState.id);
      selectedManufacturerType &&
        setManufacturerType(selectedManufacturerType.id);
    }
    setPieceFiles(
      data.pieceFiles?.map((file) => {
        if (file instanceof File) {
          return file;
        } else {
          return {
            id: file.id,
            pieceId: file.pieceId,
            name: file.name || file.file,
            url: file.url || getBlobContentBase64(file),
            customType: file.customType || selectFileType(file.file),
          };
        }
      }) || []
    );
  }, [data]);

  useEffect(() => {
    usersData && setUsers(usersData);
  }, [usersData]);

  useEffect(() => {
    isSubmitted && setSubmited(isSubmitted);
  }, [isSubmitted]);

  useEffect(() => {
    if (!states.length) {
      setStates([
        { name: "Producción", id: "1" },
        { name: "Mantenimiento", id: "2" },
        { name: "Fuera de uso", id: "3" },
      ]);
    }
  }, [states]);

  useEffect(() => {
    machinesData && setMachines(machinesData);
  }, [machinesData]);

  useEffect(() => {
    componentsData && setComponents(componentsData);
  }, [componentsData]);

  const handleInternalNameChange = (value) => {
    setInternalName(value);
    onChange(index, "internal_name", value);
  };
  const handleIdentifierChange = (value) => {
    setIdentifier(value);
    onChange(index, "identifier", value);
  };
  const handleMakeChange = (value) => {
    setMake(value);
    onChange(index, "make", value);
  };
  const handleModelChange = (value) => {
    setModel(value);
    onChange(index, "model", value);
  };
  const handleTypesChange = (values) => {
    let types = values && values.map((type) => type.label).join();
    setSelectedTypes(values);
    onChange(index, "type", types);
  };
  const handlePieceStateChange = (value) => {
    setPieceState(value);
    onChange(index, "piece_state", value);
  };
  const handleSpecificationsChange = (value) => {
    setSpecifications(value);
    onChange(index, "specifications", value);
  };
  const handleMaintenanceResponsibleChange = (value) => {
    setMaintenanceResponsible(value);
    onChange(index, "responsibleId", value);
  };
  const handleManufacturerChange = (value) => {
    setManufacturer(value);
    onChange(index, "manufacturer", value);
  };
  const handleProviderChange = (value) => {
    setProvider(value);
    onChange(index, "provider", value);
  };
  const handleManufacturerTypeChange = (value) => {
    setManufacturerType(value);
    onChange(index, "manufacturer_type", value);
  };
  const handleFlatNumberChange = (value) => {
    setFlatNumber(value);
    onChange(index, "flat_number", value);
  };
  const handleRelevantDataChange = (value) => {
    setRelevantData(value);
    onChange(index, "relevant_data", value);
  };

  const handleMachineIdChange = (value) => {
    setMachineId(value);
  };

  const handleComponentChange = (value) => {
    setComponent(value.toString());
    const newComponent = selectComponent(value.toString());
    setSelectedComponent(newComponent);
    setMachineId(newComponent.machineId.toString());
    onChange(index, "componentId", value);
  };

  const handleFilesChange = (value) => {
    // onChangeFiles(value);
    onChange(index, "files", value);
  };

  return (
    <Container>
      <Form.Group controlId="internal_name" className="mt-4">
        <Form.Label>*Nombre Interno</Form.Label>
        <Form.Control
          required
          type="text"
          value={internalName}
          placeholder="Ingresar nombre"
          isInvalid={submited && !internalName}
          onChange={(e) => handleInternalNameChange(e.target.value)}
        />
        <Form.Control.Feedback type="invalid">
          {"Ingrese un valor"}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="identifier" className="mt-4">
        <Form.Label>*Identificador</Form.Label>
        <Form.Control
          required
          type="text"
          value={identifier}
          isInvalid={submited && !identifier}
          placeholder="Ingrese el número de serie"
          onChange={(e) => handleIdentifierChange(e.target.value)}
        />
        <Form.Control.Feedback type="invalid">
          {"Ingrese un valor"}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="machine_id" className="mt-4">
        <Form.Label>*Asociar a la máquina</Form.Label>
        <Form.Control
          required
          as="select"
          value={machineId}
          onChange={(e) => handleMachineIdChange(e.target.value)}
          isInvalid={submited && !machineId}
        >
          <option value="" hidden>
            {"Seleccionar máquina"}
          </option>
          {machinesData.map((u, i) => (
            <option key={i} value={u.id.toString()}>
              {u.internal_name}
            </option>
          ))}
        </Form.Control>
        <Form.Control.Feedback type="invalid">
          {"Seleccione un valor"}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group controlId="component" className="mt-4">
        <Form.Label>*Asociar al Componente</Form.Label>
        <Form.Control
          as="select"
          value={component}
          onChange={(event) => handleComponentChange(event.target.value)}
          isInvalid={submited && !component}
        >
          <option value="" hidden>
            {"Seleccionar componente"}
          </option>
          {components &&
            componentsOptions(
              components.filter((component) =>
                machineId ? component.machineId.toString() === machineId : true
              )
            ).map((u, i) => (
              <option key={i} value={u.id}>
                {u.name}
              </option>
            ))}
        </Form.Control>
        <Form.Control.Feedback type="invalid">
          {"Seleccione un valor"}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group controlId="make" className="mt-4">
        <Form.Label>{selectMessage("make")}</Form.Label>
        <Form.Control
          type="text"
          value={make}
          placeholder="Ingrese la marca de la pieza"
          onChange={(e) => handleMakeChange(e.target.value)}
        />
      </Form.Group>
      <Form.Group controlId="model" className="mt-4">
        <Form.Label>{selectMessage("model")}</Form.Label>
        <Form.Control
          type="text"
          value={model}
          placeholder="Ingrese el modelo marca de la pieza"
          onChange={(e) => handleModelChange(e.target.value)}
        />
      </Form.Group>
      <Form.Group controlId="types" className="mt-4">
        <Form.Label>*Tipo de Pieza</Form.Label>
        <MultiSelect
          values={selectedTypes}
          placeholder={"Seleccione los tipos de Pieza"}
          isInvalid={submited && !selectedTypes?.length}
          options={piecesTypes.map((type) => ({
            value: type.value,
            label: type.label,
          }))}
          onChange={(types) => handleTypesChange(types)}
        />
        {submited && !selectedTypes?.length && (
          <div className="invalid-feedback d-block">
            {"Seleccione uno o más valores"}
          </div>
        )}
      </Form.Group>
      {/* <Form.Group controlId="state" className="mt-4">
          <Form.Label>*{selectMessage("state")}</Form.Label>
          <Form.Control
            as="select"
            placeholder={"Seleccionar estado"}
            value={pieceState}
            onChange={(e) => handlePieceStateChange(e.target.value)}
          >
            <option value="" hidden>
              {"Seleccionar estado"}
            </option>
            {states.map((u, i) => (
              <option key={i} value={u.id}>
                {u.name}
              </option>
            ))}
          </Form.Control>
        </Form.Group> */}
      <Form.Group controlId="specifications" className="mt-4">
        <Form.Label>Especificaciones</Form.Label>
        <TextArea
          name="specifications"
          rows={4}
          value={specifications}
          placeholder={"Especificaciones de la pieza"}
          onChange={(e) => handleSpecificationsChange(e.target.value)}
        />
      </Form.Group>
      <Form.Group controlId="workingSinceDate" className="mt-4">
        <Form.Label>*Fecha de Colocación</Form.Label>
        <br />
        <DatePicker
          date={workingSinceDate}
          onChange={(date) => handleSelectDate("working_from_date", date)}
        />
      </Form.Group>
      <Form.Group controlId="maintenanceResponsible" className="mt-4">
        <Form.Label>*{selectMessage("maintenanceResponsible")}</Form.Label>
        <br />
        <Form.Control
          as="select"
          value={maintenanceResponsible}
          isInvalid={submited && !maintenanceResponsible}
          onChange={(e) => handleMaintenanceResponsibleChange(e.target.value)}
        >
          <option value="" hidden>
            {"Seleccionar usuario"}
          </option>
          {users.map((u, i) => (
            <option key={i} value={u.id}>
              {u.name}
            </option>
          ))}
        </Form.Control>
        <Form.Control.Feedback type="invalid">
          {"Seleccione un valor"}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group controlId="manufacturer" className="mt-4">
        <Form.Label>*{selectMessage("manufacturer")}</Form.Label>
        <br />
        <Form.Control
          required
          type="text"
          value={manufacturer}
          placeholder="Ingrese el fabricante de la pieza"
          onChange={(e) => handleManufacturerChange(e.target.value)}
          isInvalid={submited && !manufacturer}
        />
        <Form.Control.Feedback type="invalid">
          {"Ingrese un valor"}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group controlId="provider" className="mt-4">
        <Form.Label>{selectMessage("provider")}</Form.Label>
        <br />
        <Form.Control
          type="text"
          value={provider}
          placeholder="Ingrese el proveedor de la pieza"
          onChange={(e) => handleProviderChange(e.target.value)}
        />
      </Form.Group>
      <Form.Group controlId="manufacturerType" className="mt-4">
        <Form.Label>*{selectMessage("manufacturerType")}</Form.Label>
        <br />
        <Form.Control
          as="select"
          value={manufacturerType}
          onChange={(e) => handleManufacturerTypeChange(e.target.value)}
          isInvalid={submited && !manufacturerType}
        >
          <option value="" hidden>
            {"Seleccionar tipo de fabricación"}
          </option>
          {manufacturerTypes.map((u, i) => (
            <option key={i} value={u.id}>
              {u.name}
            </option>
          ))}
        </Form.Control>
        <Form.Control.Feedback type="invalid">
          {"Seleccione un valor"}
        </Form.Control.Feedback>
      </Form.Group>
      {/* <Form.Group controlId="planId" className="mt-4">
        <Form.Label>{selectMessage("planId")}</Form.Label>
        <Form.Control
          required
          value={flatNumber}
          type="text"
          placeholder="Ingrese el número de plano de la pieza"
          onChange={(e) => handleFlatNumberChange(e.target.value)}
        />
      </Form.Group>
      <Form.Group controlId="relevant_data" className="mt-4">
        <Form.Label>{selectMessage("moreInfo")}</Form.Label>
        <TextArea
          name="relevant_data"
          rows={4}
          value={relevantData}
          placeholder={"Otros datos relevantes"}
          onChange={(e) => handleRelevantDataChange(e.target.value)}
        />
      </Form.Group> */}

      <div>
        <FilesUploader
          title={"Adjuntar Archivos"}
          onChange={(e) => handleFilesChange(e)}
          initFiles={pieceFiles}
          resourceId={pieceData && pieceData.id}
          placeholder={"Archivos de la Pieza"}
          onDeleteFile={onDeleteFile}
        />
      </div>
    </Container>
  );
};
