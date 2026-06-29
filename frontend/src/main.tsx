import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { DashboardProvider } from "./context/DashboardContext";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { theme } from "./theme/theme";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <DashboardProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </DashboardProvider>
    </BrowserRouter>
  </StrictMode>,
);
