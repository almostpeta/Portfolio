import React, { useEffect, useState, useCallback } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Tree from "react-d3-tree";
import "./Resolution.css";
import { StdButton } from "components/UI/ActionBtn";
import RecordDetailModal from "components/UI/RecordDetailModal";

const TYPES = Object.freeze({
  CAUSE: "Causa",
  FAULT: "Falla",
  METHOD: "Método",
  SOLUTION: "Solución",
});

const parseRecord = (record) => {
  return {
    type: {
      title: "Tipo",
      value: record.type,
    },
    reason: {
      title: "Motivo",
      value: record.reason,
    },
    description: {
      title: "Descripción",
      value: record.description,
    },
    relevant_data: {
      title: "Datos Relevantes",
      value: record.relevant_data,
    },
  };
};

export const useCenteredTree = (defaultTranslate = { x: 0, y: 0 }) => {
  const [translate, setTranslate] = useState(defaultTranslate);
  const containerRef = useCallback((containerElem) => {
    if (containerElem !== null) {
      const { width, height } = containerElem.getBoundingClientRect();
      setTranslate({ x: width / 2, y: height / 2 });
    }
  }, []);
  return [translate, containerRef];
};

const Resolution = ({ faultData }) => {
  const [treeData, setTreeData] = useState(null);
  // workaround to force a re-render and center the tree
  const [forceRerender, setForceRerender] = useState(1);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [translate, containerRef] = useCenteredTree();
  const nodeSize = { x: 200, y: 200 };
  const foreignObjectProps = { width: nodeSize.x, height: nodeSize.y, x: 20 };

  const prepareDataForTree = () => {
    let causes = faultData.causes.map((cause) => ({
      ...cause,
      type: TYPES.CAUSE,
    }));
    const data = {
      name: faultData.name,
      type: TYPES.FAULT,
      children: causes,
    };
    faultData.methods.forEach((m) => {
      m.type = TYPES.METHOD;
      const causeId = m.solution.causeId;
      const foundCause = data.children.find((c) => c.id === causeId);
      if (foundCause) {
        if (!foundCause.children) {
          foundCause.children = [];
        }
        const foundSolution = foundCause.children.find(
          (c) => c.id === m.solution.id
        );
        if (!foundSolution) {
          m.solution.children = [];
          foundCause.children.push(m.solution);

          m.solution.children.push(m);
        } else {
          const foundMethod = foundSolution.children.find(
            (method) => method.id === m.id
          );

          if (!foundMethod) {
            foundSolution.children.push(m);
          }
        }
        m.solution.type = TYPES.SOLUTION;
      }
    });
    setTreeData(data);
  };

  useEffect(() => {
    prepareDataForTree();
  }, [faultData]);

  const handleCenter = () => {
    setForceRerender(forceRerender + 1);
  };

  const selectClassName = (node) => {
    let className = "";
    switch (node.type) {
      case TYPES.FAULT:
        className = "node__fault";
        break;
      case TYPES.CAUSE:
        className = "node__cause";
        break;
      case TYPES.SOLUTION:
        className = "node__solution";
        break;
      case TYPES.METHOD:
        className = "node__method";
        break;
      default:
        className = "node__method";
        break;
    }
    return className;
  };

  const renderNode = ({ nodeDatum, toggleNode, foreignObjectProps }) => {
    return (
      <g onClick={() => setCurrentRecord(nodeDatum)}>
        <circle className={selectClassName(nodeDatum)} r={18}></circle>
        <text fill="black" x="20" dy="0" className="ml-1 font-weight-bold">
          {nodeDatum?.type}
        </text>
        <foreignObject {...foreignObjectProps}>
          <Col xs={10} className="mr-1 text-align-left p-0" size="sm">
            <text fill="black" x="20" dy="20" strokeWidth="1">
              {nodeDatum.name}
            </text>
          </Col>
          {/* The following lines display a button for collapsing/expanding the childrens of a node 
          {nodeDatum.children && (
            <button style={{ width: "100%" }} onClick={toggleNode}>
              {nodeDatum.__rd3t.collapsed ? "Expand" : "Collapse"}
            </button>
          )} */}
        </foreignObject>
      </g>
    );
  };

  return (
    <Container>
      <Row className="mt-4" style={{ float: "right" }}>
        {<StdButton title="Centrar" handleClick={handleCenter} />}
      </Row>
      <Row>
        <div
          id="data-tree-element"
          ref={containerRef}
          style={{ height: "100vh", width: "100%" }}
        >
          {treeData && (
            <Tree
              key={forceRerender}
              zoomable
              collapsible
              orientation="vertical"
              data={treeData}
              nodeSize={{ x: 200, y: 200 }}
              translate={{
                x:
                  document.getElementById("data-tree-element").offsetWidth / 2 >
                  0
                    ? document.getElementById("data-tree-element").offsetWidth /
                      2
                    : window.innerWidth / 3.5,
                y: 100,
              }}
              renderCustomNodeElement={(rd3tProps) =>
                renderNode({ ...rd3tProps, foreignObjectProps })
              }
            />
          )}
        </div>
      </Row>
      {currentRecord && (
        <RecordDetailModal
          valuesByKey={parseRecord(currentRecord)}
          title={currentRecord.name}
          onClose={() => setCurrentRecord(null)}
        />
      )}
    </Container>
  );
};
export default Resolution;
