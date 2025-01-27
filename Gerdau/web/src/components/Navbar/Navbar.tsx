/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Form, Nav, Navbar } from "react-bootstrap";
import { QRReader } from "components/QRReader";
import "./Navbar.css";
import { deleteToken } from "lib/auth";
import { getCurrentUser } from "lib/auth";
import { SearchBar } from "components/SearchBar";
import { UserChip } from "components/UserChip";
import { useHistory, Link } from "react-router-dom";
import useTranslate from "hooks/useTranslate";
import StandardNavbarItems from "./StandardNavbar";
import AdminNavbarItems from "./AdminNavbar";
import useUser from "hooks/useUser";
import AdminChip from "components/UI/AdminChip";

export const NavbarComponent = () => {
  const t = useTranslate();
  const [showQR, setShowQR] = useState(false);
  const history = useHistory();
  const { isAdminView, setIsAdminView, setUser }: any = useUser();

  const handleScan = (data: any) => {
    if (data) {
      setShowQR(false);
      window.location = data;
    }
  };

  const handleLogout = () => {
    deleteToken();
    setUser(null);
    history.push("/login");
  };

  const navigateToAdminHome = () => {
    history.push("/admin/home");
    setIsAdminView(true);
  };

  const navigateToStandardHome = () => {
    history.push("/home");
    setIsAdminView(false);
  };

  const currentUser = getCurrentUser()?.user;

  return (
    <>
      <div className="align-items-center">
        <Navbar expand="lg" className="navbar-container">
          <Navbar.Brand
            as={Link}
            className="title"
            to={`${isAdminView ? "/admin/" : "/"}home`}
          >
            {t("app_title")}
          </Navbar.Brand>
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            style={{ float: "left", alignItems: "left" }}
          />
          <Navbar.Collapse id="basic-navbar-nav" className="navbar">
            <Nav className="mr-auto align-items-center nav">
              {isAdminView && <AdminNavbarItems />}
              {!isAdminView && <StandardNavbarItems />}
            </Nav>
            <Navbar.Toggle />
          </Navbar.Collapse>

          {isAdminView && <AdminChip />}

          <Form
            onSubmit={(e) => {
              e.preventDefault();
            }}
            inline
            style={{ marginTop: "1em" }}
            className="search align-items-center"
          >
            <SearchBar onQRClick={() => setShowQR(true)} />
          </Form>

          {currentUser && (
            <>
              <UserChip
                email={currentUser.firstName}
                role={currentUser.role}
                navigateToAdminHome={navigateToAdminHome}
                navigateToStandardHome={navigateToStandardHome}
                handleLogout={() => handleLogout()}
              />
            </>
          )}
        </Navbar>
        <div
          style={{
            float: "right",
            alignItems: "right",
            width: "300px",
            position: "absolute",
            top: "5%",
            right: "0",
            zIndex: 1000,
          }}
        >
          {showQR && (
            <QRReader
              onDismiss={() => setShowQR(false)}
              onScan={(data: any) => handleScan(data)}
            />
          )}
        </div>
      </div>
    </>
  );
};
