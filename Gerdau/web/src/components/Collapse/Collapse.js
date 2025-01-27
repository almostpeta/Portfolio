import React, { useState, useEffect } from "react";
import Accordion from "react-bootstrap/Accordion";
import { useAccordionToggle } from "react-bootstrap/AccordionToggle";
import { Card, Button } from "react-bootstrap";
import { CaretRight, CaretDown, Filter } from "../UI/Dropdown/index";

const CustomToggle = ({ children, eventKey, defaultOpen }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const decoratedOnClick = useAccordionToggle(eventKey, () => {
    setIsOpen(!isOpen);
    // console.log("totally custom!");
  });

  return (
    <div
      onClick={decoratedOnClick}
      style={{
        display: "flex",
        alignItems: "center",
      }}
    >
      {isOpen ? (
        <CaretDown
          size="2x"
          style={{ transition: "opacity 700ms ease-in", marginRight: "8px" }}
        />
      ) : (
        <CaretRight
          size="2x"
          style={{ transition: "opacity 700ms ease-in", marginRight: "13px" }}
        />
      )}
      {children}
    </div>
  );
};

const FilteringToggle = ({ children, eventKey }) => {
  const [isOpen, setIsOpen] = useState(false);
  const decoratedOnClick = useAccordionToggle(eventKey, () => {
    setIsOpen(!isOpen);
  });

  return (
    <div
      onClick={decoratedOnClick}
      style={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <Filter
        size="1x"
        style={{ transition: "opacity 700ms ease-in", marginRight: "13px" }}
      />
      {children}
    </div>
  );
};

export const Collapse = ({
  childrens,
  onDelete,
  onDetails,
  onChangeHeader,
  headerPlaceholder,
  data,
  defaultTitle,
  titleProp,
  defaultActiveKey,
  onCloneClick,
}) => {
  const [components, setComponents] = useState(data);
  const [forms, setForms] = useState(childrens);
  useEffect(() => {
    setComponents(data);
  }, [data]);

  useEffect(() => {
    setForms(childrens);
  }, [childrens]);

  return (
    <>
      {defaultActiveKey !== -1 && (
        <Accordion defaultActiveKey={`${defaultActiveKey}`}>
          {forms.map((c, index) => (
            <Card key={index} active>
              <Card.Header>
                <CustomToggle
                  eventKey={`${index}`}
                  defaultOpen={index == defaultActiveKey}
                >
                  <div
                    style={{
                      width: "70%",
                      display: "flex",
                    }}
                  >
                    <span style={{ marginRight: "30px" }}>
                      {" "}
                      {`${defaultTitle} ${index + 1}`}
                      {components[index][`${titleProp}`] &&
                        ` - ${components[index][`${titleProp}`]}`}
                    </span>
                  </div>
                  <div
                    style={{
                      width: "30%",
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    {components[index].isPiece && (
                      <Button
                        onClick={() => onCloneClick(index)}
                        variant="outline-info"
                        size="sm"
                        style={{ marginRight: "2px" }}
                      >
                        Clonar
                      </Button>
                    )}
                    {
                      <Button
                        hidden={!components[index].id}
                        onClick={() => onDetails(index)}
                        variant="outline-info"
                        size="sm"
                        style={{ marginRight: "2px" }}
                      >
                        Detalles
                      </Button>
                    }
                    <Button
                      onClick={() => onDelete(index)}
                      variant="outline-danger"
                      size="sm"
                    >
                      Eliminar
                    </Button>
                  </div>
                </CustomToggle>
              </Card.Header>
              <Accordion.Collapse eventKey={`${index}`}>
                <Card.Body>{c}</Card.Body>
              </Accordion.Collapse>
            </Card>
          ))}
        </Accordion>
      )}
    </>
  );
};

export const GenericCollapse = ({ childrens, defaultTitle, titleProp }) => {
  return (
    <Accordion style={{ width: "100%" }}>
      <Card key={"index"} active>
        <Card.Header style={{ cursor: "pointer" }}>
          <FilteringToggle eventKey="filterCollapse">
            <span style={{ marginRight: "30px" }}> {defaultTitle}</span>
          </FilteringToggle>
        </Card.Header>
        <Accordion.Collapse eventKey="filterCollapse">
          <Card.Body>{childrens}</Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  );
};
