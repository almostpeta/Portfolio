import React, { useState } from "react";
import Tabs from "react-bootstrap/Tabs";
import { Container } from "react-bootstrap";
import "./Tabs.css";

export const TabsComponent = ({ defaultVal, children, handleKeyChange }) => {
  const [key, setKey] = useState(defaultVal);

  const handleSelect = (key) => {
    setKey(key);
    handleKeyChange && handleKeyChange(key);
  };

  return (
    <Tabs
      id="controlled-tab-example"
      activeKey={key}
      onSelect={(k) => handleSelect(k)}
    >
      {children}
    </Tabs>
  );
};
