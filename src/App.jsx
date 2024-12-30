import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./router";

import { LayoutBase } from "./layouts"
import { ToggleViewProvider } from "./contexts";

export const App = () => {
  return (
    <BrowserRouter>
      <ToggleViewProvider>
        <LayoutBase title="comandas" url="comandas">
          <AppRoutes />
        </LayoutBase>
      </ToggleViewProvider>
    </BrowserRouter>
  );
};
