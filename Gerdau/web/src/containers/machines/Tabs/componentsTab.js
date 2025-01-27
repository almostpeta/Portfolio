import React, { useState, useEffect } from "react";
import { Form, Container, Row, Col } from "react-bootstrap";
import { Button } from "components/Button";
import { ComponentForm } from "containers/machines/Forms/Component";
import { Collapse } from "components/Collapse/index";
import { useHistory } from "react-router-dom";
import useTranslate from "hooks/useTranslate";
import { Plus } from "react-bootstrap-icons";
import { deleteComponentById } from "service/component.js";
import useUser from "hooks/useUser";

export const ComponentsTab = ({
  onChange,
  data,
  onSubmit,
  setData,
  machineData,
  usersData,
  manufacturersData,
  providersData,
  machinesData,
  isSubmitted,
  isEditing,
  files,
  onChangeFiles,
  onDeleteFile,
  deleteFiles,
  defaultOpenCollapse,
  onCancel,
  onSubmitWithVariant,
}) => {
  const setInitialComponent = () => {
    return data?.length > 0 || [];
  };

  const [components, setComponents] = useState([]);
  const [forceRerender, setForceRerender] = useState(false);
  const [users, setUsers] = useState(usersData || []);
  const [submitted, setSubmitted] = useState(isSubmitted);
  const [manufacturers, setManufacturers] = useState(manufacturersData || []);
  const [providers, setProviders] = useState(providersData || []);
  const [componentsFiles, setComponentsFiles] = useState(files || []);
  const [deletedComponentsFiles, setDeletedComponentsFiles] = useState(
    deleteFiles || []
  );
  const [machines, setMachines] = useState(machinesData);
  const machineMessages = "containers.machines.component";
  const t = useTranslate();
  const history = useHistory();

  const selectMessage = (value) => {
    return t(machineMessages.concat("." + value));
  };

  useEffect(() => {
    let cleanData = data?.length > 0 ? data : [];
    if (isEditing) {
      cleanData = cleanData.length > 0 ? cleanData : [];
    }
    setComponents(cleanData);
  }, [data]);

  useEffect(() => {
    files && setComponentsFiles(files);
  }, [files]);

  useEffect(() => {
    deleteFiles && setDeletedComponentsFiles(deleteFiles);
  }, [deleteFiles]);

  useEffect(() => {
    setSubmitted(isSubmitted);
  }, [isSubmitted]);

  useEffect(() => {
    usersData && setUsers(usersData);
  }, [usersData]);

  useEffect(() => {
    machinesData && setMachines(machinesData);
  }, [machinesData]);

  useEffect(() => {
    manufacturersData && setManufacturers(manufacturersData);
  }, [manufacturersData]);

  useEffect(() => {
    providersData && setProviders(providersData);
  }, [providersData]);

  /**
   * Deletes the component from the list & database if applies
   */
  const deleteHandler = (index) => {
    if (window.confirm(selectMessage("deleteComponentConfirmation"))) {
      const componentList = [...components];
      const componentId = componentList[index].id;
      componentList.splice(index, 1);
      setData(componentList);
      setForceRerender(true);

      if (componentId) {
        deleteComponentById(componentId)
          .then((res) => {
            deleteComponentFromList(index);
          })
          .catch((err) => {
            console.error(err);
          });
      } else {
        deleteComponentFromList(index);
      }
    }
  };

  /**
   * Delete the component from front-end only
   */
  const deleteComponentFromList = (index) => {
    const componentList = [...components];
    componentList.splice(index, 1);
    setData(componentList);
    setForceRerender(true);
  };

  const detailsHandler = (index) => {
    console.log(index);
    console.log([...components][index]);
    const componentId = [...components][index].id;
    history.push(`/component/detail/${componentId}`);
  };

  const addComponentForm = () => {
    setData([...components, {}]);
  };

  const handleOnChangeFiles = (value) => {
    const allFiles = [];
    value && value.map((file) => allFiles.push(file));
    setComponentsFiles(allFiles);
    onChangeFiles(allFiles);
  };

  const handleDeleteFile = (value) => {
    const deletedFile = value[0];
    if (deletedFile.id) {
      const deletedFilesList = [...deletedComponentsFiles];
      deletedFilesList.push({
        id: deletedFile.id,
        componentId: deletedFile.componentId,
      });
      setDeletedComponentsFiles(deletedFilesList);
      onDeleteFile(deletedFilesList);
    }
  };

  const setComponentsData = () =>
    components?.length > 0 &&
    components.map((component, index) => (
      <>
        <div style={{ marginBottom: "20px", overflowX: "scroll" }}>
          <ComponentForm
            index={index}
            onChange={onChange}
            data={data[index]}
            machineData={machineData}
            usersData={users}
            manufacturersData={manufacturers}
            machinesData={machines}
            providersData={providers}
            isSubmitted={submitted}
            isEditing={isEditing}
            onChangeFiles={(value) => handleOnChangeFiles(value)}
            onDeleteFile={(value) => handleDeleteFile(value)}
          />
        </div>
      </>
    ));

  return (
    <Container>
      <div>
        <h2 style={{ color: "#01516a" }}>
          {" "}
          {isEditing ? selectMessage("edit_title") : selectMessage("new_title")}
        </h2>
        <hr />
      </div>
      {components?.length > 0 && (
        <Collapse
          childrens={setComponentsData()}
          onDelete={(index) => deleteHandler(index)}
          onDetails={(index) => detailsHandler(index)}
          onChangeHeader={(i, v, e) => onChange(i, v, e)}
          headerPlaceholder={"Ingresar nombre interno del Componente"}
          data={components}
          defaultTitle={"Componente"}
          titleProp={"internal_name"}
          defaultActiveKey={defaultOpenCollapse}
        />
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "20px",
          height: "40px",
          alignItems: "center",
        }}
      >
        <Button onClick={() => addComponentForm()}>
          <Plus size={25} />
          Agregar Componente
        </Button>
        <div>
          <Button className="mr-2" onClick={onCancel}>
            Cancelar
          </Button>
          {!isEditing && (
            <Button
              className="mr-2"
              onClick={() => onSubmitWithVariant("piece")}
            >
              Guardar e Ingresar Piezas
            </Button>
          )}
          <Button onClick={(e) => onSubmit(e)}>Guardar</Button>
        </div>
      </div>
    </Container>
  );
};
