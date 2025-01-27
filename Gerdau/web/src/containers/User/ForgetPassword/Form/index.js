import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { forgetPassword } from "service/users";
import { Loading } from "components/Loading";
import { Toast } from "components/Toast";
import useTranslate from "hooks/useTranslate";
import Form from "./Form";

const ForgetPassword = ({ props }) => {
  const email = props.location?.state?.email;
  const history = useHistory();
  const t = useTranslate();

  const initialValues = email && {
    email,
  };

  const label = (field) => t(`containers.forget_password.form.${field}`);

  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (inputs) => {
    try {
      setIsLoading(true);
      console.log("ffff");
      console.log(inputs);
      await forgetPassword(inputs);
      history.push("/login");
      Toast("success", label("submit_success"));
    } catch (e) {
      console.log(e.message);
      Toast("error", label("submit_error"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    history.push("/login");
  };

  return (
    <>
      {isLoading && <Loading />}
      <Form
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        initialValues={initialValues}
      />
    </>
  );
};

export default ForgetPassword;
