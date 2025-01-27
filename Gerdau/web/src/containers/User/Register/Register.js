import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { register } from "service/users";
import { Loading } from "components/Loading";
import { Toast } from "components/Toast";
import useTranslate from "hooks/useTranslate";
import Form from "containers/User/Form";

const Register = () => {
  const history = useHistory();
  const t = useTranslate();

  const label = (field) => t(`containers.register.form.${field}`);

  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (inputs) => {
    try {
      setIsLoading(true);
      await register(inputs);
      history.push("/admin/user/list");
      Toast("success", label("submit_success"));
    } catch (err) {
      if (/Email already exists/.test(err)) {
        Toast("error", "El email ya está en uso");
      } else {
        Toast("error", label("submit_error"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    history.goBack();
  };

  return (
    <>
      {isLoading && <Loading />}
      <Form onSubmit={handleSubmit} onCancel={handleCancel} />
    </>
  );
};

export default Register;
