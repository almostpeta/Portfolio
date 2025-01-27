import React, { useState, useEffect } from "react";
import { TextArea } from "components/TextArea";
import { Form, Container } from "react-bootstrap";
import { DatePicker } from "components/UI/DatePicker/index";
import useTranslate from "hooks/useTranslate";
import { FilesUploader } from "components/FilesUploader";
import { MultiSelect } from "components/MultiSelect";
import { selectFileType, getBlobContentBase64 } from "lib/fileUtils";

export const ComponentForm = ({
  onChange,
  index,
  data,
  machineData,
  usersData,
  machinesData,
  isSubmitted,
  isEditing,
  onDeleteFile,
}) => {
  const getTypeValueByLabel = (label) => {
    const foundType = componentTypes.find((t) => t.label === label);
    return foundType?.value || -1;
  };

  const [machineId, setMachineId] = useState("");
  const [machines, setMachines] = useState(machinesData);
  const [submited, setSubmited] = useState(isSubmitted);
  const [users, setUsers] = useState([]);
  const [states] = useState([
    { name: "Producción", id: "1" },
    { name: "Mantenimiento", id: "2" },
    { name: "Fuera de uso", id: "3" },
  ]);
  const [manufacturerTypes] = useState([
    { name: "Original", id: "1" },
    { name: "Según Plano", id: "2" },
  ]);
  const [componentTypes] = useState([
    { value: "1", label: "Hidráulico" },
    { value: "2", label: "Mecánico" },
    { value: "3", label: "Neumático" },
    { value: "4", label: "Eléctrico" },
  ]);
  const [workingSinceDate, setWorkingSinceDate] = useState(new Date());

  const [internalName, setInternalName] = useState("");
  const [componentFiles, setComponentFiles] = useState([]);
  const [serieNumber, setSerieNumber] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [componentState, setComponentState] = useState("");
  const [description, setDescription] = useState("");
  const [manufacturerType, setManufacturerType] = useState("");
  const [maintenanceResponsible, setMaintenanceResponsible] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [provider, setProvider] = useState("");
  const [relevantData, setRelevantData] = useState("");

  const machineMessages = "containers.machines.machine";
  const t = useTranslate();

  const selectMessage = (value) => t(machineMessages.concat("." + value));

  useEffect(() => {
    usersData && setUsers(usersData);
  }, [usersData]);

  useEffect(() => {
    isSubmitted && setSubmited(isSubmitted);
  }, [isSubmitted]);

  useEffect(() => {
    machinesData && setMachines(machinesData);
  }, [machinesData]);

  const setTypes = (types) => {
    if (!types) return;

    types = types.split(",");
    const typesLst = [];
    types.forEach((t) => {
      const value = getTypeValueByLabel(t);
      if (value >= 0) {
        typesLst.push({
          label: t,
          value,
        });
      }
    });

    setSelectedTypes(typesLst);
  };

  useEffect(() => {
    if (data && Object.keys(data).length > 0) {
      setInternalName(data.internal_name);
      setMachineId(data.machine || data.machineId);
      setSerieNumber(data.serie_number);
      setMake(data.make);
      setModel(data.model);
      setDescription(data.description);
      setManufacturer(data.manufacturer);
      setProvider(data.provider);
      setRelevantData(data.relevant_data);
      setTypes(data.type);
      setComponentState(data.state);
      setManufacturerType(data.manufacturer_type);
      setWorkingSinceDate(new Date(data.working_from_date));
      setMaintenanceResponsible(
        data.responsibleId || data.maintenance_responsible
      );
    }
  }, [data]);

  useEffect(() => {
    if (data && isEditing) {
      setComponentFiles(
        data.componentFiles?.map((file) => {
          if (file instanceof File) {
            return file;
          } else {
            return {
              id: file.id,
              componentId: file.componentId,
              name: file.name || file.file,
              url: file.url || getBlobContentBase64(file),
              customType: file.customType || selectFileType(file.file),
            };
          }
        }) || []
      );
    }
  }, [data]);

  const handleFilesChange = (value) => {
    onChange(index, "files", value);
  };

  useEffect(() => {
    onChange(index, "internal_name", internalName);
  }, [internalName]);

  useEffect(() => {
    onChange(index, "machineId", machineId);
  }, [machineId]);

  useEffect(() => {
    onChange(index, "serie_number", serieNumber);
  }, [serieNumber]);

  useEffect(() => {
    onChange(index, "make", make);
  }, [make]);

  useEffect(() => {
    onChange(index, "model", model);
  }, [model]);

  useEffect(() => {
    onChange(index, "description", description);
  }, [description]);

  useEffect(() => {
    onChange(index, "manufacturer", manufacturer);
  }, [manufacturer]);

  useEffect(() => {
    onChange(index, "provider", provider);
  }, [provider]);

  useEffect(() => {
    onChange(index, "relevant_data", relevantData);
  }, [relevantData]);

  useEffect(() => {
    onChange(index, "working_from_date", workingSinceDate);
  }, [workingSinceDate]);

  useEffect(() => {
    const cleanTypes =
      selectedTypes && selectedTypes.map((t) => t.label).join(",");
    onChange(index, "type", cleanTypes);
  }, [selectedTypes]);

  useEffect(() => {
    onChange(index, "state", componentState);
  }, [componentState]);

  useEffect(() => {
    onChange(index, "manufacturer_type", manufacturerType);
  }, [manufacturerType]);

  useEffect(() => {
    onChange(index, "responsibleId", maintenanceResponsible);
  }, [maintenanceResponsible]);

  return (
    <Container>
      <Form>
        <Form.Group controlId="internal_name" className="mt-4">
          <Form.Label>*Nombre Interno</Form.Label>
          <Form.Control
            required
            type="text"
            value={internalName}
            placeholder="Ingresar nombre"
            isInvalid={submited && !internalName}
            onChange={(e) => setInternalName(e.target.value)}
          />
          <Form.Control.Feedback type="invalid">
            {"Ingrese un valor"}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="machine_id" className="mt-4">
          <Form.Label>*Máquina</Form.Label>
          <Form.Control
            required
            as="select"
            isInvalid={submited && !machineId}
            onChange={(e) => setMachineId(e.target.value)}
            value={machineId}
          >
            <option value="" hidden>
              {"Seleccionar máquina"}
            </option>
            {machines &&
              machines.map((u, i) => (
                <option key={i} value={u.id}>
                  {u.internal_name}
                </option>
              ))}
          </Form.Control>
          <Form.Control.Feedback type="invalid">
            {"Seleccione un valor"}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="serieNumber" className="mt-4">
          <Form.Label>*{selectMessage("serieNumber")}</Form.Label>
          <Form.Control
            required
            type="text"
            value={serieNumber}
            placeholder="Ingrese el número de serie"
            isInvalid={submited && !serieNumber}
            onChange={(e) => setSerieNumber(e.target.value)}
          />
          <Form.Control.Feedback type="invalid">
            {"Ingrese un valor"}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="make" className="mt-4">
          <Form.Label>{selectMessage("make")}</Form.Label>
          <Form.Control
            type="text"
            value={make}
            placeholder="Ingrese la marca del componente"
            onChange={(e) => setMake(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="model" className="mt-4">
          <Form.Label>{selectMessage("model")}</Form.Label>
          <Form.Control
            type="text"
            value={model}
            placeholder="Ingrese el modelo del componente"
            onChange={(e) => setModel(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="type" className="mt-4">
          <Form.Label>*Tipo de Componente</Form.Label>
          <MultiSelect
            values={selectedTypes}
            isInvalid={submited && selectedTypes?.length === 0}
            placeholder={"Seleccione los tipos de Componente"}
            options={componentTypes.map((type) => ({
              value: type.value,
              label: type.label,
            }))}
            values={selectedTypes}
            onChange={(types) => setSelectedTypes(types)}
          />
          {submited && selectedTypes?.length === 0 && (
            <div className="invalid-feedback d-block">
              {"Seleccione uno o más valores"}
            </div>
          )}
        </Form.Group>
        <Form.Group controlId="state" className="mt-4">
          <Form.Label>*{selectMessage("state")}</Form.Label>
          <Form.Control
            as="select"
            value={componentState}
            onChange={(e) => setComponentState(e.target.value)}
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
        </Form.Group>

        <Form.Group controlId="description" className="mt-4">
          <Form.Label>Descripción</Form.Label>
          <TextArea
            name="description"
            rows={4}
            value={description}
            placeholder={"Descripción"}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="manufacturerType" className="mt-4">
          <Form.Label>*{selectMessage("manufacturerType")}</Form.Label>
          <br />
          <Form.Control
            as="select"
            onChange={(e) => setManufacturerType(e.target.value)}
            value={manufacturerType}
            isInvalid={submited && !manufacturerType}
          >
            <option value="" hidden>
              {"Seleccionar Tipo de fabricación"}
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

        <Form.Group controlId="workingSinceDate" className="mt-4">
          <Form.Label>*Fecha de Colocación</Form.Label>
          <br />
          <DatePicker
            date={workingSinceDate}
            onChange={(date) => setWorkingSinceDate(date)}
          />
        </Form.Group>
        <Form.Group controlId="maintenanceResponsible" className="mt-4">
          <Form.Label>*{selectMessage("maintenanceResponsible")}</Form.Label>
          <br />
          <Form.Control
            as="select"
            onChange={(e) => setMaintenanceResponsible(e.target.value)}
            isInvalid={submited && !maintenanceResponsible}
            value={maintenanceResponsible}
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
            placeholder="Ingrese el fabricante del componente"
            onChange={(e) => setManufacturer(e.target.value)}
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
            placeholder="Ingrese el proveedor del componente"
            onChange={(e) => setProvider(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="relevant_data" className="mt-4">
          <Form.Label>{selectMessage("moreInfo")}</Form.Label>
          <TextArea
            name="relevant_data"
            rows={4}
            value={relevantData}
            placeholder={"Otros datos relevantes"}
            onChange={(e) => setRelevantData(e.target.value)}
          />
        </Form.Group>
      </Form>

      <div>
        <FilesUploader
          title={"Adjuntar Archivos"}
          onChange={(e) => handleFilesChange(e)}
          placeholder={"Archivos del Componente"}
          initFiles={componentFiles}
          resourceId={data && data.id}
          onDeleteFile={onDeleteFile}
        />
      </div>
    </Container>
  );
};
