import React, { Suspense } from "react";
import { Loading } from "./components/Loading/index";
import AppProviders from "./context";
import Routes from "./Routes";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-inner-image-zoom/lib/InnerImageZoom/styles.min.css";
import "react-datepicker/dist/react-datepicker.css";
require("dotenv").config();

const App = () => {
  return (
    <AppProviders>
      <Suspense fallback={<Loading />}>
        <Routes />
      </Suspense>
    </AppProviders>
  );
};

export default App;
