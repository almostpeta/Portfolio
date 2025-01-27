import React from "react";
import { useHistory } from "react-router-dom";
import { Toast } from "components/Toast";
import { editSolution } from "service/solution";
import { sanitizeEntries } from "utils/sanitize";
import SolutionForm from "../Form";

const Edit = ({ solution, setIsLoading, message, causes, users }) => {
  const history = useHistory();
  const handleCancel = () => {
    history.goBack();
  };

  const handleSubmit = async (inputs) => {
    try {
      setIsLoading(true);
      await editSolution(inputs);
      history.push(`/solution/detail/${solution.id}`);
      Toast("success", message("success"));
    } catch (e) {
      Toast("error", message("error"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {solution && (
        <SolutionForm
          initValues={sanitizeEntries({
            ...solution,
            cause: solution.cause?.id,
          })}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          variant="edit"
          causes={causes}
          users={users}
        />
      )}
    </>
  );
};

export default Edit;
