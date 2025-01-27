import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import "./Item.css";
import Switch from "react-switch";
import { getItemStyles, getChildItemLabel } from "utils/Item";
import { Plus } from "react-bootstrap-icons";
import { Button } from "components/Button";

const Chip = ({ label, variant = "solution" }) => {
  const { background, color } = getItemStyles(variant);
  return (
    <span
      style={{
        backgroundColor: background,
        borderRadius: "4px",
        width: "55px",
        fontSize: "10px",
        marginLeft: "2px",
        color: color,
        textAlign: "center",
        padding: "4px",
      }}
    >
      {label}
    </span>
  );
};

export const ParentItem = ({ item, label, variant, onAdd }) => {
  const { border } = getItemStyles(variant);
  return (
    <Row
      className="parent-item-container mt-3 justify-content-between"
      style={{ padding: 0, margin: 0, borderLeft: `10px solid ${border}` }}
    >
      <Chip label={label} variant={variant} />
      <Col>{item.name}</Col>
      {onAdd && (
        <Button
          size="sm"
          className="mr-2"
          variant={"outline-info"}
          onClick={() => onAdd(item.id)}
        >
          <Plus size={25} /> {`Nueva ${getChildItemLabel(variant)}`}
        </Button>
      )}
    </Row>
  );
};

const Item = ({
  item,
  onDetailClick,
  onSelectClick,
  includeChip,
  chipLabel,
  variant,
}) => {
  const [isSelected, setIsSelected] = useState(item.isSelected || false);
  const { border } = getItemStyles(variant);

  const handleClick = () => {
    setIsSelected(!isSelected);
    onSelectClick(item);
  };

  return (
    <Row
      className="item-container mt-3 justify-content-between"
      style={{
        padding: 0,
        margin: 0,
        borderLeft: `10px solid ${border}`,
      }}
    >
      {includeChip && <Chip label={chipLabel} variant={variant} />}
      <Col className="mr-0 ml-2">{item.name}</Col>
      <Col className="d-flex justify-content-end align-items-center">
        <Button
          className="mr-3"
          variant="info"
          onClick={() => onDetailClick(item)}
        >
          Detalles
        </Button>
      </Col>
      {onSelectClick && (
        <Col xs={3} lg={2} style={{ padding: 0 }}>
          <Switch
            checked={isSelected}
            onChange={handleClick}
            onColor="#86d3ff"
            onHandleColor="#2693e6"
            handleDiameter={30}
            uncheckedIcon={false}
            checkedIcon={false}
            boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
            activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
            height={20}
            width={48}
            className="react-switch"
            id="material-switch"
          />
        </Col>
      )}
    </Row>
  );
};
export default Item;
