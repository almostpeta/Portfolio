import React, { useEffect, useState } from "react";
import "../../machines/Detail/detail.css";
import { useHistory } from "react-router-dom";
import { Loading } from "components/Loading/index";
import { Row, Col } from "react-bootstrap";
import { Button } from "components/Button";
import AnimatedNumber from "react-animated-number";
import { BsPencil } from "react-icons/bs";
import moment from "moment";
import useTranslate from "hooks/useTranslate";
import useUser from "hooks/useUser";

const DetailPage = ({ piece }) => {
  const history = useHistory();
  const t = useTranslate();
  const { isAdmin, isAdminView, setIsAdminView } = useUser();

  const [isLoading, setIsLoading] = useState(true);

  const pieceMessages = "pieces.detail";
  const selectMessage = (value) => t(pieceMessages.concat("." + value));
  useEffect(() => {
    setIsLoading(!piece);
  }, [piece]);

  const handleEditClick = () => {
    if (!isAdminView) {
      setIsAdminView(true);
    }
    history.push(`/admin/machine/edit/${piece.component.machineId}`, {
      variant: "piece",
      recordId: piece.id,
    });
  };

  return (
    <div>
      {isLoading && <Loading />}
      <div className="machineContainer">
        {piece && Object.keys(piece).length !== 0 && (
          <div>
            {isAdmin && (
              <div className="d-flex justify-content-end">
                <div className="d-flex justify-content-end mb-3">
                  <Button onClick={() => handleEditClick()}>
                    {" "}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <BsPencil size={17} style={{ marginRight: "3px" }} />
                      {selectMessage("edit_btn")}
                    </div>
                  </Button>
                </div>
              </div>
            )}
            <div className="machineInfoGroup">
              <span className="machineTitle">
                {selectMessage("detail_title")}
              </span>
              <div className="machineBasicData">
                {piece.internal_name && (
                  <div className="basicDataItem">
                    <span> {selectMessage("internal_name")}: &ensp;</span>
                    <div>{piece["internal_name"]} </div>
                  </div>
                )}
                {piece.component && (
                  <div className="basicDataItem">
                    <span> {selectMessage("component")}: &ensp;</span>
                    <a href={`/component/detail/${piece["component"].id}`}>
                      {piece["component"].internal_name}{" "}
                    </a>
                  </div>
                )}
                {piece.machine && (
                  <div className="basicDataItem">
                    <span> {selectMessage("machine")}: &ensp;</span>
                    <a href={`/machine/detail/${piece["machine"].id}`}>
                      {piece["machine"].internal_name}{" "}
                    </a>
                  </div>
                )}
                {piece.make && (
                  <div className="basicDataItem">
                    <span> {selectMessage("make")}:&ensp;</span>
                    <div>{piece.make}</div>
                  </div>
                )}
                {piece.model && (
                  <div className="basicDataItem">
                    <span> {selectMessage("model")}:&ensp;</span>
                    <div>{piece.model} </div>
                  </div>
                )}

                {piece.manufacturer && (
                  <div className="basicDataItem">
                    <span> {selectMessage("manufacturer")}:&ensp;</span>
                    <div>{piece.manufacturer}</div>
                  </div>
                )}
                {piece.manufacturer_type && (
                  <div className="basicDataItem">
                    <span> {selectMessage("manufacturer_type")}:&ensp;</span>
                    <div>{piece.manufacturer_type}</div>
                  </div>
                )}
                {piece.user && (
                  <div className="basicDataItem">
                    <span> {selectMessage("user")}:&ensp;</span>
                    <div>{piece.user.name}</div>
                  </div>
                )}
                {piece.provider && (
                  <div className="basicDataItem">
                    <span> {selectMessage("provider")}:&ensp;</span>
                    <div>{piece.provider}</div>
                  </div>
                )}
                {piece.type && (
                  <div className="basicDataItem">
                    <span>{selectMessage("piece_type")}:&ensp;</span>
                    <div>{piece.type}</div>
                  </div>
                )}
                {piece.identifier && (
                  <div className="basicDataItem">
                    <span>{selectMessage("identifier")}:&ensp;</span>
                    <div>{piece.identifier}</div>
                  </div>
                )}
              </div>
            </div>

            {piece["specifications"] && (
              <div className="machineInfoGroup">
                <span className="machineTitle">
                  {selectMessage("specifications")}
                </span>
                <div className="machineDescription">
                  {" "}
                  {piece["specifications"]}
                </div>
              </div>
            )}

            {piece["relevant_data"] && (
              <div className="machineInfoGroup">
                <span className="machineTitle">
                  {selectMessage("relevant_data")}
                </span>
                <div className="machineDescription">
                  {" "}
                  {piece["relevant_data"]}
                </div>
              </div>
            )}
            <Row>
              <Col lg="4">
                <div className="machineInfoGroup">
                  <span className="machineTitle"> Fallas eléctricas</span>
                  <div className="machineLocation">
                    <AnimatedNumber
                      component="text"
                      value={piece.electric_faults_count || 0}
                      style={{
                        transition: "2s ease-out",
                        fontSize: 48,
                        transitionProperty: "background-color, color, opacity",
                      }}
                      // frameStyle={(perc) =>
                      //   perc === 200 ? {} : { backgroundColor: "white" }
                      // }
                      stepPrecision={0}
                      duration={3500}
                      // formatValue={(n) => prettyBytes(n)}
                    />
                  </div>
                </div>
              </Col>
              <Col lg="4">
                <div className="machineInfoGroup">
                  <span className="machineTitle"> Fallas neumáticas</span>
                  <div className="machineLocation">
                    <AnimatedNumber
                      component="text"
                      value={piece.neumatic_faults_count || 0}
                      style={{
                        transition: "2s ease-out",
                        fontSize: 48,
                        transitionProperty: "background-color, color, opacity",
                      }}
                      // frameStyle={(perc) =>
                      //   perc === 200 ? {} : { backgroundColor: "white" }
                      // }
                      stepPrecision={0}
                      duration={3500}
                      // formatValue={(n) => prettyBytes(n)}
                    />
                  </div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col lg="4">
                <div className="machineInfoGroup">
                  <span className="machineTitle"> Fallas hidráulicas</span>
                  <div className="machineLocation">
                    <AnimatedNumber
                      component="text"
                      value={piece.hydraulic_faults_count || 0}
                      style={{
                        transition: "2s ease-out",
                        fontSize: 48,
                        transitionProperty: "background-color, color, opacity",
                      }}
                      // frameStyle={(perc) =>
                      //   perc === 200 ? {} : { backgroundColor: "white" }
                      // }
                      stepPrecision={0}
                      duration={3500}
                      // formatValue={(n) => prettyBytes(n)}
                    />
                  </div>
                </div>
              </Col>
              <Col lg="4">
                <div className="machineInfoGroup">
                  <span className="machineTitle"> Fallas mecánicas</span>
                  <div className="machineLocation">
                    <AnimatedNumber
                      component="text"
                      value={piece.mechanic_faults_count || 0}
                      style={{
                        transition: "2s ease-out",
                        fontSize: 48,
                        transitionProperty: "background-color, color, opacity",
                      }}
                      // frameStyle={(perc) =>
                      //   perc === 200 ? {} : { backgroundColor: "white" }
                      // }
                      stepPrecision={0}
                      duration={3500}
                      // formatValue={(n) => prettyBytes(n)}
                    />
                  </div>
                </div>
              </Col>
            </Row>
            {piece["working_from_date"] && (
              <div className="machineInfoGroup">
                <span className="machineTitle">
                  {" "}
                  {selectMessage("working_from_date")}
                </span>
                <div className="machineLocation">
                  {piece["working_from_date"] && (
                    <div className="basicDataItem">
                      <span>{selectMessage("working_from_date")}:&ensp;</span>
                      {moment(piece["working_from_date"]).format("L")}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {piece && Object.keys(piece).length === 0 && (
        <div>No Se encontraron datos de la pieza.</div>
      )}
    </div>
  );
};

export default DetailPage;
