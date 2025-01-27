import React, { useState } from "react";
import { Container, Row } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import useTranslate from "hooks/useTranslate";
import { DetailBox } from "components/DetailBox";
import { WarningAlert } from "components/UI/Alert";
import { changeStatus, deleteSolution, resendSolution } from "service/solution";
import { Toast } from "components/Toast";
import RejectModal from "components/UI/RejectModal";
import {
  EditBtn,
  DeleteBtn,
  ApproveBtn,
  RejectBtn,
  ResendCauseBtn,
} from "components/UI/ActionBtn";
import useUser from "hooks/useUser";
import { SOLUTION_STATUSES } from "utils/constants";

const getDetailValues = (solution, selectMessage) => [
  {
    label: `${selectMessage("name")}: `,
    value: solution.name,
  },
  {
    label: `${selectMessage("description")}: `,
    value: solution.description,
  },
  {
    label: `${selectMessage("relevant_data")}: `,
    value: solution.relevant_data,
  },
  {
    label: `Causa: `,
    value: solution.cause.name,
  },
  {
    label: `${selectMessage("status")}: `,
    value: solution.status,
  },
  {
    label: `${selectMessage("requestedId")}: `,
    value: solution.requested.name,
  },
];

const Detail = ({ onRecordAction, setLoading, solution }) => {
  const t = useTranslate();
  const history = useHistory();
  const { isAdmin, isOperator } = useUser();
  const [showModal, setShowModal] = useState(false);

  const selectMessage = (field) => t(`containers.solutions.detail.${field}`);

  const handleEdit = () => history.push(`/solution/edit/${solution.id}`);

  const handleDelete = async () => {
    try {
      if (window.confirm(selectMessage("delete_prompt"))) {
        setLoading(true);
        await deleteSolution(solution.id);
        Toast("success", selectMessage("delete_successful"));
      }
    } catch (e) {
      Toast("error", selectMessage("delete_error"));
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      if (!window.confirm(selectMessage("approval_prompt"))) {
        return;
      }
      setLoading(true);
      const updatedSolution = await changeStatus({
        status: "Aprobada",
        id: solution.id,
      });
      onRecordAction(updatedSolution);
      Toast("success", selectMessage("approval_success"));
    } catch (e) {
      Toast("error", selectMessage("approval_error"));
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (reason) => {
    try {
      setLoading(true);
      const updatedSolution = await changeStatus({
        status: SOLUTION_STATUSES.REJECTED,
        reject_reason: reason,
        id: solution.id,
      });
      onRecordAction(updatedSolution);
      Toast("success", selectMessage("reject_success"));
    } catch (e) {
      Toast("error", selectMessage("reject_error"));
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };

  const handleResend = async () => {
    try {
      if (!window.confirm(selectMessage("resend_prompt"))) {
        return;
      }
      setLoading(true);
      const updatedSolution = await resendSolution(solution.id);
      onRecordAction(updatedSolution);
      Toast("success", selectMessage("resend_success"));
    } catch (e) {
      Toast("error", selectMessage("resend_error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid>
      {solution?.id && (
        <>
          <div
            className="d-flex justify-content-end"
            style={{ marginTop: "40px" }}
          >
            <Row>
              {solution.status === SOLUTION_STATUSES.REQUESTED && isAdmin && (
                <>
                  <div className="mr-2">
                    <ApproveBtn
                      handleClick={() => handleApprove()}
                      title={selectMessage("approval_btn")}
                    />
                  </div>
                  <div className="mr-2">
                    <RejectBtn
                      handleClick={() => setShowModal(true)}
                      title={selectMessage("reject_btn")}
                    />
                  </div>
                </>
              )}
              {solution.status === SOLUTION_STATUSES.REJECTED && !isOperator && (
                <div className="mr-2">
                  <ResendCauseBtn
                    handleClick={() => handleResend()}
                    title={selectMessage("resend_btn")}
                  />
                </div>
              )}
              {((solution.status !== SOLUTION_STATUSES.APPROVED &&
                !isOperator) ||
                isAdmin) && (
                <div className="mr-2">
                  <EditBtn
                    handleClick={() => handleEdit()}
                    title={selectMessage("edit_btn")}
                  />
                </div>
              )}
              {isAdmin && (
                <DeleteBtn
                  handleClick={() => handleDelete()}
                  title={selectMessage("delete_btn")}
                />
              )}
            </Row>
          </div>
          <Row>
            <DetailBox
              title={selectMessage("detail_title")}
              children={getDetailValues(solution, selectMessage)}
            />
          </Row>
          <RejectModal
            onReject={handleReject}
            onClose={() => setShowModal(false)}
            show={showModal}
            style={{ backgroundColor: "#e8e8e8" }}
            title={selectMessage("reject_modal_title")}
          />
        </>
      )}
      {!solution?.id && (
        <Row style={{ margin: "10px" }}>
          <WarningAlert title={selectMessage("error_message")} />
        </Row>
      )}
    </Container>
  );
};

export default Detail;
