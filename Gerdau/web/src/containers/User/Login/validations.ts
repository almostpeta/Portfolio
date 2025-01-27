interface IProps {
  type?: "password" | "email" | "purchasingOrder";
  requiered?: any;
  pattern?: any;
  minLength?: number;
  maxLength?: number;
  valueAsNumber?: boolean;
  min?: number;
  max?: number;
}

export const validations = ({ type }: IProps) => {
  let config = {};
  switch (type) {
    case "email":
      config = {
        pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
          message: "Enter a valid email address",
        },
        required: { value: true, message: "Email is required" },
      };
      break;
    case "password":
      config = {
        pattern: {
          value: /^.{8,}$/,
          message: "Password should have",
        },
        required: { value: true, message: "Password is required" },
      };
      break;
  }
  return config;
};
