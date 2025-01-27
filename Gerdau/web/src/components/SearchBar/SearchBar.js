import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  Dropdown,
  DropdownButton,
  InputGroup,
} from "react-bootstrap";
import ReactSearchBox from "react-search-box";
import { QR } from "../UI/QR";
import { getFilteredValues } from "service/search";
import { useHistory } from "react-router-dom";
import { Loading as LoadingComponent } from "components/Loading";
import "./SearchBar.css";

const Loading = () => (
  <div
    style={{
      position: "absolute",
      height: "40px",
      width: "50%",
      background: "white",
    }}
  >
    <LoadingComponent clazz="search-bar" height="50%" width="50%" />
  </div>
);

export const SearchBar = ({ onQRClick }) => {
  const history = useHistory();
  const [currentDropdown, setCurrentDropdown] = useState({
    value: "all",
    label: "Todos",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [availableOptions, setAvailableOptions] = useState([]);

  useEffect(() => {
    const element = document.querySelector(".sc-bdVaJa");
    if (element) {
      element.style.height = "38px";
      element.style.borderRadius = "0";
    }
  }, []);

  useEffect(() => {
    const element = document.querySelector(".react-search-box-dropdown");
    if (element) {
      element.style.position = "absolute";
      element.style.top = "100%";
      element.style.color = "black";
      element.style.fontSize = "1em";
    }
  }, [availableOptions]);

  const handleChange = (value) => {
    let label = "";
    switch (value) {
      case "pieces":
        label = "Piezas";
        break;
      case "tasks":
        label = "Tareas";
        break;
      case "machines":
        label = "Máquinas";
        break;
      case "components":
        label = "Componentes";
        break;
      case "faults":
        label = "Fallas";
        break;
      case "causes":
        label = "Causas";
        break;
      default:
        label = "Todos";
    }
    setCurrentDropdown({ label, value });
  };

  const handleSearchChange = (value) => {
    if (!value) {
      setAvailableOptions([]); // if user deletes input, then clean up the list
      return;
    }

    handleSearch(value);
    if (availableOptions.length > 0) {
      const elements = document.querySelector(".react-search-box-dropdown");
    }
  };

  const getUrl = (type, id) => {
    switch (type) {
      case "machines":
        return `/machine/detail/${id}`;
      case "pieces":
        return `/piece/detail/${id}`;
      case "components":
        return `/component/detail/${id}`;
      case "tasks":
        return `/task/detail/${id}`;
      case "faults":
        return `/fault/detail/${id}`;
      case "causes":
        return `/cause/detail/${id}`;
      default:
        return "/home";
    }
  };

  const handleSearch = (value) => {
    setIsLoading(true);
    const filterBy = currentDropdown.value;
    getFilteredValues(filterBy, value)
      .then((res) => {
        const listOfOptions = [];
        res &&
          res.forEach((r) => {
            if (currentDropdown.value !== "all") {
              listOfOptions.push(parseRecord(r, currentDropdown.value));
            } else {
              r.machines &&
                r.machines.forEach((m) => {
                  listOfOptions.push(parseRecord(m, "machines"));
                });
              r.components &&
                r.components.forEach((c) => {
                  listOfOptions.push(parseRecord(c, "components"));
                });
              r.pieces &&
                r.pieces.forEach((p) => {
                  listOfOptions.push(parseRecord(p, "pieces"));
                });
              r.faults &&
                r.faults.forEach((f) => {
                  listOfOptions.push(parseRecord(f, "faults", "name"));
                });
              r.tasks &&
                r.tasks.forEach((t) => {
                  listOfOptions.push(parseRecord(t, "tasks", "name"));
                });
              r.causes &&
                r.causes.forEach((c) => {
                  listOfOptions.push(parseRecord(c, "causes", "name"));
                });
            }
          });

        setAvailableOptions(listOfOptions);
      })
      .catch((error) => {
        setAvailableOptions([]);
      })
      .finally(() => setIsLoading(false));
  };

  const parseRecord = (record, type, identifier = "internal_name") => {
    const isNameIdentifier =
      type === "faults" || type === "tasks" || type === "causes";
    return {
      value: isNameIdentifier ? record.name : record.internal_name,
      key: `${record.name}${record.id}`,
      url: getUrl(type, record.id),
    };
  };

  return (
    <Container style={{ position: "relative" }}>
      <Col>
        <InputGroup className="mb-3 align-items-center">
          <DropdownButton
            as={InputGroup.Prepend}
            variant="outline-light"
            title={currentDropdown.label}
            id="input-group-dropdown-1"
            onSelect={(e) => handleChange(e)}
          >
            <Dropdown.Item eventKey="machines" href="#">
              Máquinas
            </Dropdown.Item>
            <Dropdown.Item eventKey="pieces" href="#">
              Piezas
            </Dropdown.Item>
            <Dropdown.Item eventKey="components" href="#">
              Componentes
            </Dropdown.Item>
            <Dropdown.Item eventKey="tasks" href="#">
              Tareas
            </Dropdown.Item>
            <Dropdown.Item eventKey="faults" href="#">
              Fallas
            </Dropdown.Item>
            <Dropdown.Item eventKey="causes" href="#">
              Causas
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item eventKey="all" href="#">
              Todos
            </Dropdown.Item>
          </DropdownButton>
          <div className="responsive-width">
            <ReactSearchBox
              id="search-box"
              className="searchBox"
              style={{ width: "100%" }}
              placeholder="Ingrese la búsqueda"
              data={availableOptions}
              onSelect={(record) => history.push(record.url)}
              onChange={(value) => handleSearchChange(value)}
              fuseConfigs={{
                threshold: 0.05,
              }}
            />
            {isLoading && <Loading />}
          </div>
          <InputGroup.Append>
            <Button variant="outline-warning" onClick={(e) => onQRClick(e)}>
              <QR size="1x" />
            </Button>
          </InputGroup.Append>
        </InputGroup>
      </Col>
    </Container>
  );
};
