import React from "react";
import { useHistory } from "react-router-dom";
import { WarningAlert } from "components/UI/Alert";
import Table from "./Table";
import useUser from "hooks/useUser";

const List = ({ pieces }) => {
  const history = useHistory();
  const { setIsAdminView } = useUser();

  const handleEdit = ({ id, component }) => {
    setIsAdminView(true);
    history.push(`/admin/machine/edit/${component.machineId}`, {
      variant: "piece",
      recordId: id,
    });
  };

  const handleDetail = (id) => {
    history.push(`/piece/detail/${id}`);
  };

  return (
    <div className="w-100 mt-3 vh-100 p-4">
      <div className="d-block ml-3 mr-3">
        <h2 style={{ color: "#01516a" }}>Piezas</h2>
        <hr />
      </div>
      <div className="pt-3">
        {pieces?.length > 0 && (
          <Table
            pieces={pieces}
            actions={{ view: handleDetail, edit: handleEdit }}
          />
        )}
        {(!pieces || pieces.length === 0) && (
          <WarningAlert title="No se han encontrado piezas" />
        )}
      </div>
    </div>
  );
};

export default List;
