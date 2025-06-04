import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./router";

import { LayoutBase } from "./layouts"
import { ToggleViewProvider, LoaderContextProvider, ToggleSidebarProvider } from "./contexts";

export const App = () => {
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
