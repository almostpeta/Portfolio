import React, { useState, useEffect } from "react";
import { createStudy } from "service/study.js";
import { Loading } from "components/Loading/index";
import { Toast } from "components/Toast";
import { connect } from "react-redux";
import { NavbarComponent } from "components/Navbar";
import { doFetchComponents } from "redux/component/action";
import { doFetchPieces } from "redux/piece/action";
import moment from "moment";
import { StudyForm } from "containers/studies/Forms/Study";
import useTranslate from "hooks/useTranslate";
import { useHistory } from "react-router-dom";
import { getCurrentUser } from "lib/auth";

const mapDispatch = (dispatch) => ({
  doFetchComponentsAction: () => dispatch(doFetchComponents()),
  doFetchPiecesAction: () => dispatch(doFetchPieces()),
});
const mapStateToProps = (state) => {
  return {
    allComponents: state.component.components,
    allPieces: state.piece.pieces,
    componentsLoading: state.component.loading,
    piecesLoading: state.piece.loading,
  };
};
const connector = connect(mapStateToProps, mapDispatch);

const NewStudy = (props) => {
  const {
    doFetchComponentsAction,
    doFetchPiecesAction,
    allComponents,
    allPieces,
    componentsLoading,
    piecesLoading,
  } = props;
  const t = useTranslate();
  const history = useHistory();
  const [submitted, setSubmitted] = useState(false);
  const [goBack, setGoBack] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [areComponentsLoading, setAreComponentesLoading] = useState(
    componentsLoading
  );
  const [arePiecesLoading, setArePiecesLoading] = useState(piecesLoading);
  const [studyData, setStudyData] = useState({});
  const [componentsData, setComponentsData] = useState([]);
  const [piecesData, setPiecesData] = useState([]);
  const componentId = props.location?.state?.componentId;
  const pieceId = props.location?.state?.pieceId;

  const currentUser = getCurrentUser()?.user;

  useEffect(() => {
    doFetchComponentsAction();
  }, [doFetchComponentsAction]);

  useEffect(() => {
    doFetchPiecesAction();
  }, [doFetchPiecesAction]);

  useEffect(() => {
    allComponents && setComponentsData(allComponents);
  }, [allComponents]);

  useEffect(() => {
    allPieces && setPiecesData(allPieces);
  }, [allPieces]);

  useEffect(() => {
    setArePiecesLoading(piecesLoading);
  }, [piecesLoading]);

  useEffect(() => {
    setAreComponentesLoading(componentsLoading);
  }, [componentsLoading]);

  const validateStudyData = () => {
    const { internal_name, componentId, pieceId, date } = studyData;
    const validation = internal_name && (componentId || pieceId) && date;
    return validation;
  };

  const handleSaveAndGoBack = (ev) => {
    setSubmitted(ev);
    setGoBack(true);
  };

  const handleSave = (ev) => {
    setSubmitted(ev);
    setGoBack(false);
  };

  const studyChange = (prop, value) => {
    studyData[prop] = value;
  };

  const handleCreateStudy = async () => {
    try {
      studyData.date = moment(studyData.date).format();
      const data = {
        ...studyData,
        userId: currentUser?.id,
        componentId: !!studyData.pieceId ? null : studyData.componentId,
      };
      if (!validateStudyData()) {
        Toast("error", "Hay campos que requieren atención");
        return;
      }
      if (validateStudyData()) {
        setIsLoading(true);
        await createStudy(data).then((response) => {
          setIsLoading(false);
          setSubmitted(false);
          Toast("success", "se han guardado los datos del estudio");
          if (!goBack || (!componentId && !pieceId)) {
            history.push(`/study/detail/${response.id}`);
          } else {
            componentId
              ? history.push(`/component/detail/${componentId}`)
              : history.push(`/piece/detail/${pieceId}`);
          }
        });
      }
    } catch (e) {
      Toast("error", "Error al guardar los datos del estudio");
      console.log(e);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    submitted && handleCreateStudy();
  }, [submitted]);

  const handleCancel = () => {
    history.push("/home");
  };

  return (
    <div>
      <NavbarComponent />
      {(isLoading || arePiecesLoading || areComponentsLoading) && <Loading />}
      {!isLoading && !arePiecesLoading && !areComponentsLoading && (
        <StudyForm
          data={studyData}
          onCancel={handleCancel}
          onChange={(prop, value) => studyChange(prop, value)}
          isSubmited={submitted}
          onSubmit={(ev) => handleSave(ev)}
          onSubmitAndReturn={(ev) => handleSaveAndGoBack(ev)}
          enableSaveAndReturn={!!componentId || !!pieceId}
          components={componentsData}
          pieces={piecesData}
          isEditing={false}
          loading={isLoading || arePiecesLoading || areComponentsLoading}
          componentId={componentId}
          pieceId={pieceId}
        />
      )}
    </div>
  );
};

export default connector(NewStudy);
