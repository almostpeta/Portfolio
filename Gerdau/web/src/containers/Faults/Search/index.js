import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { NavbarComponent } from "components/Navbar";
import { Loading } from "components/Loading/index";
import { getApprovedCauses } from "service/cause";
import Search from "./Search";

const SearchContainer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [causes, setCauses] = useState(null);

  const fetchCauses = async () => {
    try {
      setIsLoading(true);
      const retrievedCauses = await getApprovedCauses();
      setCauses(retrievedCauses);
    } catch (e) {
      setCauses([]);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCauses();
  }, []);

  return (
    <>
      <NavbarComponent />
      {isLoading && <Loading />}
      {causes && (
        <Search setIsLoading={(v) => setIsLoading(v)} allCauses={causes} />
      )}
    </>
  );
};

export default SearchContainer;
