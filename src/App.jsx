import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./router";
import { useFCM } from "./hooks/UseFCM";

import { LayoutBase } from "./layouts"
import { ToggleViewProvider, LoaderContextProvider } from "./contexts";

export const App = () => {
  useFCM();

  return (
    <LoaderContextProvider>
      <BrowserRouter>
        <ToggleViewProvider>
          <LayoutBase title="comandas" url="comandas">
            <AppRoutes />
          </LayoutBase>
        </ToggleViewProvider>
      </BrowserRouter>
    </LoaderContextProvider>
  );
};
