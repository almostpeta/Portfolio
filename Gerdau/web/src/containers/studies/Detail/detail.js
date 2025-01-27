import React, { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { deleteStudy } from "service/study";
import { DetailBox } from "components/DetailBox";
import { useHistory } from "react-router-dom";
import { EditBtn, DeleteBtn } from "components/UI/ActionBtn";
import useTranslate from "hooks/useTranslate";
import moment from "moment";
import { Toast } from "components/Toast";
import useUser from "hooks/useUser";

export const StudyDetail = ({ study }) => {
  const history = useHistory();
  const t = useTranslate();
  const { isAdmin, isOperator } = useUser();

  const studyMessages = "study.detail";
  const selectMessage = (value) => t(studyMessages.concat("." + value));

  const handleEditClick = () => {
    history.push(`/study/edit/${study.id}`);
  };

  const getDetailValues = () => {
    return [
      {
        label: `${selectMessage("internal_name")}: `,
        value: study?.internal_name,
      },
      {
        label: `${selectMessage("component")}: `,
        value: study?.component?.internal_name,
        variant: "link",
        href: `/component/detail/${study?.component?.id}`,
      },
      {
        label: `${selectMessage("piece")}: `,
        value: study?.piece?.internal_name,
        variant: "link",
        href: `/piece/detail/${study?.piece?.id}`,
      },
      {
        label: `${selectMessage("user")}: `,
        value: study?.user?.name,
      },
      {
        label: `${selectMessage("date")}: `,
        value: moment(study?.date).format("L"),
      },
    ];
  };

  const getReasonValues = () => {
    return [
      {
        value: study?.reason,
      },
    ];
  };

  const handleEdit = () => {
    history.push(`/study/edit/${study.id}`);
  };

  const handleDelete = () => {
    deleteStudy(study.id)
      .then(() => {
        history.goBack();
        Toast("success", "Estudio eliminado correctamente");
      })
      .catch((error) => {
        console.error(error);
        Toast("error", "Ocurrió un error al eliminar el estudio");
      });
  };

  return (
    <Container fluid>
      {isAdmin && (
        <Row
          className="d-flex justify-content-end"
          style={{ marginTop: "40px", display: "flex", justifyItems: "end" }}
        >
          {!isOperator && (
            <div className="mr-2">
              <EditBtn
                handleClick={() => handleEdit()}
                title={selectMessage("edit_btn")}
              />
            </div>
          )}
          {isAdmin && (
            <DeleteBtn
              handleClick={() => handleDelete()}
              title={selectMessage("delete_btn")}
            />
          )}
        </Row>
      )}
      <Row>
        <DetailBox
          title={selectMessage("detail_title")}
          children={getDetailValues()}
        />
      </Row>
      <Row style={{ marginTop: "40px" }}>
        <DetailBox
          title={selectMessage("reason_title")}
          children={getReasonValues()}
        />
      </Row>
    </Container>
  );
};
