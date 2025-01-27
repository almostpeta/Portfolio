import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { resetPassword } from "service/users";
import { Loading } from "components/Loading";
import { Toast } from "components/Toast";
import useTranslate from "hooks/useTranslate";
import Form from "./Form";

const ResetPassword = ({ isNewUser, token }) => {
  const history = useHistory();
  const t = useTranslate();

  const label = (field) =>
    isNewUser
      ? t(`containers.reset_password.confirm_register_form.${field}`)
      : t(`containers.reset_password.form.${field}`);

  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (inputs) => {
    try {
      setIsLoading(true);
      const data = {
        ...inputs,
        token,
      };

      await resetPassword(data); // TODO set token when response success
      history.push("/home");
      Toast("success", label("submit_success"));
    } catch (e) {
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
        isNewUser={isNewUser}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </>
  );
};

export default ResetPassword;
