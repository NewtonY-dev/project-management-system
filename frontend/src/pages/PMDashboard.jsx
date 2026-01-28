import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUser, logout } from "../api/session";
import { getProjects } from "../api/projects";
import ProjectCard from "../components/ProjectCard";
import CreateProjectModal from "../components/CreateProjectModal";
import "./Dashboard.css";

function LoadingSpinner() {
  return (
    <div className="dashboard__loading">
      <div className="dashboard__spinner"></div>
      <p>Loading projects...</p>
    </div>
  );
}

function ErrorMessage({ error, onRetry }) {
  return (
    <div className="dashboard__error">
      <span>{error}</span>
      <button
        className="dashboard__retry-btn"
        onClick={onRetry}
        type="button"
        aria-label="Retry loading projects"
      >
        Retry
      </button>
    </div>
  );
}

function EmptyState({ onCreateProject }) {
  return (
    <div className="dashboard__empty-state">
      <h3>No projects yet</h3>
      <p>Create your first project to get started!</p>
      <button
        className="dashboard__create-btn dashboard__create-btn--primary"
        onClick={onCreateProject}
        type="button"
      >
        + Create Your First Project
      </button>
    </div>
  );
}

export default function PMDashboard() {
  const user = getUser();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Fetch projects on component mount
  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    setLoading(true);
    setError("");

    try {
      const data = await getProjects();
      setProjects(data.projects || []);
    } catch (err) {
      setError(err.message || "Failed to load projects.");
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    const loginPath = logout();
    navigate(loginPath);
  }

  function handleCreateProject() {
    setIsCreateModalOpen(true);
  }

  function handleCloseCreateModal() {
    setIsCreateModalOpen(false);
  }

  function handleProjectCreated(newProject) {
    // Add the new project to the beginning of the list
    setProjects((prev) => [newProject, ...prev]);
  }

  return (
    <div className="dashboard__container">
      <header className="dashboard__header">
        <div className="dashboard__header-content">
          <h1 className="dashboard__title">My Projects</h1>
          <div className="dashboard__user-info">
            <span className="dashboard__user-name">{user?.name}</span>
            <button
              className="dashboard__logout-btn"
              onClick={handleLogout}
              type="button"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard__main">
        <div className="dashboard__projects-header">
          <div className="dashboard__welcome">
            <h2 className="dashboard__welcome-title">Welcome, {user?.name}!</h2>
            <p className="dashboard__welcome-subtitle">
              Manage your projects and track progress
            </p>
          </div>
          <button
            className="dashboard__create-btn"
            onClick={handleCreateProject}
            type="button"
          >
            + Create New Project
          </button>
        </div>

        {error && <ErrorMessage error={error} onRetry={fetchProjects} />}

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="dashboard__projects">
            {projects.length === 0 ? (
              <EmptyState onCreateProject={handleCreateProject} />
            ) : (
              <div className="dashboard__project-grid">
                {projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onProjectCreated={handleProjectCreated}
      />
    </div>
  );
}
