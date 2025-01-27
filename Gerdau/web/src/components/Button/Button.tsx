import React from "react";
import "./Button.css";
import { Button } from "react-bootstrap";
interface IProps {
  onClick?: Function;
  size?: "sm" | "lg";
  children: any;
  variant?: any;
  style?: any;
  type?: any;
  className?: any;
}

const ButtonComponent = ({
  size,
  onClick,
  children,
  variant,
  style,
  type,
  className,
}: IProps) => {
  let customClassname = variant ? "" : "btn-styled";
  return (
    <Button
      type={type}
      variant={variant}
      size={size}
      style={style}
      className={`${className}` + " " + customClassname}
      onClick={(e: any) => onClick && onClick(e)}
    >
      {children}
    </Button>
  );
};
export default ButtonComponent;
