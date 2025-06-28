import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./router";

import { LayoutBase } from "./layouts"
import { ToggleViewProvider, LoaderContextProvider, ToggleSidebarProvider } from "./contexts";

export const App = () => {

  useEffect(() => {
    const favicon = document.querySelector("link[rel~='icon']");
    if (favicon) {
      favicon.href = process.env.REACT_APP_FAVICON_URL;
    } else {
      const newFavicon = document.createElement("link");
      newFavicon.rel = "icon";
      newFavicon.href = process.env.REACT_APP_FAVICON_URL;
      document.head.appendChild(newFavicon);
    }
  }, []);


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
