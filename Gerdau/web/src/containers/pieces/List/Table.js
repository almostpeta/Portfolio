import React from "react";
import { AiFillEye } from "react-icons/ai";
import { BsPencil } from "react-icons/bs";
import { Table } from "components/Table";
import useUser from "hooks/useUser";

const PiecesTable = ({ pieces, actions }) => {
  const { isAdmin } = useUser();
  const columns = [
    {
      Header: "Piezas",
      columns: [
        {
          Header: "Nombre Interno",
          accessor: "internal_name",
        },
        {
          Header: "Componente",
          accessor: "component.internal_name",
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

  const getData = (pieces) => {
    const formatted = pieces.map((piece, index) => ({
      ...piece,
      action: (
        <div key={index} className="d-flex justify-content-between w-100">
          <button
            className="btn btn-outline-info m-0 p-0 w-100 h-100"
            onClick={() => actions.view(piece.id)}
          >
            <AiFillEye size={17} />
          </button>
          {isAdmin && (
            <button
              className="btn btn-outline-info ml-2 p-0 w-100 h-100"
              onClick={() => actions.edit(piece)}
            >
              <BsPencil size={17} />
            </button>
          )}
        </div>
      ),
    }));
    return formatted;
  };

  return <Table columns={columns} data={getData(pieces)} />;
};

export default PiecesTable;
