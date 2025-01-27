import React, { useState } from "react";
import { Container, Row } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { createTask } from "service/task";
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
      const task = await createTask(inputs);
      history.push(`/task/detail/${task.id}`);
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
        initValues={initValues}
      />
    </Container>
  );
};

export default NewTask;
