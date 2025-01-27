import React from "react";
import { AiFillEye } from "react-icons/ai";
import { BsPencil } from "react-icons/bs";
import { Table } from "components/Table";
import useUser from "hooks/useUser";

const StudiesTable = ({ studies, actions }) => {
  const { isOperator } = useUser();

  const columns = [
    {
      Header: "Estudios",
      columns: [
        {
          Header: "Nombre",
          accessor: "internal_name",
        },
        {
          Header: "Componente",
          accessor: "component.internal_name",
        },
        {
          Header: "Pieza",
          accessor: "piece.internal_name",
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

  const getData = (studies) => {
    const formatted = studies.map((study, index) => ({
      ...study,
      action: (
        <div key={index} className="d-flex justify-content-between w-100">
          <button
            className="btn btn-outline-info m-0 p-0 w-100 h-100"
            onClick={() => actions.view(study.id)}
          >
            <AiFillEye size={17} />
          </button>
          {!isOperator && (
            <button
              className="btn btn-outline-info ml-2 p-0 w-100 h-100"
              onClick={() => actions.edit(study)}
            >
              <BsPencil size={17} />
            </button>
          )}
        </div>
      ),
    }));
    return formatted;
  };

  return <Table columns={columns} data={getData(studies)} />;
};

export default StudiesTable;
