import React, { useState } from "react";
import { Container, Row } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { editTask } from "service/task";
import { Loading } from "components/Loading";
import { Toast } from "components/Toast";
import useTranslate from "hooks/useTranslate";
import Form from "containers/Task/Form";

const NewTask = ({ datalists, initValues }) => {
  const history = useHistory();
  const t = useTranslate();

  const label = (field) => t(`containers.tasks.form.${field}`);

  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (inputs) => {
    try {
      setIsLoading(true);
      await editTask(inputs);
      history.push(`/task/detail/${initValues.id}`);
      Toast("success", label("submit_success"));
    } catch (e) {
      Toast("error", label("submit_error"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    history.goBack();
  };

  return (
    <Container fluid>
      {isLoading && <Loading />}
      <Form
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        datalists={datalists}
        isEditing={true}
        initValues={{
          ...initValues,
          responsibleId:
            initValues?.responsible.id && `${initValues.responsible.id}`,
          requestedId: initValues?.requested.id && `${initValues.requested.id}`,
          machineId: initValues?.machine?.id && `${initValues.machine.id}`,
          componentId:
            initValues?.component?.id && `${initValues.component.id}`,
          pieceId: initValues?.piece?.id && `${initValues.piece.id}`,
        }}
      />
    </Container>
  );
};

export default NewTask;
