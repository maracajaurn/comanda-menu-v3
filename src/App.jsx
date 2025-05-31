import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./router";

import { LayoutBase } from "./layouts"
import { ToggleViewProvider, LoaderContextProvider, ToggleSidebarProvider } from "./contexts";

import { useFCM } from "./hooks/UseFCM";

export const App = () => {

  useFCM();

  return (
    <LoaderContextProvider>
      <BrowserRouter>
        <ToggleViewProvider>
          <ToggleSidebarProvider>
            <LayoutBase>
              <AppRoutes />
            </LayoutBase>
          </ToggleSidebarProvider>
        </ToggleViewProvider>
      </BrowserRouter>
    </LoaderContextProvider>
  );
};
