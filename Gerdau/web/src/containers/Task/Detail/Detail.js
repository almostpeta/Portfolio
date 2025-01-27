import React from "react";
import { Container, Row } from "react-bootstrap";
import useTranslate from "hooks/useTranslate";
import { EditBtn, DeleteBtn, CompleteTaskBtn } from "components/UI/ActionBtn";
import { DetailBox } from "components/DetailBox";
import moment from "moment";
import { TASK_STATUSES } from "utils/constants";
import { getTaskStateStyles } from "utils/status";
import useUser from "hooks/useUser";

const getDetailValues = (task, selectMessage) => [
  {
    label: `${selectMessage("name")}: `,
    value: task.name,
  },
  {
    label: `${selectMessage("description")}: `,
    value: task.description,
  },
  {
    label: `${selectMessage("reason")}: `,
    value: task.reason,
  },
  {
    label: `${selectMessage("start_date")}: `,
    value: moment(task.start_date).format("DD/MM/YYYY"),
  },
  {
    label: `${selectMessage("deadline")}: `,
    value: moment(task.deadline).format("DD/MM/YYYY"),
  },

  {
    label: `${selectMessage("responsibleId")}: `,
    value: task.responsible?.name,
  },
  {
    label: `${selectMessage("requestedId")}: `,
    value: task.requested?.name,
  },
  {
    label: `${selectMessage("completed_date")}: `,
    value:
      task.complete_date && moment(task.complete_date).format("DD/MM/YYYY"),
  },
  {
    label: `${selectMessage("machineId")}: `,
    value: task.machine?.internal_name,
    variant: "link",
    href: `/machine/detail/${task.machine?.id}`,
  },
  {
    label: `${selectMessage("componentId")}: `,
    value: task.component?.internal_name,
    variant: "link",
    href: `/component/detail/${task.component?.id}`,
  },
  {
    label: `${selectMessage("pieceId")}: `,
    value: task.piece?.internal_name,
    variant: "link",
    href: `/piece/detail/${task.piece?.id}`,
  },
  {
    label: `${selectMessage("status")}: `,
    value: task.status,
    variant: "state",
    color: getTaskStateStyles(task.status).color,
    background: getTaskStateStyles(task.status).background,
  },
];

const Detail = ({ task, handleEdit, handleDelete, handleCompleteTask }) => {
  const t = useTranslate();
  const { isAdmin } = useUser();

  const taskMessage = "containers.tasks.detail";
  const selectMessage = (value) => t(`${taskMessage}.${value}`);

  return (
    <Container fluid>
      <Row
        className="d-flex justify-content-end"
        style={{ marginTop: "40px", display: "flex", justifyItems: "end" }}
      >
        <>
          {task.status !== TASK_STATUSES.COMPLETED && (
            <div className="mr-2">
              <CompleteTaskBtn
                handleClick={handleCompleteTask}
                title={selectMessage("complete_task_btn")}
              />
            </div>
          )}
          {(task.status !== TASK_STATUSES.COMPLETED || isAdmin) && (
            <div className="mr-2">
              <EditBtn
                handleClick={handleEdit}
                title={selectMessage("edit_btn")}
              />
            </div>
          )}
          {isAdmin && (
            <div>
              <DeleteBtn
                title={selectMessage("delete_btn")}
                handleClick={handleDelete}
              />
            </div>
          )}
        </>
      </Row>
      <Row>
        <DetailBox
          title={selectMessage("detail_title")}
          children={getDetailValues(task, selectMessage)}
        />
      </Row>
    </Container>
  );
};

export default Detail;
