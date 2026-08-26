import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import GatePage from "./pages/GatePage";
import InvitationPage from "./pages/InvitationPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/invite/:token" element={<InvitationPage />} />

        {/* Staff */}
        <Route path="/login" element={<LoginPage />} />

        <Route path="/admin" element={<AdminPage />} />

        <Route path="/gate" element={<GatePage />} />
      </Routes>
    </BrowserRouter>
  );
}
