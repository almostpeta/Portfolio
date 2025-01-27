import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Button } from "components/Button";
import { WarningAlert } from "components/UI/Alert";
import useTranslate from "hooks/useTranslate";
import { ModalComponent } from "components/Modal/Modal";
import {
  disableUser,
  enableUser,
  forgetPassword as resetPassword,
} from "service/users";
import { Toast } from "components/Toast";
import Table from "./Table";

const List = ({ users, setIsLoading, forceRefresh }) => {
  const history = useHistory();
  const t = useTranslate();
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({});

  const message = (value) => t(`containers.users.list.${value}`);

  const handleStatusChangeConfirm = async (user) => {
    try {
      setIsLoading(true);

      user.isActive ? await disableUser(user) : await enableUser(user);
      setIsLoading(false);
      Toast("success", message("disable_user_success"));
      forceRefresh();
    } catch (e) {
      Toast("error", message("disable_user_error"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditUser = (user) => {
    history.push(`/admin/user/edit/${user.id}`);
  };

  const handleStatusChange = (user) => {
    const _modalContent = {
      title: user.isActive ? message("disable_title") : message("enable_title"),
      content: (
        <div>
          {user.isActive
            ? message("disable_user_confirmation")
                .replace("${name}", user.name)
                .replace("${email}", user.email)
            : message("enable_user_confirmation")
                .replace("${name}", user.name)
                .replace("${email}", user.email)}
        </div>
      ),
      footer: (
        <>
          <Button
            variant="outline-danger"
            onClick={() => handleStatusChangeConfirm(user)}
          >
            {user.isActive
              ? message("disable_user_btn")
              : message("enable_user_btn")}
          </Button>
          <Button onClick={() => setShowModal(false)}>
            {message("cancel_btn")}
          </Button>
        </>
      ),
    };
    setModalContent(_modalContent);
    setShowModal(true);
  };

  const handleResetPasswordConfirm = async (user) => {
    try {
      setIsLoading(true);
      console.log(user);
      await resetPassword(user);
      setIsLoading(false);
      Toast("success", message("reset_password_success"));
      forceRefresh();
    } catch (e) {
      Toast("error", message("reset_password_error"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = (user) => {
    const _modalContent = {
      title: message("reset_password_title"),
      content: (
        <div>
          {user.isActive
            ? message("reset_password_confirmation")
                .replace("${name}", user.name)
                .replace("${email}", user.email)
            : message("reset_password_disabled_user")
                .replace("${name}", user.name)
                .replace("${email}", user.email)}
        </div>
      ),
      footer: (
        <>
          {user.isActive && (
            <Button
              variant="outline-danger"
              onClick={() => handleResetPasswordConfirm(user)}
            >
              {message("reset_password_btn")}
            </Button>
          )}
          <Button onClick={() => setShowModal(false)}>
            {message("cancel_btn")}
          </Button>
        </>
      ),
    };
    setModalContent(_modalContent);
    setShowModal(true);
  };

  return (
    <div className="w-100 mt-3 vh-100 p-4">
      <div className="d-block ml-3 mr-3">
        <h2 style={{ color: "#01516a" }}>Usuarios</h2>
        <hr />
      </div>
      <div className="d-flex justify-content-end">
        <Button onClick={() => history.push("/admin/user/new")}>
          {message("register_user_btn")}
        </Button>
      </div>
      <div className="pt-3">
        {users?.length > 0 && (
          <Table
            users={users}
            actions={{
              resetPassword: handleResetPassword,
              disable: handleStatusChange,
              editUser: handleEditUser,
            }}
            message={message}
          />
        )}
        {(!users || users.length === 0) && (
          <WarningAlert title={message("not_found")} />
        )}
      </div>
      <ModalComponent
        show={showModal}
        onClose={() => setShowModal(false)}
        children={modalContent.content}
        title={modalContent.title}
        footer={modalContent.footer}
        style={{ backgroundColor: "white" }}
      />
    </div>
  );
};

export default List;
