import React from "react";
import { GrUserAdmin } from "react-icons/gr";
import { BiEdit } from "react-icons/bi";
import { FiUserX, FiUserCheck } from "react-icons/fi";
import { Table } from "components/Table";

const UsersTable = ({ users, actions, message }) => {
  const columns = [
    {
      Header: message("title"),
      columns: [
        {
          Header: message("name"),
          accessor: "name",
        },
        {
          Header: message("email"),
          accessor: "email",
        },
        {
          Header: message("role"),
          accessor: "role",
        },
        {
          Header: message("isActive"),
          accessor: "isActive",
        },
        {
          Header: message("action.title"),
          accessor: "action",
          disableSortBy: true,
          disableFilters: true,
        },
      ],
    },
  ];

  const getData = (users) => {
    const formatted = users.map((user) => ({
      ...user,
      isActive: user.isActive ? "Activado" : "Desactivado",
      action: (
        <div className="d-flex justify-content-between w-100">
          <button
            className="btn btn-outline-info m-0 p-0 w-100 h-100"
            onClick={() => actions.editUser(user)}
          >
            <BiEdit size={17} />
          </button>
          <button
            className="btn btn-outline-info ml-2 m-0 p-0 w-100 h-100"
            onClick={() => actions.resetPassword(user)}
          >
            <GrUserAdmin size={17} />
          </button>
          <button
            className="btn btn-outline-info ml-2 p-0 w-100 h-100"
            onClick={() => actions.disable(user)}
          >
            {user.isActive ? <FiUserX size={17} /> : <FiUserCheck size={17} />}
          </button>
        </div>
      ),
    }));
    return formatted;
  };

  return <Table columns={columns} data={getData(users)} />;
};

export default UsersTable;
