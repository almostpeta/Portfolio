import React from "react";
import { AiFillEye } from "react-icons/ai";
import { BsPencil } from "react-icons/bs";
import { Table } from "components/Table";
import { SOLUTION_STATUSES } from "utils/constants";
import useUser from "hooks/useUser";
import { getSolutionStyles } from "utils/status";

const SolutionTable = ({ solutions, actions, message }) => {
  const { isAdmin, isOperator } = useUser();
  const columns = [
    {
      Header: message("title"),
      columns: [
        {
          Header: message("name"),
          accessor: "name",
        },
        {
          Header: message("status"),
          accessor: "status",
          Cell: (rowInfo) => {
            return (
              <div
                style={{
                  backgroundColor: getSolutionStyles(rowInfo.value).background,
                  fontSize: "15px",
                  color: getSolutionStyles(rowInfo.value).color,
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
          Header: message("description"),
          accessor: "description",
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

  const getData = (solutions) => {
    const formatted = solutions.map((solution, index) => ({
      ...solution,
      action: (
        <div key={index} className="d-flex justify-content-between w-100">
          <button
            className="btn btn-outline-info m-0 p-0 w-100 h-100"
            onClick={() => actions.view(solution.id)}
          >
            <AiFillEye size={17} />
          </button>
          {(isAdmin ||
            (solution.status !== SOLUTION_STATUSES.APPROVED &&
              !isOperator)) && (
            <button
              className="btn btn-outline-info ml-2 p-0 w-100 h-100"
              onClick={() => actions.edit(solution.id)}
            >
              <BsPencil size={17} />
            </button>
          )}
        </div>
      ),
      status: solution.status,
    }));
    return formatted;
  };

  return <Table columns={columns} data={getData(solutions)} />;
};

export default SolutionTable;
