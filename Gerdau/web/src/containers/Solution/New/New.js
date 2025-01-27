import React from "react";
import Form from "../Form";
import { useHistory } from "react-router-dom";
import { createSolution } from "service/solution";
import { Toast } from "components/Toast";
import useTranslate from "hooks/useTranslate";

const Solution = ({ setIsLoading, causeId, causes, fallback, users }) => {
  const t = useTranslate();
  const history = useHistory();
  const message = (field) => t(`containers.solutions.new.${field}`);
  const handleSubmit = async (inputs, insertMethods) => {
    try {
      setIsLoading(true);
      const insertedSolution = await createSolution(inputs);
      if (insertMethods) {
        history.push("/method/new", {
          solutionId: insertedSolution.id,
          fallback,
        });
      } else if (fallback) {
        history.push(fallback, { solution: insertedSolution });
      } else {
        history.push(`/solution/detail/${insertedSolution.id}`);
      }
      Toast("success", message("success"));
    } catch (e) {
      Toast("error", message("error"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    history.push("/home");
  };

  return (
    <Form
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      causeId={causeId}
      causes={causes}
      users={users}
    />
  );
};

export default Solution;
