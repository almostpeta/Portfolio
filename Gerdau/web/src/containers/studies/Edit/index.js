import React, { useState, useEffect } from "react";
import { editStudy } from "service/study";
import { Loading } from "components/Loading/index";
import { Toast } from "components/Toast";
import { connect } from "react-redux";
import { doFetchComponents } from "redux/component/action";
import { doFetchPieces } from "redux/piece/action";
import { doFetchStudy } from "redux/study/action";
import { NavbarComponent } from "components/Navbar";
import moment from "moment";
import { getFiles } from "service/study";
import { StudyForm } from "containers/studies/Forms/Study";
import useTranslate from "hooks/useTranslate";
import { useHistory } from "react-router-dom";

const mapDispatch = (dispatch) => ({
  doFetchComponentsAction: () => dispatch(doFetchComponents()),
  doFetchPiecesAction: () => dispatch(doFetchPieces()),
  doFetchStudyAction: (studyId) => dispatch(doFetchStudy(studyId)),
});
const mapStateToProps = (state) => {
  return {
    allComponents: state.component.components,
    allPieces: state.piece.pieces,
    currentStudy: state.study.currentStudy,
    studyLoading: state.study.loading,
    componentsLoading: state.component.loading,
    piecesLoading: state.piece.loading,
  };
};
const connector = connect(mapStateToProps, mapDispatch);
const EditPiece = (props) => {
  const history = useHistory();

  const {
    doFetchComponentsAction,
    doFetchPiecesAction,
    doFetchStudyAction,
    allComponents,
    allPieces,
    currentStudy,
    componentsLoading,
    piecesLoading,
    studyLoading,
  } = props;
  const studyId = props.match.params.id;
  const t = useTranslate();
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [areComponentsLoading, setAreComponentesLoading] =
    useState(componentsLoading);
  const [arePiecesLoading, setArePiecesLoading] = useState(piecesLoading);
  const [isStudyLoading, setIsStudyLoading] = useState(studyLoading);
  const [studyData, setStudyData] = useState({});
  const [studyFiles, setStudyFiles] = useState([]);
  const [componentsData, setComponentsData] = useState([]);
  const [piecesData, setPiecesData] = useState([]);
  const [studyDeletedFiles, setStudyDeletedFiles] = useState([]);
  const [cancel, setCancel] = useState(false);
  const [previousData, setPreviousData] = useState({});

  const getAllStudyFiles = async (study) => {
    let files =
      study &&
      study.studyFiles &&
      (await getFiles(study.studyFiles)).filter((file) => file.isActive);
    files && setStudyFiles(files);
  };

  useEffect(() => {
    doFetchComponentsAction();
  }, [doFetchComponentsAction]);

  useEffect(() => {
    doFetchPiecesAction();
  }, [doFetchPiecesAction]);

  useEffect(() => {
    studyId && doFetchStudyAction(studyId);
  }, [studyId, doFetchStudyAction]);

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
    setIsStudyLoading(studyLoading);
  }, [studyLoading]);

  useEffect(() => {
    setAreComponentesLoading(componentsLoading);
  }, [componentsLoading]);

  const handleSave = (ev) => {
    setSubmitted(ev);
  };

  useEffect(() => {
    if (currentStudy) {
      const cleanData = { ...currentStudy };
      setStudyData(currentStudy);
      setPreviousData(cleanData);
      getAllStudyFiles(currentStudy);
    }
  }, [currentStudy]);

  const validateStudyData = () => {
    const { internal_name, componentId, pieceId, date } = studyData;
    const validation = internal_name && (componentId || pieceId) && date;
    return validation;
  };

  const studyChange = (prop, value) => {
    studyData[prop] = value;
  };

  useEffect(() => {
    cancel && onCancel();
  }, [cancel]);

  const handleEditStudy = async () => {
    setSubmitted(false);
    try {
      studyData.date = moment(studyData.date).format();
      studyData.deleteFiles = studyDeletedFiles;
      const data = {
        ...studyData,
        componentId: !!studyData.pieceId ? null : studyData.componentId,
      };
      if (!validateStudyData()) {
        Toast("error", "Hay campos que requieren atención");
        return;
      }
      if (validateStudyData()) {
        setIsLoading(true);
        await editStudy(data, studyId).then((response) => {
          setIsLoading(false);
          Toast("success", "Se han guardado los datos del estudio");
          setSubmitted(false);
          history.push(`/study/detail/${studyId}`);
        });
      }
    } catch (e) {
      Toast("error", "Error al guardar los datos del estudio");
      console.error(e);
      setIsLoading(false);
    }
  };

  const onCancel = () => {
    setCancel(false);
    const {
      internal_name,
      reason,
      componentId,
      pieceId,
      date,
      studyFiles,
      files,
      id,
    } = previousData;

    setStudyData({
      internal_name,
      reason,
      componentId,
      pieceId,
      date,
      studyFiles,
      files,
      id,
    });

    history.push(`/study/detail/${id}`);
  };

  useEffect(() => {
    submitted && handleEditStudy();
  }, [submitted]);

  return (
    <div>
      <NavbarComponent />
      {(isLoading ||
        arePiecesLoading ||
        areComponentsLoading ||
        isStudyLoading) && <Loading />}
      {!isLoading &&
        !arePiecesLoading &&
        !areComponentsLoading &&
        !isStudyLoading && (
          <StudyForm
            data={studyData}
            onChange={(prop, value) => studyChange(prop, value)}
            isSubmited={submitted}
            onSubmit={(ev) => handleSave(ev)}
            onCancel={() => setCancel(true)}
            components={componentsData}
            pieces={piecesData}
            isEditing={true}
            files={studyFiles}
            onDeleteFile={(value) => setStudyDeletedFiles(value)}
            deleteFiles={studyDeletedFiles}
          />
        )}
    </div>
  );
};

export default connector(EditPiece);
