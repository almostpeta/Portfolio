import React, { useEffect, useState } from "react";
import { Container, Row } from "react-bootstrap";
import moment from "moment";
import { useHistory } from "react-router-dom";
import useTranslate from "hooks/useTranslate";
import { deleteFault } from "service/fault";
import { DetailBox } from "components/DetailBox";
import { Toast } from "components/Toast";
import { saveAs } from "file-saver";
import {
  RelateCauseBtn,
  EditBtn,
  DeleteBtn,
  ResolveFaultBtn,
  DownloadFaultBtn,
  CreateFollowUpTask,
} from "components/UI/ActionBtn";
import { FAULT_STATES } from "utils/constants";
import FaultCausesWizard from "components/FaultCausesWizard";
import FaultSolutionsModal from "components/FaultSolutionsModal";
import useUser from "hooks/useUser";
import { getFaultStateStyles } from "utils/status";

const getReporterUsersString = (users) => {
  let usersString = "";
  users.forEach((user) => {
    usersString = usersString.concat(`, ${user.name}`);
  });

  return usersString?.substring(1, usersString.length) || "";
};

const getDetailValues = (fault, selectMessage, audios) => [
  {
    label: `${selectMessage("name")}: `,
    value: fault.name,
  },

  {
    label: `${selectMessage("date")}: `,
    value: moment(fault.date).format("MMMM Do YYYY"),
  },
  {
    label: `${selectMessage("resolution_date")}: `,
    value:
      fault.resolution_date &&
      moment(fault.resolution_date).format("MMMM Do YYYY"),
  },
  {
    label: `${selectMessage("description")}: `,
    value: fault.description,
  },
  {
    label: "",
    value: getAudioByAttr(audios, "description_record")?.blobURL,
    variant: "audio",
  },
  {
    label: `${selectMessage("machine")}: `,
    value: fault.machine?.internal_name,
    variant: "link",
    href: `/machine/detail/${fault.machine?.id}`,
  },
  {
    label: `${selectMessage("component")}: `,
    value: fault.component?.internal_name,
    variant: "link",
    href: `/component/detail/${fault.component?.id}`,
  },
  {
    label: `${selectMessage("piece")}: `,
    value: fault.piece?.internal_name,
    variant: "link",
    href: `/piece/detail/${fault.piece?.id}`,
  },
  {
    label: `${selectMessage("fault_number")}: `,
    value: fault.fault_number,
  },
  {
    label: `${selectMessage("clasification")}: `,
    value: fault.clasification,
  },
  {
    label: `${selectMessage("priority")}: `,
    value: fault.priority,
  },
  {
    label: `${selectMessage("stage")}: `,
    value: fault.stage?.name,
  },
  {
    label: `${selectMessage("state")}: `,
    value: fault.state,
    variant: "state",
    color: getFaultStateStyles(fault.state).color,
    background: getFaultStateStyles(fault.state).background,
  },
];

const getUserValues = (fault, selectMessage) => [
  {
    label: `${selectMessage("reporting_users")}: `,
    value: getReporterUsersString(fault.reporters),
  },
  {
    label: `${selectMessage("responsible")}: `,
    value: fault.responsible?.name,
  },
];

const getMeasuresValues = (fault, selectMessage, audios) => [
  {
    label: `${selectMessage("are_measures")}: `,
    value: fault?.are_measures ? "Sí" : "No",
  },
  {
    label: `${selectMessage("analyzed_measures")}: `,
    value: fault?.analyzed_measures,
  },
  {
    label: "",
    value: getAudioByAttr(audios, "analyzed_measures_record")?.blobURL,
    variant: "audio",
  },
];

const getConsequencesValues = (fault, selectMessage, audios) => [
  {
    label: `${selectMessage("consequences")}: `,
    value: fault.consequences,
  },
  {
    label: "",
    value: getAudioByAttr(audios, "consequences_record")?.blobURL,
    variant: "audio",
  },
];

const getRelevantDataValues = (fault, selectMessage) => [
  {
    label: `${selectMessage("relevant_data")}: `,
    value: fault.relevant_data,
  },
];

const getAudioByAttr = (audios, attr) =>
  audios.find((a) => a.relatedTo === attr);

const Detail = ({
  fault,
  zip,
  audios,
  startLoading,
  stopLoading,
  onRelateNewCauses,
  initialCauses,
  onForceFetch,
  createdCause,
  createdSolution,
  createdMethods,
}) => {
  const t = useTranslate();
  const history = useHistory();
  const { isAdmin, isOperator } = useUser();

  const [showWizard, setShowWizard] = useState(false);
  const [showSolutionsModal, setShowSolutionsModal] = useState(false);
  const [faultZip, setFaultZip] = useState(null);

  const faultMessages = "faults.detail";
  const selectMessage = (value) => t(`${faultMessages}.${value}`);

  const handleEdit = () => {
    history.push(`/fault/edit/${fault.id}`);
  };

  const handleCreateNewTask = () => {
    history.push(`/task/new`, {
      pieceId: fault.pieceId,
      componentId: fault.componentId,
      name: `Seguimiento falla - ${fault.name}`,
    });
  };

  const handleAddCause = () => {
    setShowWizard(true);
  };

  useEffect(() => {
    zip && setFaultZip(zip);
  }, [zip]);

  const handleDelete = () => {
    if (!window.confirm("¿Seguro desea eliminar la falla?")) {
      return;
    }

    startLoading();
    deleteFault(fault.id)
      .then(() => {
        history.push("/fault/list");
        Toast("success", selectMessage("delete_success"));
      })
      .catch((error) => {
        console.error(error);
        Toast("error", selectMessage("delete_error"));
      })
      .finally(() => stopLoading());
  };

  const handleCloseFaultCausesWizardClose = (forceFetch) => {
    forceFetch && onForceFetch();
    setShowWizard(false);
  };

  const handleCloseFaultSolutionsWizardClose = (forceFetch) => {
    forceFetch && onForceFetch();
    setShowSolutionsModal(false);
  };

  const handleAssignSolutions = () => {
    setShowWizard(false);
    setShowSolutionsModal(true);
  };

  const handleResolveFaultClick = () => {
    setShowSolutionsModal(true);
  };

  useEffect(() => {
    if (createdCause) {
      // initialCauses.push(createdCause);
      setShowWizard(true);
    }
  }, createdCause);

  useEffect(() => {
    if (createdSolution || createdMethods) {
      setShowSolutionsModal(true);
    }
  }, [createdSolution, createdMethods]);

  const handleDownload = async () => {
    try {
      if (!faultZip) {
        throw new Error("zip expected");
      }

      const blob = await faultZip.generateAsync({ type: "blob" });
      saveAs(blob, `Falla_${fault.name}`); // is async and can take some time
      Toast(
        "success",
        "El archivo ZIP se encuentra en la carpeta de descargas"
      );
    } catch (e) {
      Toast(
        "error",
        "No se pudieron descargar los datos de la falla. Intente nuevamente."
      );
    }
  };

  const handleAssociateCauses = () => {
    setShowSolutionsModal(false);
    setShowWizard(true);
  };

  return (
    <Container fluid>
      <Row
        className="d-flex justify-content-end"
        style={{ marginTop: "40px", display: "flex", justifyItems: "end" }}
      >
        {FAULT_STATES.RESOLVED === fault.state && !isOperator && (
          <div className="mr-2">
            <CreateFollowUpTask
              handleClick={() => handleCreateNewTask()}
              title={selectMessage("create_new_task_btn")}
            />
          </div>
        )}
        {FAULT_STATES.RESOLVED !== fault.state && !isOperator && (
          <>
            <div className="mr-2">
              <ResolveFaultBtn
                handleClick={() => handleResolveFaultClick()}
                title={selectMessage("resolve_fault_btn")}
              />
            </div>
            <div className="mr-2">
              <RelateCauseBtn
                handleClick={() => handleAddCause()}
                title={selectMessage("add_cause_btn")}
              />
            </div>
          </>
        )}
        {faultZip && (
          <div className="mr-2">
            <DownloadFaultBtn
              handleClick={() => handleDownload()}
              title={"Descargar"}
            />
          </div>
        )}
        <div className="mr-2">
          <EditBtn
            handleClick={() => handleEdit()}
            title={selectMessage("edit_btn")}
          />
        </div>
        {isAdmin && (
          <DeleteBtn
            handleClick={() => handleDelete()}
            title={selectMessage("delete_btn")}
          />
        )}
      </Row>
      <Row>
        <DetailBox
          key="detail"
          title={selectMessage("detail_title")}
          children={getDetailValues(fault, selectMessage, audios)}
        />
      </Row>
      <Row>
        <DetailBox
          key="users"
          title={selectMessage("users_title")}
          children={getUserValues(fault, selectMessage)}
        />
      </Row>
      <Row>
        <DetailBox
          key="measures"
          title={selectMessage("measures_title")}
          children={getMeasuresValues(fault, selectMessage, audios)}
        />
      </Row>
      <Row>
        <DetailBox
          key="consequences"
          title={selectMessage("consequences_title")}
          children={getConsequencesValues(fault, selectMessage, audios)}
        />
      </Row>
      <Row>
        <DetailBox
          key="relevantData"
          title={selectMessage("relevant_data_title")}
          children={getRelevantDataValues(fault, selectMessage)}
        />
      </Row>
      {showWizard && (
        <FaultCausesWizard
          onClose={(forceFetch) =>
            handleCloseFaultCausesWizardClose(forceFetch)
          }
          fault={fault}
          faultId={fault.id}
          faultCauses={initialCauses}
          createdCause={createdCause}
          onAssignSolutions={() => handleAssignSolutions()}
        />
      )}
      {showSolutionsModal && (
        <FaultSolutionsModal
          onClose={(forceFetch) =>
            handleCloseFaultSolutionsWizardClose(forceFetch)
          }
          onAssociateCauses={handleAssociateCauses}
          faultId={fault.id}
          faultCauses={initialCauses}
        />
      )}
    </Container>
  );
};

export default Detail;
