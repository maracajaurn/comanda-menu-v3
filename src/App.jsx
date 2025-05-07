import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./router";

import { LayoutBase } from "./layouts"
import { ToggleViewProvider, LoaderContextProvider } from "./contexts";

export const App = () => {
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
