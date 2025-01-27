import React from "react";
import { DropdownButton, Dropdown } from "react-bootstrap";

const NavbarItems = () => (
  <>
    <DropdownButton
      variant="outline-light"
      title={"Máquinas"}
      id="input-group-dropdown-2"
    >
      <Dropdown.Item href="/admin/machine/new">Nueva Máquina</Dropdown.Item>
      <Dropdown.Item href="/machines">Mostrar Máquinas</Dropdown.Item>
    </DropdownButton>
    <DropdownButton
      variant="outline-light"
      title={"Usuarios"}
      id="input-group-dropdown-2"
    >
      <Dropdown.Item href="/admin/user/list">
        Trabajar con Usuarios
      </Dropdown.Item>
      <Dropdown.Item href="/admin/user/new">Registrar Usuario</Dropdown.Item>
    </DropdownButton>
  </>
);

export default NavbarItems;
