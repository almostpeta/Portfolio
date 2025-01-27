import React, { useEffect, useState } from "react";
import { editMethod } from "service/method";
import { Loading } from "components/Loading/index";
import MethodForm from "../forms/method";
import { Toast } from "components/Toast";
import { connect } from "react-redux";
import { getFiles } from "service/method";
import { doFetchSolutions } from "redux/solution/action";
import { NavbarComponent } from "components/Navbar";
import { doFetchMethod } from "redux/method/action";
import { Container } from "react-bootstrap";
import useTranslate from "hooks/useTranslate";
import { useHistory } from "react-router-dom";

const mapDispatch = (dispatch) => ({
  doFetchMethodAction: (id) => dispatch(doFetchMethod(id)),
  doFetchSolutionsAction: () => dispatch(doFetchSolutions()),
});
const mapStateToProps = (state) => {
  return {
    allSolutions: state.solution.solutions,
    currentMethod: state.method.currentMethod,
    methodLoading: state.method.loading,
  };
};

const connector = connect(mapStateToProps, mapDispatch);

const EditMethod = (props) => {
  const {
    doFetchMethodAction,
    doFetchSolutionsAction,
    allSolutions,
    currentMethod,
    methodLoading,
  } = props;
  const t = useTranslate();
  const history = useHistory();
  const methodId = props.match.params.id;

  // FAULT SETTINGS
  const [methodData, setMethodData] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [methodFiles, setMethodFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [solutions, setSolutions] = useState(allSolutions || []);
  const [methodDeletedFiles, setMethodDeletedFiles] = useState([]);
  const handleChange = (prop, value) => {
    methodData[prop] = value;
  };

  //REDUX SETTINGS
  useEffect(() => {
    doFetchMethodAction(methodId);
  }, [doFetchMethodAction]);

  useEffect(() => {
    currentMethod && setMethodData(currentMethod);
    getAllMethodFiles(currentMethod);
  }, [currentMethod]);

  useEffect(() => {
    setIsLoading(methodLoading);
  }, [methodLoading]);

  useEffect(() => {
    doFetchSolutionsAction();
  }, [doFetchSolutionsAction]);

  useEffect(() => {
    allSolutions && setSolutions(allSolutions);
  }, [allSolutions]);

  const getAllMethodFiles = async (method) => {
    let files =
      method &&
      method.methodFiles &&
      (await getFiles(method.methodFiles)).filter((file) => file.isActive);
    files && setMethodFiles(files);
  };

  const validateFormData = () => {
    let isValid = true;
    isValid &= !!methodData.name;
    isValid &= !!methodData.solutionId;
    return isValid;
  };

  const handleCancel = () => {
    history.push("/home");
  };

  const handleSubmit = async () => {
    setSubmitted(true);
    try {
      if (!validateFormData) {
        Toast("error", "Verifique los campos y vuelva a intentarlo");
        return;
      }
      setIsLoading(true);
      let cleanMethod = {
        ...methodData,
        isActive: 1,
        deleteFiles: methodDeletedFiles,
      };
      await editMethod(cleanMethod, methodId)
        .then((response) => {
          Toast("success", "El método se se ha editado correctamente");
          history.push(`/method/detail/${response.id}`);
        })
        .catch((error) => {
          console.error("error", error);
          Toast(
            "error",
            "Ocurrió un error al editar el método. Inténtelo nuevamente"
          );
        });
    } catch (e) {
      Toast("error", e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <NavbarComponent />
      <Container
        style={{
          maxHeight: "100vh",
          height: "100vh",
        }}
      >
        {isLoading && <Loading />}
        {!isLoading && (
          <MethodForm
            onChange={(p, v) => handleChange(p, v)}
            data={methodData}
            solutionsData={solutions}
            onSubmit={(e) => handleSubmit()}
            isSubmitted={submitted}
            onCancel={() => handleCancel()}
            files={methodFiles}
            onDeleteFile={(value) => setMethodDeletedFiles(value)}
            deleteFiles={methodDeletedFiles}
            onChangeFiles={(value) => setMethodFiles(value)}
            isEditing={true}
          />
        )}
      </Container>
    </div>
  );
};

export default connector(EditMethod);
