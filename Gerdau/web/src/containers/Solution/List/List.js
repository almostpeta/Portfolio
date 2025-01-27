import React from "react";
import { useHistory } from "react-router-dom";
import { Button } from "components/Button";
import { WarningAlert } from "components/UI/Alert";
import useTranslate from "hooks/useTranslate";
import Table from "./Table";
import useUser from "hooks/useUser";

const List = ({ solutions }) => {
  const history = useHistory();
  const t = useTranslate();
  const { isOperator } = useUser();

  const message = (value) => t(`containers.solutions.list.${value}`);

  const handleEdit = (id) => {
    history.push(`/solution/edit/${id}`);
  };

  const handleDetail = (id) => {
    history.push(`/solution/detail/${id}`);
  };

  return (
    <div className="w-100 mt-3 vh-100 p-4">
      <div className="d-block ml-3 mr-3">
        <h2 style={{ color: "#01516a" }}>Soluciones</h2>
        <hr />
      </div>
      {!isOperator && (
        <div className="d-flex justify-content-end pr-3">
          <Button onClick={() => history.push("/solution/new")}>
            Ingresar Solución
          </Button>
        </div>
      )}
      <div className="pt-3">
        {solutions?.length > 0 && (
          <Table
            solutions={solutions}
            actions={{ view: handleDetail, edit: handleEdit }}
            message={message}
          />
        )}
        {(!solutions || solutions.length === 0) && (
          <WarningAlert title={message("not_found")} />
        )}
      </div>
    </div>
  );
};

export default List;
