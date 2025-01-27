import React, { useState } from "react";
import { Container, Row } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { editUser } from "service/users";
import { Toast } from "components/Toast";
import Form from "containers/User/Form";

const EditUser = ({ user, setIsLoading }) => {
  const history = useHistory();

  const handleCancel = () => {
    history.goBack();
  };

  const handleSubmit = async (inputs) => {
    try {
      setIsLoading(true);
      await editUser(inputs);
      history.push("/admin/user/list");
      Toast("success", "Se ha guardado correctamente");
    } catch (e) {
      Toast("error", e.message);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Container>
        <Row className="ml-0 mt-5 text-left">
          <h2 style={{ color: "#01516a" }}>Editar Usuario</h2>
          <hr />
        </Row>
        <Form
          initValues={user}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
        />
      </Container>
    </>
  );
};

export default EditUser;
