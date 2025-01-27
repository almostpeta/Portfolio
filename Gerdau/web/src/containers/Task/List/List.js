import React from "react";
import { useHistory } from "react-router-dom";
import { deleteTask } from "service/task";
import { Toast } from "components/Toast";
import { Table } from "components/Table";
import { AiFillEye } from "react-icons/ai";
import { BsPencil, BsFillTrashFill } from "react-icons/bs";
import moment from "moment";
import { TASK_STATUSES } from "utils/constants";
import { getTaskStateStyles } from "utils/status";
import useUser from "hooks/useUser";

const List = ({ tasks, setIsLoading }) => {
  const history = useHistory();
  const { isAdmin } = useUser();

  const handleEdit = (id) => {
    history.push(`/task/edit/${id}`);
  };

  const handleDetail = (id) => {
    history.push(`/task/detail/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      if (!window.confirm("¿Seguro desea eliminar la tarea?")) {
        return;
      }

      setIsLoading(true);
      await deleteTask(id);
      Toast("success", "La tarea se eliminó correctamente");
      history.push("/task/list");
    } catch (e) {
      Toast("error", "La tarea no se pudo eliminar");
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    {
      Header: "Lista de Tareas",
      columns: [
        {
          Header: "Título",
          accessor: "name",
        },
        {
          Header: "Estado",
          accessor: "status",
          Cell: (rowInfo) => {
            return (
              <div
                style={{
                  backgroundColor: getTaskStateStyles(rowInfo.value).background,
                  fontSize: "15px",
                  color: getTaskStateStyles(rowInfo.value).color,
                  textAlign: "center",
                  borderRadius: "5px",
                }}
              >
                {rowInfo.value}
              </div>
            );
          },
        },
        {
          Header: "Fecha de inicio",
          accessor: "start_date",
        },
        {
          Header: "Fecha de fin estimada",
          accessor: "deadline",
        },
        {
          Header: "Asignado A",
          accessor: "responsible.name",
        },
        {
          Header: "Acción",
          accessor: "action",
          disableSortBy: true,
          disableFilters: true,
        },
      ],
    },
  ];

  const getData = () => {
    const formatted = tasks?.map((task) => ({
      ...task,
      status: task.status,
      start_date: moment(task.start_date).format("DD/MM/YYYY"),
      deadline: moment(task.deadline).format("DD/MM/YYYY"),
      action: (
        <div className="d-flex justify-content-between w-100">
          <button
            className="btn btn-outline-info m-0 p-0 w-100 h-100"
            onClick={() => handleDetail(task.id)}
          >
            <AiFillEye size={17} />
          </button>
          {(isAdmin || task.status !== TASK_STATUSES.COMPLETED) && (
            <button
              className="btn btn-outline-info ml-2 p-0 w-100 h-100"
              onClick={() => handleEdit(task.id)}
            >
              <BsPencil size={17} />
            </button>
          )}
          {isAdmin && (
            <button
              className="btn btn-outline-info ml-2 p-0 w-100 h-100"
              onClick={() => handleDelete(task.id)}
            >
              <BsFillTrashFill size={17} />
            </button>
          )}
        </div>
      ),
    }));
    return formatted;
  };

  return <Table data={getData()} columns={columns} />;
};

export default List;
