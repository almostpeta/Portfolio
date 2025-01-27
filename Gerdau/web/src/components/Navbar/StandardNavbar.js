import React from "react";
import useUser from "hooks/useUser";
import { DropdownButton, Dropdown } from "react-bootstrap";

const NavbarItems = () => {
  const { isAdmin, isOperator } = useUser();
  return (
    <>
      <DropdownButton
        variant="outline-light"
        title={"Listados"}
        id="input-group-dropdown-2"
      >
        <Dropdown.Item href="/machines">Listar Máquinas</Dropdown.Item>
        <Dropdown.Item href="/components/list">
          Listar Componentes
        </Dropdown.Item>
        <Dropdown.Item href="/pieces/list">Listar Piezas</Dropdown.Item>
      </DropdownButton>
      <DropdownButton
        variant="outline-light"
        title={"Fallas"}
        id="input-group-dropdown-2"
      >
        <Dropdown.Item href="/fault/new">Reportar Nueva Falla</Dropdown.Item>
        <Dropdown.Item href="/fault/list">Trabajar con Fallas</Dropdown.Item>
      </DropdownButton>
      <DropdownButton
        variant="outline-light"
        title={"Soluciones"}
        id="input-group-dropdown-2"
      >
        {!isOperator && (
          <Dropdown.Item href="/solution/new">Nueva Solución</Dropdown.Item>
        )}
        <Dropdown.Item href="/solution/list">
          Trabajar con Soluciones
        </Dropdown.Item>
      </DropdownButton>
      <DropdownButton
        variant="outline-light"
        title={"Causas"}
        id="input-group-dropdown-2"
      >
        {!isOperator && (
          <Dropdown.Item href="/cause/new">Nueva Causa</Dropdown.Item>
        )}
        <Dropdown.Item href="/cause/list">Trabajar con Causas</Dropdown.Item>
      </DropdownButton>
      <DropdownButton
        variant="outline-light"
        title={"Tareas"}
        id="input-group-dropdown-2"
      >
        {isAdmin && <Dropdown.Item href="/task/new">Nueva Tarea</Dropdown.Item>}
        <Dropdown.Item href="/task/list">Trabajar con Tareas</Dropdown.Item>
      </DropdownButton>
      <DropdownButton
        variant="outline-light"
        title={"Estudios"}
        id="input-group-dropdown-2"
      >
        {!isOperator && (
          <Dropdown.Item href="/study/new">Nuevo Estudio</Dropdown.Item>
        )}
        <Dropdown.Item href="/study/list">Trabajar con Estudios</Dropdown.Item>
      </DropdownButton>
    </>
  );
};

export default NavbarItems;
