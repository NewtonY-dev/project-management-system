import { useNavigate } from "react-router-dom";
import { getUser, logout } from "../api/session";
import "./Dashboard.css";

export default function PMDashboard() {
  const user = getUser();
  const navigate = useNavigate();

  function handleLogout() {
    const loginPath = logout();
    navigate(loginPath);
  }

  return (
    <div className="dashboard__container">
      <header className="dashboard__header">
        <div className="dashboard__header-content">
          <h1 className="dashboard__title">Project Manager Dashboard</h1>
          <div className="dashboard__user-info">
            <span className="dashboard__user-name">{user?.name}</span>
            <button className="dashboard__logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard__main">
        <div className="dashboard__welcome">
          <h2 className="dashboard__welcome-title">Welcome, {user?.name}!</h2>
          <p className="dashboard__welcome-subtitle">
            Manage your projects and team
          </p>
        </div>

        <div className="dashboard__content">
          <div className="dashboard__card">
            <h3 className="dashboard__card-title">Projects</h3>
            <p className="dashboard__card-text">View and manage all projects</p>
          </div>
          <div className="dashboard__card">
            <h3 className="dashboard__card-title">Team</h3>
            <p className="dashboard__card-text">
              Manage team members and assignments
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
