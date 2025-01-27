import { useHistory } from "react-router-dom";
import useUser from "hooks/useUser";

const adminPath = "/admin";

export const redirectTo = (path) => {
  const history = useHistory();
  const { isAdminView } = useUser();
  history.push(`${isAdminView ? adminPath : ""}${path}`);
};
