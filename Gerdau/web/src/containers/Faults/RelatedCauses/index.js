import React, { useState } from "react";
import { Container, Row } from "react-bootstrap";
import useTranslate from "hooks/useTranslate";
import { DataGrid } from "@material-ui/data-grid";
import { useHistory } from "react-router-dom";
import { WarningAlert } from "components/UI/Alert";
import FaultCausesWizard from "components/FaultCausesWizard";
import { RelateCauseBtn } from "components/UI/ActionBtn";
import Box from "components/UI/Box";
import useUser from "hooks/useUser";

const RelatedCauses = ({
  faultId,
  causes,
  handleLoading,
  onRelateNewCauses,
  onForceCausesFetch,
}) => {
  const t = useTranslate();
  const history = useHistory();
  const { isOperator } = useUser();

  const [showCauseModal, setShowCauseModal] = useState(false);

  const causesMessages = "faults.detail.relatedCauses";

  const selectMessage = (value) => t(causesMessages.concat("." + value));

  const rows = [...causes];

  const columns = [
    { field: "id", hide: true },
    {
      field: "name",
      width: 300,
      headerName: "Nombre",
      renderCell: (params) => params.row.name,
    },
    {
      field: "description",
      width: 300,
      headerName: "Descripción",
      renderCell: (params) => params.row.description,
    },
  ];

  const handleCloseFaultCausesWizard = (forceFetch) => {
    forceFetch && onForceCausesFetch();
    setShowCauseModal(false);
  };

  return (
    <Container>
      {!causes ||
        (causes.length === 0 && !isOperator && (
          <div className="mt-2">
            <RelateCauseBtn
              handleClick={() => setShowCauseModal(true)}
              title={selectMessage("add_cause_btn")}
            />
          </div>
        ))}

      {causes?.length > 0 && (
        <Box title={selectMessage("title")}>
          {causes?.length > 0 && (
            <>
              {!isOperator && (
                <div className="mr-2">
                  <RelateCauseBtn
                    handleClick={() => setShowCauseModal(true)}
                    title={selectMessage("add_cause_btn")}
                  />
                </div>
              )}
              <div style={{ height: 400, width: "100%" }}>
                <div style={{ height: 300, width: "100%" }}>
                  <DataGrid
                    rows={rows}
                    columns={columns}
                    onRowClick={(param) =>
                      history.push(`/cause/detail/${param.row.id}`)
                    }
                  />
                </div>
              </div>
            </>
          )}
        </Box>
      )}
      {!causes ||
        (causes.length === 0 && (
          <Row>
            <WarningAlert title={selectMessage("error_message")} />
          </Row>
        ))}

      {showCauseModal && (
        <FaultCausesWizard
          onClose={(forceFetch) => handleCloseFaultCausesWizard(forceFetch)}
          faultId={faultId}
          faultCauses={causes}
        />
      )}
    </Container>
  );
};

export default RelatedCauses;
