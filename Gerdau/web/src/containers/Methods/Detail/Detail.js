import React, { useState } from "react";
import { Container, Row } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import useTranslate from "hooks/useTranslate";
import { EditBtn, DeleteBtn } from "components/UI/ActionBtn";
import { DetailBox } from "components/DetailBox";
import { Toast } from "components/Toast";
import useUser from "hooks/useUser";

const getDetailValues = (method, selectMessage, audios) => [
  {
    label: `${selectMessage("name")}: `,
    value: method.name,
  },
  {
    label: `${selectMessage("description")}: `,
    value: method.description,
  },
  {
    label: "",
    value: getAudioByAttr(audios, "description_record")?.blobURL,
    variant: "audio",
  },
  {
    label: `${selectMessage("solutionId")}: `,
    value: method.solution?.name,
    variant: "link",
    href: `/solution/detail/${method.solution?.id}`,
  },
];

const getAudioByAttr = (audios, attr) =>
  audios.find((a) => a.relatedTo === attr);

const Detail = ({
  method,
  audios,
  startLoading,
  stopLoading,
  initialCauses,
}) => {
  const t = useTranslate();
  const history = useHistory();
  const { isOperator } = useUser();

  const [showCauseModal, setShowCauseModal] = useState(false);

  const methodMessages = "containers.methods.detail";
  const selectMessage = (value) => t(`${methodMessages}.${value}`);

  const handleEdit = () => {
    history.push(`/method/edit/${method.id}`);
  };

  return (
    <Container fluid>
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
      </Row>
      <Row>
        <DetailBox
          title={selectMessage("detail_title")}
          children={getDetailValues(method, selectMessage, audios)}
        />
      </Row>
    </Container>
  );
};

export default Detail;
