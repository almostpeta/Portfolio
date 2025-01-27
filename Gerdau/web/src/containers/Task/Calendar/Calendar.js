import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import moment from "moment";
import { deleteTask, setTaskAsCompleted } from "service/task";
import { Toast } from "components/Toast";
import { Container, Row } from "react-bootstrap";
import { createTask } from "service/task";
import useUser from "hooks/useUser";
import { Calendar } from "components/Calendar";
import { EditBtn, DeleteBtn, CompleteTaskBtn } from "components/UI/ActionBtn";
import { DetailBox } from "components/DetailBox";
import TaskModal from "components/UI/TaskModal";
import { ModalComponent } from "components/Modal/Modal";
import { Button } from "components/Button";
import useTranslate from "hooks/useTranslate";
import { TASK_STATUSES } from "utils/constants";

const UserCalendar = ({ tasks, setIsLoading, datalists, onRefresh }) => {
  const history = useHistory();
  const { isAdmin, user } = useUser();
  const [data, setData] = useState(tasks || []);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRange, setSelectedRange] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedEventData, setSelectedEventData] = useState(null);

  const t = useTranslate();
  const taskMessage = "containers.tasks.detail";
  const selectMessage = (value) => t(`${taskMessage}.${value}`);

  const label = (field) => t(`containers.tasks.form.${field}`);

  useEffect(() => {
    tasks && setData(getFormattedData(tasks));
  }, [tasks]);

  const getFormattedData = (tasks) => {
    const formatted =
      tasks &&
      tasks.map((task) => {
        if (task.isActive) {
          return {
            id: task.id,
            state: task.status,
            title: task.name,
            desc: task.description,
            start: new Date(task.start_date),
            end: new Date(task.deadline),
          };
        }
      });

    return formatted;
  };

  const handleDelete = async () => {
    try {
      if (!window.confirm("¿Seguro desea eliminar la tarea?")) {
        return;
      }
      setIsLoading(true);
      await deleteTask(selectedEvent?.id);
      Toast("success", "La tarea se eliminó correctamente");
    } catch (e) {
      Toast("error", "La tarea no se pudo eliminar");
    } finally {
      setIsLoading(false);
      onRefresh(user?.user?.id, isAdmin);
    }
  };

  const onCreateTask = async (range) => {
    if (!isAdmin) {
      alert("No tiene permisos para crear una tarea");
      return;
    }
    setSelectedRange(range);
    setShowModal(true);
  };

  const onSelectTask = (task) => {
    setSelectedEvent(task);
    const taskData = findTaskData(task?.id);
    setSelectedEventData(taskData);
    setShowDetailModal(true);
  };

  const handleSubmit = async (inputs) => {
    try {
      setIsLoading(true);
      const task = await createTask(inputs);
      Toast("success", label("submit_success"));
    } catch (e) {
      Toast("error", label("submit_error"));
    } finally {
      setIsLoading(false);
      onRefresh(user?.user?.id, isAdmin);
      // setSelectedEvent(null);
    }
  };

  const onClose = () => {
    setShowModal(false);
    // setSelectedEvent(null);
  };

  const onCloseDetailModal = () => {
    setShowDetailModal(false);
    // setSelectedEvent(null);
  };

  const handleEdit = () => {
    history.push(`/task/edit/${selectedEvent?.id}`);
  };

  const handleDetail = () => {
    history.push(`/task/detail/${selectedEvent?.id}`);
  };

  const findTaskData = (id) => {
    return tasks.find((el) => el?.id === id);
  };

  const handleCompleteTask = async () => {
    try {
      setIsLoading(true);
      await setTaskAsCompleted(selectedEvent.id);
      Toast("success", "La tarea se ha completado correctamente");
      onRefresh(user?.user?.id, isAdmin);
    } catch (e) {
      Toast("error", "No se pudo completar la tarea");
    } finally {
      setIsLoading(false);
    }
  };

  const getDetailValues = () => [
    {
      label: `${selectMessage("name")}: `,
      value: selectedEventData?.name,
    },
    {
      label: `${selectMessage("description")}: `,
      value: selectedEventData?.description,
    },
    {
      label: `${selectMessage("reason")}: `,
      value: selectedEventData?.reason,
    },
    {
      label: `${selectMessage("start_date")}: `,
      value: moment(selectedEventData?.start_date).format("DD/MM/YYYY"),
    },
    {
      label: `${selectMessage("deadline")}: `,
      value: moment(selectedEventData?.deadline).format("DD/MM/YYYY"),
    },
    {
      label: `${selectMessage("status")}: `,
      value: selectedEventData?.status,
    },
    {
      label: `${selectMessage("responsibleId")}: `,
      value: selectedEventData?.responsible?.name,
    },
    {
      label: `${selectMessage("requestedId")}: `,
      value: selectedEventData?.requested?.name,
    },
    {
      label: `${selectMessage("completed_date")}: `,
      value:
        selectedEventData.complete_date &&
        moment(selectedEventData.complete_date).format("DD/MM/YYYY"),
    },
    {
      label: `${selectMessage("machineId")}: `,
      value: selectedEventData?.machine?.internal_name,
    },
    {
      label: `${selectMessage("componentId")}: `,
      value: selectedEventData?.component?.internal_name,
    },
    {
      label: `${selectMessage("pieceId")}: `,
      value: selectedEventData?.piece?.internal_name,
    },
  ];

  return (
    <div>
      <Calendar
        tasks={data}
        onCreateTask={onCreateTask}
        onSelectTask={onSelectTask}
      />

      {showModal && (
        <TaskModal
          onSubmit={handleSubmit}
          range={selectedRange}
          onClose={() => onClose()}
          show={showModal}
          style={{ backgroundColor: "#e8e8e8" }}
          datalists={datalists}
          title={"Nueva tarea"}
        />
      )}
      {showDetailModal && (
        <ModalComponent
          onClose={onCloseDetailModal}
          show={showDetailModal}
          children={
            <div>
              <Row
                className="d-flex justify-content-end"
                style={{
                  position: "relative",
                  maxWidth: "100%",
                }}
              >
                {selectedEvent?.status !== TASK_STATUSES.COMPLETED && (
                  <div className="mr-1">
                    <CompleteTaskBtn
                      title="Completar"
                      handleClick={() => handleCompleteTask()}
                    />
                  </div>
                )}
                {(selectedEvent?.status !== TASK_STATUSES.COMPLETED ||
                  isAdmin) && (
                  <EditBtn handleClick={handleEdit} title={"Editar"} />
                )}

                <div className="d-flex justify-content-end mb-3 ml-1 mr-1">
                  <Button onClick={() => handleDetail()}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      Ir a Detalles
                    </div>
                  </Button>
                </div>
                {isAdmin && (
                  <div className="ml-1">
                    <DeleteBtn
                      handleClick={() => handleDelete()}
                      title={"Eliminar"}
                    />
                  </div>
                )}
              </Row>
              <Row className="m-2">
                <DetailBox
                  title={"Detalles"}
                  style={{
                    position: "relative",
                    maxWidth: "100%",
                  }}
                  children={getDetailValues()}
                />
              </Row>
            </div>
          }
          style={{ backgroundColor: "white" }}
          title={selectedEvent?.title}
        ></ModalComponent>
      )}
    </div>
  );
};

export default UserCalendar;
