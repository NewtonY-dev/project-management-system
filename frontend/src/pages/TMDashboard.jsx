import { useNavigate } from "react-router-dom";
import { getUser, logout } from "../api/session";
import "./Dashboard.css";

export default function TMDashboard() {
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
          <h1 className="dashboard__title">Team Member Dashboard</h1>
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
            View your tasks and assignments
          </p>
        </div>

        <div className="dashboard__content">
          <div className="dashboard__card">
            <h3 className="dashboard__card-title">My Tasks</h3>
            <p className="dashboard__card-text">View your assigned tasks</p>
          </div>
          <div className="dashboard__card">
            <h3 className="dashboard__card-title">Projects</h3>
            <p className="dashboard__card-text">
              View projects you're involved in
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
