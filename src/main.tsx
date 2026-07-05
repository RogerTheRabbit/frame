import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "./components/theme-provider.tsx";
import { BrowserRouter, Routes, Route } from "react-router";
import AdminPage from "./components/admin/admin-page.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter basename={import.meta.env["BASE_URL"]}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
);
