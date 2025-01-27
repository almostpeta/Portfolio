import React from "react";
import { Col } from "react-bootstrap";
import { WarningAlert } from "components/UI/Alert";
import Item, { ParentItem } from "components/UI/Item";

const CustomCollapse = ({
  data,
  onDetailClick,
  onSelectClick,
  onAdd,
  parentItemVariant,
  itemVariant,
  firstLevelWarning,
}) => (
  <>
    {data.map((d) => (
      <Col key={d.id} xs={12} className="mt-2">
        <ParentItem
          item={d}
          variant={parentItemVariant}
          label={"causa"}
          onAdd={onAdd}
        />
        {d.children.length > 0 &&
          d.children.map((child) => (
            <Col key={child.id} xs={12} style={{ paddingRight: 0 }}>
              <Item
                item={child}
                onDetailClick={onDetailClick}
                onSelectClick={onSelectClick}
                includeChip
                chipLabel="solución"
                variant={itemVariant}
              />
            </Col>
          ))}
        {d.children.length === 0 && (
          <Col className="ml-2 mr-2">
            <WarningAlert title={firstLevelWarning} />
          </Col>
        )}
      </Col>
    ))}
  </>
);

export default CustomCollapse;
