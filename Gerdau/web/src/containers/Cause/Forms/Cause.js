import React, { useState } from "react";
import { Container, Row } from "react-bootstrap";
import { deleteCause, changeCauseStatus, resendCause } from "service/cause";
import { useHistory } from "react-router-dom";
import useTranslate from "hooks/useTranslate";
import { DetailBox } from "components/DetailBox";
import RejectModal from "components/UI/RejectModal";
import { Toast } from "components/Toast";
import { CAUSE_STATUSES } from "utils/constants";
import {
  EditBtn,
  DeleteBtn,
  ApproveBtn,
  RejectBtn,
  ResendCauseBtn,
} from "components/UI/ActionBtn";
import useUser from "hooks/useUser";

const selectState = (state) => {
  let color = "";
  let background = "";
  switch (state?.toLowerCase()) {
    case CAUSE_STATUSES.APPROVED.toLowerCase():
      color = "#136401";
      background = "#EAFAF1";
      break;
    case CAUSE_STATUSES.REQUESTED.toLowerCase():
      background = "#FDF2E9";
      color = "#DC7633";
      break;
    case CAUSE_STATUSES.REJECTED.toLowerCase():
      background = "#F9EBEA";
      color = "#A2331A";
      break;
  }
  return { background, color };
};

const getDetailValues = (cause, selectMessage) => [
  {
    label: `${selectMessage("name")}: `,
    value: cause.name,
  },
  {
    label: `${selectMessage("description")}: `,
    value: cause.description,
  },
  {
    label: `${selectMessage("user")}: `,
    value: cause?.requested?.name,
  },
  {
    label: `${selectMessage("status")}: `,
    value: cause.status,
    variant: "state",
    color: selectState(cause.status).color,
    background: selectState(cause.status).background,
  },
];

const getReasonValues = (cause, selectMessage) => [
  {
    label: `${selectMessage("reason")}: `,
    value: cause.reason,
  },
];

const getRelevantDataValues = (cause, selectMessage) => [
  {
    label: `${selectMessage("relevant_data")}: `,
    value: cause.relevant_data,
  },
];

const Detail = ({ cause, startLoading, stopLoading }) => {
  const t = useTranslate();
  const history = useHistory();
  const { isAdmin, isMechanic, isOperator } = useUser();
  const [showModal, setShowModal] = useState(false);
  const causeMessages = "causes.detail";
  const selectMessage = (value) => t(`${causeMessages}.${value}`);

  const handleEdit = () => {
    history.push(`/cause/edit/${cause.id}`);
  };

  const closeModal = () => setShowModal(false);

  const handleDelete = async () => {
    if (!window.confirm("¿Seguro desea eliminar esta causa?")) {
      return;
    }
    startLoading();
    await deleteCause(cause.id)
      .then(() => {
        history.push("/home");
        Toast("success", selectMessage("delete_success"));
      })
      .catch((error) => {
        console.error(error);
        Toast("error", selectMessage("delete_error"));
      })
      .finally(() => stopLoading());
  };

  const handleApprove = async () => {
    if (!window.confirm("¿Seguro desea aprobar esta causa?")) {
      return;
    }
    startLoading();
    await changeCauseStatus({ status: CAUSE_STATUSES.APPROVED }, cause.id)
      .then(() => {
        history.push("/cause/list");
        Toast("success", "se aprobó la causa corrrectamente");
      })
      .catch((error) => {
        console.error(error);
        Toast("error", "error al aprobar la causa");
      })
      .finally(() => stopLoading());
  };

  const handleReject = async (rejectReason) => {
    startLoading();
    await changeCauseStatus(
      { status: CAUSE_STATUSES.REJECTED, reject_reason: rejectReason },
      cause.id
    )
      .then(() => {
        history.push("/cause/list");
        Toast("success", "se rechazó la causa corrrectamente");
      })
      .catch((error) => {
        console.error(error);
        Toast("error", "error al rechazar la causa");
      })
      .finally(() => {
        stopLoading();
        setShowModal(false);
      });
  };

  const handleResend = async () => {
    try {
      startLoading();
      await resendCause(cause.id);
      history.push("/cause/list");
      Toast("success", "Se reenvió la causa corrrectamente");
    } catch (e) {
      console.error(e);
      Toast("error", "Error al reenviar la causa");
    } finally {
      stopLoading();
    }
  };

  return (
    <Container fluid>
      <Row
        className="d-flex justify-content-end"
        style={{ marginTop: "40px", display: "flex", justifyItems: "end" }}
      >
        <div className="d-flex">
          {cause.status?.toLowerCase() ===
            CAUSE_STATUSES.REQUESTED.toLowerCase() &&
            isAdmin && (
              <div className="d-flex">
                <div className="mr-2">
                  <ApproveBtn
                    handleClick={() => handleApprove()}
                    title={"Aprobar"}
                  />
                </div>
                <div className="mr-2">
                  <RejectBtn
                    handleClick={() => setShowModal(true)}
                    title={"Rechazar"}
                  />
                </div>
              </div>
            )}
          {(isAdmin ||
            cause.status?.toLowerCase() !==
              CAUSE_STATUSES.APPROVED.toLowerCase()) &&
            !isOperator && (
              // admins can always edit; other users can edit if cause != approved
              <div className="mr-2">
                <EditBtn
                  handleClick={() => handleEdit()}
                  title={selectMessage("edit_btn")}
                />
              </div>
            )}
          {cause.status?.toLowerCase() ===
            CAUSE_STATUSES.REJECTED.toLowerCase() &&
            !isOperator && (
              <div className="mr-2 ml-2">
                <ResendCauseBtn
                  handleClick={() => handleResend()}
                  title={selectMessage("resend_btn")}
                />
              </div>
            )}
          {isAdmin && (
            <DeleteBtn
              handleClick={() => handleDelete()}
              title={selectMessage("delete_btn")}
            />
          )}
        </div>
      </Row>
      <Row>
        <DetailBox
          title={selectMessage("detail_title")}
          children={getDetailValues(cause, selectMessage)}
        />
      </Row>
      {cause.reason && (
        <Row>
          <DetailBox
            title={selectMessage("reason_title")}
            children={getReasonValues(cause, selectMessage)}
          />
        </Row>
      )}
      {cause.relevant_data && (
        <Row>
          <DetailBox
            title={selectMessage("relevant_data_title")}
            children={getRelevantDataValues(cause, selectMessage)}
          />
        </Row>
      )}
      <RejectModal
        onReject={handleReject}
        onClose={closeModal}
        show={showModal}
        style={{ backgroundColor: "#e8e8e8" }}
        title={"Rechazar Causa"}
      />
    </Container>
  );
};

export default Detail;
