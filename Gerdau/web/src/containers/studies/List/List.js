import React from "react";
import { useHistory } from "react-router-dom";
import { WarningAlert } from "components/UI/Alert";
import { Button } from "components/Button";
import Table from "./Table";
import useUser from "hooks/useUser";

const List = ({ studies }) => {
  const history = useHistory();
  const { isOperator } = useUser();

  const handleEdit = ({ id }) => {
    history.push(`/study/edit/${id}`);
  };

  const handleDetail = (id) => {
    history.push(`/study/detail/${id}`);
  };

  return (
    <div className="w-100 mt-3 vh-100 p-4">
      <div className="d-block ml-3 mr-3">
        <h2 style={{ color: "#01516a" }}>Estudios</h2>
        <hr />
      </div>
      {!isOperator && (
        <div className="d-flex justify-content-end pr-3">
          <Button onClick={() => history.push("/study/new")}>
            Ingresar Estudio
          </Button>
        </div>
      )}
      <div className="pt-3">
        {studies?.length > 0 && (
          <Table
            studies={studies}
            actions={{ view: handleDetail, edit: handleEdit }}
          />
        )}
        {(!studies || studies.length === 0) && (
          <WarningAlert title="No se han encontrado estudios" />
        )}
      </div>
    </div>
  );
};

export default List;
