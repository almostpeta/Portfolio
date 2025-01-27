import styled from "styled-components";

const SidebarContainerStyled = styled.div`
  width: 100%;
  white-space: nowrap;
  background-color: white;
  display: flex;
  justify-content: space-around;
  height: 100%;
  z-index: 100;
  margin-top: 0;
  border: 1px solid;
  box-shadow: 0px 15px 15px -10px #e8e8e8;
  border-color: #e8e8e8;
  @media screen and (max-width: 500px) {
    flex-direction: column;
  }
`;

const ContentStyled = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 30px;
`;

const ContainerStyled = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
`;

const ContentChidlrenStyled = styled.div`
  overflow-y: scroll;
  padding: 10px 15px;
`;

const NavitemContainerStyled = styled.div`
  height: 60px;
  background: white;
  display: flex;
  align-items: center;
  padding: 10px;
  justify-content: flex-end;
  cursor: pointer;
  transition: all ease 0.2s;
  opacity: 1;
  &:hover {
    opacity: 0.8;
  }
  span {
    white-space: nowrap;
    font-weight: 600;
  }
  &.selected {
    span {
      color: #01516a;
    }

    svg {
      path {
        fill: #01516a;
      }
    }
  }
  @media screen and (max-width: 500px) {
    justify-content: center;
  }
`;

const ButtonContainerStyled = styled.div`
  height: 60px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  @media screen and (max-width: 500px) {
    justify-content: center;
  }
  }
`;

const ItemNameStyled = styled.div`
  font-size: 22px;
  line-height: 150%;
  display: flex;
  justify-content: right;
  text-align: right;
  color: #898989;
`;

const NavItemLogoStyled = styled.i`
  display: inline-block;
  margin-right: 5px;
  max-width: 20px;
`;

export {
  SidebarContainerStyled,
  ContainerStyled,
  NavItemLogoStyled,
  ItemNameStyled,
  ContentStyled,
  NavitemContainerStyled,
  ContentChidlrenStyled,
  ButtonContainerStyled,
};
