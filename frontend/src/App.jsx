import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PMDashboard from "./pages/PMDashboard";
import TMDashboard from "./pages/TMDashboard";
import { getUser, dashboardPathForRole } from "./api/session";
import { RequireAuth, RequireRole } from "./routes/guards";

function HomeRedirect() {
  const user = getUser();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={dashboardPathForRole(user.role)} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<RequireAuth />}>
          <Route element={<RequireRole role="project_manager" />}>
            <Route path="/pm" element={<PMDashboard />} />
          </Route>
          <Route element={<RequireRole role="team_member" />}>
            <Route path="/tm" element={<TMDashboard />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}