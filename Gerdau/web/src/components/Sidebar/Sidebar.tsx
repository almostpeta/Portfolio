/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Popover, OverlayTrigger } from "react-bootstrap";
import {
  SidebarContainerStyled,
  ContainerStyled,
  NavitemContainerStyled,
  NavItemLogoStyled,
  ContentStyled,
  ItemNameStyled,
  ButtonContainerStyled,
  ContentChidlrenStyled,
} from "./styles";
import { Button } from "components/Button";
import "./styles.ts";
import { MdKeyboardArrowRight } from "react-icons/md";

const PopoverOverlay = ({ children, onClick, variant, insertedProps }: any) => {
  const [show, setShow] = useState(false);
  const isComponent = variant === "component";

  const isValidClick = () => {
    return (
      (isComponent && insertedProps?.insertedMachine) ||
      (!isComponent && insertedProps?.insertedComponent)
    );
  };
  useEffect(() => {
    show &&
      window.setTimeout(() => {
        setShow(false);
      }, 4000);
  }, [show]);

  const handleClick = () => {
    if (isValidClick()) {
      isComponent && onClick();
      !isComponent && onClick();
    } else {
      setShow(true);
    }
  };
  const label = isComponent ? "Ingrese una máquina" : "Ingrese un componente";
  const description = isComponent
    ? "Es necesario guardar la máquina antes de continuar"
    : "Es necesario guardar los componentes antes de continuar";

  const popover = (
    <div style={{ zIndex: 1000 }}>
      {show && (
        <>
          <Popover id="popover-basic">
            <Popover.Title as="h3">{label}</Popover.Title>
            <Popover.Content>{description}</Popover.Content>
          </Popover>
        </>
      )}
    </div>
  );

  return (
    <div onClick={handleClick}>
      <OverlayTrigger trigger="click" placement="right" overlay={popover}>
        {children}
      </OverlayTrigger>
    </div>
  );
};

export const CustomSidebar = ({
  currentTab,
  setCurrentTab,
  children,
  onSubmit,
  insertedProps,
}: any) => {
  const [selectedTab, setSelectedTab] = useState(currentTab);

  useEffect(() => {
    currentTab && setSelectedTab(currentTab);
  }, [currentTab]);

  return (
    <>
      <ContainerStyled>
        <SidebarContainerStyled>
          <div onClick={() => setCurrentTab(1)}>
            <NavitemContainerStyled
              className={selectedTab && selectedTab === 1 ? "selected" : ""}
            >
              <NavItemLogoStyled>
                {" "}
                <MdKeyboardArrowRight size={28} color={"#898989"} />
              </NavItemLogoStyled>
              <ItemNameStyled>
                {" "}
                <span>Máquina</span>
              </ItemNameStyled>
            </NavitemContainerStyled>
          </div>

          <div>
            <PopoverOverlay
              onClick={() => setCurrentTab(2)}
              variant="component"
              insertedProps={insertedProps}
            >
              <NavitemContainerStyled
                className={selectedTab && selectedTab === 2 ? "selected" : ""}
              >
                <NavItemLogoStyled>
                  {" "}
                  <MdKeyboardArrowRight size={28} color={"#898989"} />{" "}
                </NavItemLogoStyled>
                <ItemNameStyled>
                  {" "}
                  <span>Componentes</span>
                </ItemNameStyled>
              </NavitemContainerStyled>
            </PopoverOverlay>
          </div>

          <div>
            <PopoverOverlay
              onClick={() => setCurrentTab(3)}
              variant="component"
              insertedProps={insertedProps}
            >
              <NavitemContainerStyled
                className={selectedTab && selectedTab === 3 ? "selected" : ""}
              >
                <NavItemLogoStyled>
                  {" "}
                  <MdKeyboardArrowRight size={28} color={"#898989"} />{" "}
                </NavItemLogoStyled>
                <ItemNameStyled>
                  {" "}
                  <span>Piezas</span>
                </ItemNameStyled>
              </NavitemContainerStyled>
            </PopoverOverlay>
          </div>
          <ButtonContainerStyled>
            <Button onClick={(e: any) => onSubmit(e)}>Guardar</Button>
          </ButtonContainerStyled>
        </SidebarContainerStyled>
        <ContentStyled>
          <ContentChidlrenStyled>{children}</ContentChidlrenStyled>
        </ContentStyled>
      </ContainerStyled>
    </>
  );
};

export const Sidebar = ({
  currentTab,
  setCurrentTab,
  children,
  onSubmit,
  insertedProps,
}: any) => {
  return (
    <CustomSidebar
      currentTab={currentTab}
      setCurrentTab={setCurrentTab}
      onSubmit={onSubmit}
      insertedProps={insertedProps}
    >
      {children}
    </CustomSidebar>
  );
};
