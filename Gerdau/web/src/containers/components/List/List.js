import React from "react";
import { useHistory } from "react-router-dom";
import { WarningAlert } from "components/UI/Alert";
import Table from "./Table";
import useUser from "hooks/useUser";

const List = ({ components }) => {
  const history = useHistory();
  const { setIsAdminView } = useUser();

  const handleEdit = ({ id, machineId }) => {
    setIsAdminView(true);
    history.push(`/admin/machine/edit/${machineId}`, {
      variant: "component",
      recordId: id,
    });
  };

  const handleDetail = (id) => {
    history.push(`/component/detail/${id}`);
  };

  return (
    <div className="w-100 mt-3 vh-100 p-4">
      <div className="d-block ml-3 mr-3">
        <h2 style={{ color: "#01516a" }}>Componentes</h2>
        <hr />
      </div>
      <div className="pt-3">
        {components?.length > 0 && (
          <Table
            components={components}
            actions={{ view: handleDetail, edit: handleEdit }}
          />
        )}
        {(!components || components.length === 0) && (
          <WarningAlert title="No se han encontrado componentes" />
        )}
      </div>
    </div>
  );
};

export default List;
