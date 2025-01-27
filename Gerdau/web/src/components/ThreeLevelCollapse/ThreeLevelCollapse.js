import React from "react";
import { Col } from "react-bootstrap";
import { WarningAlert } from "components/UI/Alert";
import Item, { ParentItem } from "components/UI/Item";

const ThreeLevelCollapse = ({
  data,
  onDetailClick,
  onSelectClick,
  variant,
  onAddFirstParent,
  onAddSecondParent,
  firstLevelWarning,
  secondLevelWarning,
}) => (
  <>
    {data.map((element) => (
      <Col key={element.id} xs={12} className="mt-2">
        <ParentItem
          item={element}
          variant="cause"
          label={"Causa"}
          onAdd={onAddFirstParent}
        />
        {element?.children?.length > 0 &&
          element?.children.map((child) => (
            <Col
              key={child.id}
              xs={12}
              className="mt-2"
              // style={{ paddingRight: 0 }}
            >
              <ParentItem
                item={child}
                variant="solution"
                label={"Solución"}
                onAdd={onAddSecondParent}
              />
              {child?.methods?.length > 0 &&
                child?.methods.map((secondLevelChild) => (
                  <Col
                    key={secondLevelChild.id}
                    xs={12}
                    style={{ paddingRight: 0 }}
                  >
                    <Item
                      item={secondLevelChild}
                      onDetailClick={onDetailClick}
                      onSelectClick={onSelectClick}
                      includeChip
                      chipLabel="Método"
                      variant="method"
                    />
                  </Col>
                ))}
              {child?.methods?.length === 0 && (
                <Col className="ml-2 mr-2">
                  <WarningAlert title={secondLevelWarning} />
                </Col>
              )}
            </Col>
          ))}
        {element?.children?.length === 0 && (
          <Col className="ml-2 mr-2">
            <WarningAlert title={firstLevelWarning} />
          </Col>
        )}
      </Col>
    ))}
  </>
);

export default ThreeLevelCollapse;
