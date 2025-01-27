import React from "react";
import { AiFillEye } from "react-icons/ai";
import { BsPencil } from "react-icons/bs";
import { Table } from "components/Table";
import useUser from "hooks/useUser";

const ComponentsTable = ({ components, actions }) => {
  const { isAdmin } = useUser();
  const columns = [
    {
      Header: "Componentes",
      columns: [
        {
          Header: "Nombre Interno",
          accessor: "internal_name",
        },
        {
          Header: "Máquina",
          accessor: "machine.internal_name",
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

  const getData = (components) => {
    const formatted = components.map((component, index) => ({
      ...component,
      action: (
        <div key={index} className="d-flex justify-content-between w-100">
          <button
            className="btn btn-outline-info m-0 p-0 w-100 h-100"
            onClick={() => actions.view(component.id)}
          >
            <AiFillEye size={17} />
          </button>
          {isAdmin && (
            <button
              className="btn btn-outline-info ml-2 p-0 w-100 h-100"
              onClick={() => actions.edit(component)}
            >
              <BsPencil size={17} />
            </button>
          )}
        </div>
      ),
      status: component.status,
    }));
    return formatted;
  };

  return <Table columns={columns} data={getData(components)} />;
};

export default ComponentsTable;
