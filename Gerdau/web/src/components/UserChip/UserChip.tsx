import React from "react";
import "./styles.css";
import { Dropdown } from "react-bootstrap";
import { RiLogoutBoxRLine } from "react-icons/ri";
import useUser from "hooks/useUser";

interface IProps {
  email: any;
  role?: any;
  navOptions?: any;
  handleLogout?: any;
  navigateToAdminHome?: any;
  navigateToStandardHome?: any;
}

const UserChip = ({
  navOptions,
  role,
  email,
  handleLogout,
  navigateToAdminHome,
  navigateToStandardHome,
}: IProps) => {
  const { isAdminView, isAdmin }: any = useUser();
  return (
    <Dropdown>
      <Dropdown.Toggle id="dropdown-custom-1" className="dropDown">
        <div className="UserLoggedin">
          {" "}
          <p style={{ margin: 0 }}>
            Hola{" "}
            <span
              style={{
                margin: 0,
                color: "orange",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              {email}
            </span>
            !
          </p>
          <label
            style={{
              margin: 0,
              fontWeight: 300,
              fontSize: "13px",
              letterSpacing: 1,
            }}
          >
            {role}
          </label>
        </div>
      </Dropdown.Toggle>
      <Dropdown.Menu className="super-colors">
        {isAdmin && !isAdminView && (
          <Dropdown.Item eventKey="1" onClick={navigateToAdminHome}>
            Ir a Administración
          </Dropdown.Item>
        )}
        {isAdmin && isAdminView && (
          <Dropdown.Item eventKey="2" onClick={navigateToStandardHome}>
            Salir de Administración
          </Dropdown.Item>
        )}
        <Dropdown.Item eventKey="3" onClick={handleLogout}>
          {" "}
          <RiLogoutBoxRLine size="17" /> Salir
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};
export default UserChip;
