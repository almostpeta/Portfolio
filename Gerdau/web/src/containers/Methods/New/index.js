import React, { useEffect, useState } from "react";
import { createMethod } from "service/method";
import { Loading } from "components/Loading/index";
import MethodForm from "../forms/method";
import { Toast } from "components/Toast";
import { connect } from "react-redux";
import { NavbarComponent } from "components/Navbar";
import { doFetchSolutions } from "redux/solution/action";
import { Container } from "react-bootstrap";
import useTranslate from "hooks/useTranslate";
import lodash from "lodash";
import { useHistory } from "react-router-dom";

const mapDispatch = (dispatch) => ({
  doFetchSolutionsAction: () => dispatch(doFetchSolutions()),
});
const mapStateToProps = (state) => {
  return {
    allSolutions: state.solution.solutions,
  };
};

const connector = connect(mapStateToProps, mapDispatch);

const NewMethod = (props) => {
  const { doFetchSolutionsAction, allSolutions } = props;
  const t = useTranslate();
  const history = useHistory();
  const { fallback, solutionId } = lodash.pick(props.location?.state, [
    "fallback",
    "solutionId",
  ]);
  //REDUX SETTINGS
  const [solutions, setSolutions] = useState([]);

  useEffect(() => {
    doFetchSolutionsAction();
  }, [doFetchSolutionsAction]);

  useEffect(() => {
    allSolutions && setSolutions(allSolutions);
  }, [allSolutions]);

  // FAULT SETTINGS

  const [methodData, setMethodData] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [methodFiles, setMethodFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // holds as many methods as the user can create in this form
  const createdMethods = [];

  const handleChange = (prop, value) => {
    methodData[prop] = value;
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

  const handleSubmit = async (createNewMethod) => {
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
      };
      const createdMethod = await createMethod(cleanMethod);
      createdMethods.push(createdMethod);
      Toast("success", "El métodose ha ingresado correctamente");
      if (createNewMethod) {
        // clean up form
        setMethodData({ solutionId: methodData.solutionId });
        setSubmitted(false);
      } else if (fallback) {
        history.push(fallback, { methods: createdMethods });
      } else {
        history.push(`/method/detail/${createdMethod.id}`);
      }
    } catch (e) {
      console.error("error", e);
      Toast(
        "error",
        "Ocurrió un error al ingresar el método. Intentelo nuevamente"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {isLoading && <Loading />}
      <NavbarComponent />
      <Container
        style={{
          maxHeight: "100vh",
          height: "100vh",
        }}
      >
        {!isLoading && (
          <MethodForm
            onChange={(p, v) => handleChange(p, v)}
            data={methodData}
            solutionId={solutionId}
            solutionsData={solutions}
            onSubmit={handleSubmit}
            isSubmitted={submitted}
            onCancel={() => handleCancel()}
            files={methodFiles}
            onChangeFiles={(value) => setMethodFiles(value)}
            isEditing={false}
          />
        )}
      </Container>
    </div>
  );
};

export default connector(NewMethod);
