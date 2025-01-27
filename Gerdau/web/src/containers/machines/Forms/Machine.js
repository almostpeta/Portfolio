import React, { useState, useEffect } from "react";
import { Form, Container, Row, Col } from "react-bootstrap";
import { Loading } from "components/Loading/index";
import { DatePicker } from "components/UI/DatePicker/index";
import { TextArea } from "components/TextArea";
import { Button } from "components/Button";
import { getAllSublevelsByArea } from "service/sublevel.js";
import { getAllAreasByPlant } from "service/area.js";
import useTranslate from "hooks/useTranslate";
import { FilesUploader } from "components/FilesUploader";
import { MultiSelect } from "components/MultiSelect";
import {
  selectFileMimeType,
  selectFileType,
  getBlobContentBase64,
} from "lib/fileUtils";

export const MachineForm = ({
  data,
  onChange,
  onSubmit,
  onSubmitWithVariant,
  onCancel,
  usersData,
  plantsData,
  sublevelsData,
  areasData,
  isSubmited,
  isEditing,
  files,
  onChangeFiles,
  onDeleteFile,
  deleteFiles,
  allStages,
}) => {
  const t = useTranslate();

  const [machineData, setMachineData] = useState(data);
  const [internalName, setInternalName] = useState(
    machineData["internal_name"]
  );

  //searchs a value in a list by name
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
  const [serieNumber, setSerieNumber] = useState(machineData["serie_number"]);
  const [machineFiles, setMachineFiles] = useState(files || []);
  const [machineDeletedFiles, setMachineDeletedFiles] = useState(
    deleteFiles || []
  );
  const [users, setUsers] = useState(usersData || []);
  const [floors, setFloors] = useState(plantsData || []);
  const [areas, setAreas] = useState(areasData || []);
  const [sublevels, setSublevels] = useState(sublevelsData || []);
  const [make, setMake] = useState(machineData["make"]);
  const [model, setModel] = useState(machineData["model"]);
  const [floor, setFloor] = useState(machineData["plant"]);
  const [submited, setSubmited] = useState(isSubmited);
  const [area, setArea] = useState(machineData["area"]);
  const [stages, setStages] = useState(machineData["stages"] || []);

  const [machineTypes, setMachineTypes] = useState([
    { label: "Hidráulica", value: "1" },
    { label: "Mecánica", value: "2" },
    { label: "Neumática", value: "3" },
    { label: "Eléctrica", value: "4" },
  ]);

  const [selectedTypes, setSelectedTypes] = useState(
    machineData["type"] &&
      searchTypes(machineData["type"].split(","), machineTypes)
  );
  const [states, setStates] = useState([
    { name: "Producción", id: "1" },
    { name: "Mantenimiento", id: "2" },
    { name: "Detenida", id: "3" },
  ]);
  const [state, setState] = useState(machineData["state"]);
  const [description, setDescription] = useState(machineData["description"]);
  const [flatNumber, setFlatNumber] = useState(machineData["flat_number"]);
  const [purchaseNumber, setPurchaseNumber] = useState(
    machineData["purchase_number"]
  );
  const [manufacturerTypes, setManufacturerTypes] = useState([
    { name: "Original", id: "1" },
    { name: "Según Plano", id: "2" },
  ]);
  const [manufacturerType, setManufacturerType] = useState(
    machineData["manufacturer_type"]
  );
  const [maintenanceResponsible, setMaintenanceResponsible] = useState(
    machineData["maintenance_responsible"]
  );

  const [manufacturer, setManufacturer] = useState(machineData["manufacturer"]);

  const [workingFromDate, setWorkingFromDate] = useState(
    (machineData["working_from_date"] &&
      new Date(machineData["working_from_date"])) ||
      new Date()
  );

  const [relevantData, setRelevantData] = useState(
    machineData["relevant_data"]
  );
  const [scale, setScale] = useState(1);
  const [sublevel, setSublevel] = useState(machineData["sublevel"]);

  const [isLoading, setIsLoading] = useState(false);

  const [forceRerender, setForceRerender] = useState(false);

  const [randomKey, setRandomKey] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState({});

  const machineMessages = "containers.machines.machine";

  const selectMessage = (value) => t(machineMessages.concat("." + value));

  useEffect(() => {
    usersData && setUsers(usersData);
  }, [usersData]);

  useEffect(() => {
    isSubmited && setSubmited(isSubmited);
  }, [isSubmited]);

  useEffect(() => {
    plantsData && setFloors(plantsData);
  }, [plantsData]);

  useEffect(() => {
    areasData && setAreas(areasData);
  }, [areasData]);

  useEffect(() => {
    sublevelsData && setSublevels(sublevelsData);
  }, [sublevelsData]);

  useEffect(() => {
    deleteFiles && setMachineDeletedFiles(deleteFiles);
  }, [deleteFiles]);

  useEffect(() => {
    data && setMachineData(data);
    if (data && isEditing) {
      setInternalName(data.internal_name);
      setSerieNumber(data.serie_number);
      setPurchaseNumber(data.purchase_number);
      setDescription(data.description);
      setRelevantData(data.relevant_data);
      data.working_from_date &&
        setWorkingFromDate(new Date(data.working_from_date));
      setMake(data.make);
      setArea(data.area);
      setModel(data.model);
      setSublevel(data.sublevel);
      setFloor(data.plant);
      setMaintenanceResponsible(data.maintenance_responsible);
      setManufacturer(data.manufacturer);
      setStages(data.stages);
      const selectedManufacturerType = selectOption(
        data.manufacturer_type,
        manufacturerTypes,
        "id"
      );
      data.type &&
        setSelectedTypes(searchTypes(data.type.split(","), machineTypes));
      const selectedState = selectOption(data.state, states, "id");
      selectedState && setState(selectedState.id);
      selectedManufacturerType &&
        setManufacturerType(selectedManufacturerType.id);
    }
  }, [data, isEditing]);

  useEffect(() => {
    if (files && isEditing) {
      setMachineFiles(
        files.map((file) => {
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
        })
      );
    }
  }, [files]);

  useEffect(() => {
    if (!randomKey) {
      setRandomKey(Math.random().toString(36));
    }
    if (forceRerender) {
      setForceRerender(false);
    }
  }, [forceRerender, randomKey]);

  const handleInternalNameChange = (value) => {
    setInternalName(value);
    onChange("internal_name", value);
  };
  const handleserieNumberChange = (value) => {
    setSerieNumber(value);
    onChange("serie_number", value);
  };

  const handleDeleteFile = (value) => {
    const deletedFile = value[0];
    if (deletedFile.id) {
      const deletedFilesList = [...machineDeletedFiles];
      deletedFilesList.push(deletedFile.id);
      setMachineDeletedFiles(deletedFilesList);
      onDeleteFile(deletedFilesList);
    }
  };

  const handleMakeChange = (value) => {
    setMake(value);
    onChange("make", value);
  };

  const handleModelChange = (value) => {
    setModel(value);
    onChange("model", value);
  };

  const handleFloorChange = (value) => {
    setFloor(value);
    onChange("plant", value);
    setAreasByFloor(value);
  };

  const setAreasByFloor = async (floorId) => {
    setAreas([]);
    handleAreaChange(null);
    const availableFloors = await getAllAreasByPlant(floorId);
    setAreas(availableFloors);
  };

  const handleAreaChange = (value) => {
    setArea(value);
    onChange("area", value);
    setSublevelsByArea(value);
  };

  const setSublevelsByArea = async (areaId) => {
    handleSublevelChange(null);
    setSublevels([]);
    const availableSublevels = await getAllSublevelsByArea(areaId);
    setSublevels(availableSublevels);
  };

  const handleSublevelChange = (value) => {
    setSublevel(value);
    onChange("sublevel", value);
  };
  const handleStateChange = (value) => {
    setState(value);
    onChange("state", value);
  };
  const handleDescriptionChange = (value) => {
    setDescription(value);
    onChange("description", value);
  };
  const handleFlatNumberChange = (value) => {
    setFlatNumber(value);
    onChange("flat_number", value);
  };
  const handlePurchaseNumberChange = (value) => {
    setPurchaseNumber(value);
    onChange("purchase_number", value);
  };
  const handleManufacturerTypeChange = (value) => {
    setManufacturerType(value);
    onChange("manufacturer_type", value);
  };
  const handleManufacturerChange = (value) => {
    setManufacturer(value);

    onChange("manufacturer", value);
  };
  const handleTypesChange = (values) => {
    let types = values && values.map((type) => type.label).join();
    setSelectedTypes(values);
    onChange("type", types);
  };
  const handleStagesChange = (values) => {
    setStages(values);
    onChange(
      "stages",
      values.map((s) => s.value)
    );
  };
  const handleWorkingFromDateChange = (value) => {
    setWorkingFromDate(value);
    onChange("working_from_date", value);
  };
  const handleRelevantDataChange = (value) => {
    setRelevantData(value);
    onChange("relevant_data", value);
  };
  const handleMaintenanceResponsibleChange = (value) => {
    setMaintenanceResponsible(value);
    onChange("maintenance_responsible", value);
  };

  const handleFilesChange = (value) => {
    onChangeFiles(value);
    onChange("files", value);
  };

  const App = () => {
    return (
      <>
        {isLoading && <Loading />}
        {!isLoading && (
          <Container>
            <div>
              <h2 style={{ color: "#01516a" }}>
                {isEditing
                  ? selectMessage("edit_title")
                  : selectMessage("new_title")}
              </h2>
              <hr />
            </div>
            <Form>
              <Row className="flex space-around text-left">
                <Col lg="6" marginRight={"1000px"}>
                  <Form.Group controlId="name" className="mt-4">
                    <Form.Label>*{selectMessage("name")}</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Nombre interno"
                      onChange={(e) => handleInternalNameChange(e.target.value)}
                      value={internalName}
                      isInvalid={submited && !internalName}
                    />
                    <Form.Control.Feedback type="invalid">
                      {"Ingrese un valor"}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group controlId="make" className="mt-4">
                    <Form.Label>{selectMessage("make")}</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Marca"
                      onChange={(e) => handleMakeChange(e.target.value)}
                      value={make}
                    />
                  </Form.Group>
                </Col>
                <Col lg="6">
                  <Form.Group controlId="serie_number" className="mt-4">
                    <Form.Label>*{selectMessage("serieNumber")}</Form.Label>
                    <Form.Control
                      required
                      type="text"
                      placeholder="Ingrese el número de serie"
                      onChange={(e) => handleserieNumberChange(e.target.value)}
                      value={serieNumber}
                      isInvalid={submited && !serieNumber}
                    />
                    <Form.Control.Feedback type="invalid">
                      {"Ingrese un valor"}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group controlId="model" className="mt-4">
                    <Form.Label>{selectMessage("model")}</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Modelo"
                      onChange={(e) => handleModelChange(e.target.value)}
                      value={model}
                    />
                  </Form.Group>
                </Col>
                <Col lg="6">
                  <Form.Group controlId="floor" className="mt-4">
                    <Form.Label>*{selectMessage("floor")}</Form.Label>
                    <Form.Control
                      as="select"
                      value={floor}
                      isInvalid={submited && !floor}
                      onChange={(e) => handleFloorChange(e.target.value)}
                    >
                      <option value="" hidden>
                        {"Seleccionar planta"}
                      </option>
                      {floors &&
                        floors.map((u, i) => (
                          <option key={i} value={u.id}>
                            {u.name}
                          </option>
                        ))}
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                      {"Seleccione un valor"}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group controlId="sublevel" className="mt-4">
                    <Form.Label>*{selectMessage("sublevel")}</Form.Label>
                    <Form.Control
                      as="select"
                      value={sublevel}
                      isInvalid={submited && !sublevel}
                      onChange={(event) =>
                        handleSublevelChange(event.target.value)
                      }
                    >
                      <option value="" hidden>
                        {"Seleccionar subnivel"}
                      </option>
                      {sublevels &&
                        sublevels.map((u, i) => (
                          <option key={i} value={u.id}>
                            {u.name}
                          </option>
                        ))}
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                      {"Seleccione un valor"}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col lg="6">
                  <Form.Group controlId="area" className="mt-4">
                    <Form.Label>*{selectMessage("area")}</Form.Label>
                    <Form.Control
                      as="select"
                      value={area}
                      isInvalid={submited && !area}
                      onChange={(event) => handleAreaChange(event.target.value)}
                    >
                      <option value="" hidden>
                        {"Seleccionar área"}
                      </option>
                      {areas &&
                        areas.map((u, i) => (
                          <option key={i} value={u.id}>
                            {u.name}
                          </option>
                        ))}
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                      {"Seleccione un valor"}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group controlId="state" className="mt-4">
                    <Form.Label>*{selectMessage("state")}</Form.Label>
                    <Form.Control
                      as="select"
                      value={state}
                      isInvalid={submited && !state}
                      onChange={(e) => handleStateChange(e.target.value)}
                    >
                      <option value="" hidden>
                        {"Seleccionar estado"}
                      </option>
                      {states &&
                        states.map((u, i) => (
                          <option key={i} value={u.id}>
                            {u.name}
                          </option>
                        ))}
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                      {"Ingrese un valor"}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col lg="12">
                  <Form.Group
                    controlId="description"
                    className="mt-4"
                    style={{ height: "100%" }}
                  >
                    <Form.Label>{selectMessage("description")}</Form.Label>
                    <TextArea
                      name="Description"
                      rows={4}
                      value={description}
                      placeholder={"Descripción"}
                      onChange={(e) => handleDescriptionChange(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col lg="6">
                  <Form.Group controlId="planId" className="mt-4">
                    <Form.Label>{selectMessage("planId")}</Form.Label>
                    <Form.Control
                      required
                      type="text"
                      value={flatNumber}
                      placeholder="Ingrese el número de plano de la máquina"
                      onChange={(e) => handleFlatNumberChange(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group controlId="purchaseNumber" className="mt-4">
                    <Form.Label>*{selectMessage("purchaseNumber")}</Form.Label>
                    <Form.Control
                      required
                      type="text"
                      value={purchaseNumber}
                      placeholder="Ingrese el número de compra de la máquina"
                      isInvalid={submited && !purchaseNumber}
                      onChange={(e) =>
                        handlePurchaseNumberChange(e.target.value)
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {"Ingrese un valor"}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group
                    controlId="maintenanceResponsible"
                    className="mt-4"
                  >
                    <Form.Label>
                      *{selectMessage("maintenanceResponsible")}
                    </Form.Label>
                    <br />
                    <Form.Control
                      as="select"
                      value={maintenanceResponsible}
                      onChange={(e) =>
                        handleMaintenanceResponsibleChange(e.target.value)
                      }
                      isInvalid={submited && !maintenanceResponsible}
                    >
                      <option value="" hidden>
                        {"Seleccionar Usuario"}
                      </option>
                      {users &&
                        users.map((u, i) => (
                          <option key={i} value={u.id}>
                            {u.name}
                          </option>
                        ))}
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                      {"Seleccione uno o más usuarios"}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group controlId="types" className="mt-4">
                    <Form.Label>*Tipo de Máquina</Form.Label>
                    <MultiSelect
                      values={selectedTypes}
                      placeholder={"Seleccione los tipos de Máquina"}
                      options={machineTypes.map((type) => ({
                        value: type.value,
                        label: type.label,
                      }))}
                      isInvalid={submited && !selectedTypes?.length}
                      onChange={(types) => handleTypesChange(types)}
                    />
                    {submited && !selectedTypes?.length && (
                      <div className="invalid-feedback d-block">
                        {"Seleccione uno o más valores"}
                      </div>
                    )}
                  </Form.Group>
                </Col>
                <Col lg="6">
                  <Form.Group controlId="manufacturerType" className="mt-4">
                    <Form.Label>
                      *{selectMessage("manufacturerType")}
                    </Form.Label>
                    <br />
                    <Form.Control
                      as="select"
                      value={manufacturerType}
                      isInvalid={submited && !manufacturerType}
                      onChange={(e) =>
                        handleManufacturerTypeChange(e.target.value)
                      }
                    >
                      <option value="" hidden>
                        {"Seleccionar tipo de fabricación"}
                      </option>
                      {manufacturerTypes &&
                        manufacturerTypes.map((u, i) => (
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
                      type="text"
                      placeholder="Fabricante"
                      onChange={(e) => handleManufacturerChange(e.target.value)}
                      value={manufacturer}
                      isInvalid={submited && !manufacturer}
                    />
                    <Form.Control.Feedback type="invalid">
                      {"Ingrese un valor"}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group controlId="workingFromDate" className="mt-4">
                    <Form.Label>*{selectMessage("workingFromDate")}</Form.Label>
                    <br />
                    <DatePicker
                      date={workingFromDate}
                      onChange={(date) => handleWorkingFromDateChange(date)}
                    />
                  </Form.Group>
                  <Form.Group controlId="types" className="mt-4">
                    <Form.Label>*Etapas de Proceso</Form.Label>
                    <MultiSelect
                      values={stages}
                      placeholder={"Seleccione las etapas de proceso"}
                      options={allStages?.map((stage) => ({
                        value: stage.id,
                        label: stage.name,
                      }))}
                      isInvalid={submited && !stages?.length}
                      onChange={(stages) => handleStagesChange(stages)}
                    />
                    {submited && !selectedTypes?.length && (
                      <div className="invalid-feedback d-block">
                        {"Seleccione uno o más valores"}
                      </div>
                    )}
                  </Form.Group>
                </Col>
                <div>
                  <FilesUploader
                    title={"Adjuntar Archivos"}
                    onChange={(e) => handleFilesChange(e)}
                    placeholder={"Máquina 1"}
                    initFiles={machineFiles}
                    onDeleteFile={handleDeleteFile}
                  />
                </div>
                <Col lg="12">
                  <Form.Group controlId="moreInfo" className="mt-4">
                    <Form.Label>{selectMessage("moreInfo")}</Form.Label>
                    <TextArea
                      name="moreInfo"
                      rows={4}
                      value={relevantData}
                      placeholder={"Describa otros datos relevantes"}
                      onChange={(e) => handleRelevantDataChange(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button onClick={onCancel} className="mr-2">
                  Cancelar
                </Button>
                {!isEditing && (
                  <Button
                    onClick={() => onSubmitWithVariant("component")}
                    className="mr-2"
                  >
                    Guardar e Ingresar Componentes
                  </Button>
                )}
                <Button onClick={(e) => onSubmit(e)}>Guardar</Button>
              </div>
            </Form>
          </Container>
        )}
      </>
    );
  };

  return <div>{App()}</div>;
};

export default MachineForm;
