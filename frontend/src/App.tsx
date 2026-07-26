import { Route, Routes } from "react-router-dom";
import { HittersPage, PitchersPage } from "./pages";
import { MainLayout } from "./components";
import { Box } from "@mui/material";

import tmpMainLayout from './components/temp/TmpMainLayout.tsx';

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HittersPage />} />

        <Route path="/hitters" element={<HittersPage />} />
        <Route path="/pitchers" element={<PitchersPage />} />
      </Route>
    </Routes>
  );
}

export default App;
