import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./router";

import { LayoutBase } from "./layouts"
import { ToggleViewProvider, LoaderContextProvider } from "./contexts";

import { useFCM } from "./hooks/UseFCM";

export const App = () => {

  useFCM();

  return (
    <LoaderContextProvider>
      <BrowserRouter>
        <ToggleViewProvider>
          <LayoutBase>
            <AppRoutes />
          </LayoutBase>
        </ToggleViewProvider>
      </BrowserRouter>
    </LoaderContextProvider>
  );
};
