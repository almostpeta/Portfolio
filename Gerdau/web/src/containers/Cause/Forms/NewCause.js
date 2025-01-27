import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import useTranslate from "hooks/useTranslate";
import { TextArea } from "components/TextArea";
import { CAUSE_STATUSES } from "utils/constants";
import useUser from "hooks/useUser";

const DisplayRow = ({ label, children }) => (
  <Row>
    <Col lg="12">
      <Form.Group controlId={label} className="mt-4">
        <Form.Label>{label}</Form.Label>
        {children}
      </Form.Group>
    </Col>
  </Row>
);

const CauseForm = ({
  data,
  onChange,
  onSubmit,
  onCancel,
  isSubmitted,
  isEditing,
  usersData,
}) => {
  const t = useTranslate();
  const userContext = useUser();
  const [users, setUsers] = useState([]);
  const isAdmin = userContext.isAdmin;
  const currentUser = userContext.user;

  const [causeStatuses] = useState([
    CAUSE_STATUSES.REQUESTED,
    CAUSE_STATUSES.APPROVED,
    CAUSE_STATUSES.REJECTED,
  ]);

  const [name, setName] = useState("");
  const [status, setStatus] = useState(causeStatuses[0]);
  const [description, setDescription] = useState("");
  const [user, setUser] = useState(currentUser?.user.id);
  const [reason, setReason] = useState("");
  const [relevantData, setRelevantData] = useState("");

  useEffect(() => {
    if (isEditing && !!data) {
      setName(data.name);
      setStatus(data.status);
      setDescription(data.description);
      setUser(data?.requestedId);
      setReason(data.reason);
      setRelevantData(data.relevant_data);
    }
  }, [isEditing]);

  useEffect(() => {
    usersData && setUsers([...usersData]);
  }, [usersData]);

  useEffect(() => {
    onChange("name", name);
  }, [name]);

  useEffect(() => {
    onChange("status", status);
  }, [status]);

  useEffect(() => {
    onChange("description", description);
  }, [description]);

  useEffect(() => {
    onChange("requestedId", user);
  }, [user]);

  useEffect(() => {
    onChange("reason", reason);
  }, [reason]);

  useEffect(() => {
    onChange("relevant_data", relevantData);
  }, [relevantData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(true);
    return false;
  };

  const selectMessage = (value) => t(`containers.causes.cause.${value}`);

  return (
    <Container>
      <Form onSubmit={(e) => handleSubmit(e)}>
        <Row className="d-block mt-5 ml-0 mr-0">
          <h2 style={{ color: "#01516a" }}>
            {!isEditing
              ? selectMessage("new_title")
              : selectMessage("edit_title")}
          </h2>
          <hr />
        </Row>

        <DisplayRow
          label={`*${selectMessage("name")}`}
          children={
            <>
              <Form.Control
                type="text"
                placeholder={selectMessage("name")}
                value={name}
                isInvalid={isSubmitted && !name}
                onChange={(e) => setName(e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                {"Ingrese un valor"}
              </Form.Control.Feedback>
            </>
          }
        />
        {isAdmin && (
          <DisplayRow
            label={`*${selectMessage("status")}`}
            children={
              <>
                <Form.Control
                  as="select"
                  onChange={(event) => {
                    setStatus(event.target.value);
                  }}
                  value={status}
                >
                  {causeStatuses.map((p, i) => (
                    <option key={i} value={p}>
                      {p}
                    </option>
                  ))}
                </Form.Control>
              </>
            }
          />
        )}
        {isAdmin && (
          <DisplayRow
            label={`*${selectMessage("requested_by")}`}
            children={
              <>
                <Form.Control
                  as="select"
                  onChange={(event) => setUser(event.target.value)}
                  placeholder={selectMessage("requestedId")}
                  isInvalid={isSubmitted && !user}
                  value={user}
                >
                  <option value="" hidden>
                    {"Seleccionar Usuario"}
                  </option>
                  {users.map((p, i) => (
                    <option key={i} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                  {"Seleccione un usuario"}
                </Form.Control.Feedback>
              </>
            }
          />
        )}

        <DisplayRow
          label={`*${selectMessage("description")}`}
          children={
            <>
              <Form.Control
                name="Description"
                as="textarea"
                placeholder={selectMessage("description")}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                value={description}
                isInvalid={isSubmitted && !description}
              />
              <Form.Control.Feedback type="invalid">
                {"Ingrese una descripción"}
              </Form.Control.Feedback>
            </>
          }
        />

        <DisplayRow
          label={`${selectMessage("reason")}`}
          children={
            <>
              <TextArea
                name="reason"
                rows={4}
                placeholder={selectMessage("reason")}
                onChange={(e) => setReason(e.target.value)}
                value={reason}
              />
            </>
          }
        />

        <DisplayRow
          label={`${selectMessage("relevant_data")}`}
          children={
            <>
              <TextArea
                name="relevant_data"
                rows={4}
                placeholder={selectMessage("relevant_data")}
                onChange={(e) => setRelevantData(e.target.value)}
                value={relevantData}
              />
            </>
          }
        />

        <Row className="justify-content-end mt-5 mb-5">
          <Button
            variant="outline-primary"
            onClick={() => onCancel()}
            type="button"
            className="center mr-2"
          >
            {selectMessage("cancel_btn")}
          </Button>
          <Button variant="primary" type="submit" className="center">
            {selectMessage("save_btn")}
          </Button>
        </Row>
      </Form>
    </Container>
  );
};

export default CauseForm;
