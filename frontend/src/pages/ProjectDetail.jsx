import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUser, logout } from "../api/session";
import {
  getProject,
  getProjectTasks,
  updateTaskStatus,
  assignTask,
  getTeamMembers,
} from "../api/tasks";
import TaskCard from "../components/TaskCard";
import CreateTaskModal from "../components/CreateTaskModal";
import "./Dashboard.css";
import "./ProjectDetail.css";

// Task status constants
const TASK_STATUS = {
  TODO: "todo",
  IN_PROGRESS: "in_progress",
  DONE: "done",
};

// Task column configuration
const TASK_COLUMNS = [
  { key: TASK_STATUS.TODO, title: "To Do", emptyMessage: "No tasks to do" },
  {
    key: TASK_STATUS.IN_PROGRESS,
    title: "In Progress",
    emptyMessage: "No tasks in progress",
  },
  { key: TASK_STATUS.DONE, title: "Done", emptyMessage: "No completed tasks" },
];

// LoadingSpinner Component
function LoadingSpinner() {
  return (
    <div className="dashboard__loading">
      <div className="dashboard__spinner"></div>
      <p>Loading project details...</p>
    </div>
  );
}

// ErrorMessage Component
function ErrorMessage({ error, onRetry }) {
  return (
    <div className="dashboard__error">
      <span>{error}</span>
      <button
        className="dashboard__retry-btn"
        onClick={onRetry}
        type="button"
        aria-label="Retry loading"
      >
        Retry
      </button>
    </div>
  );
}

// TaskBoardColumn Component - Individual column in the kanban board
function TaskBoardColumn({
  title,
  tasks,
  emptyMessage,
  onStatusChange,
  onAssign,
  teamMembers,
  activeDropdownId,
  setActiveDropdownId,
}) {
  return (
    <div className="task-board__column">
      <div className="task-board__column-header">
        <h3 className="task-board__column-title">{title}</h3>
        <span className="task-board__column-count">{tasks.length}</span>
      </div>
      <div className="task-board__column-content">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onStatusChange={onStatusChange}
            onAssign={onAssign}
            teamMembers={teamMembers}
            activeDropdownId={activeDropdownId}
            setActiveDropdownId={setActiveDropdownId}
          />
        ))}
        {tasks.length === 0 && (
          <div className="task-board__empty-state">
            <p>{emptyMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// TaskBoard Component - Kanban-style board with three columns
function TaskBoard({
  tasks,
  onStatusChange,
  onAssign,
  teamMembers,
  activeDropdownId,
  setActiveDropdownId,
}) {
  // Group tasks by status
  const tasksByStatus = {
    [TASK_STATUS.TODO]: tasks.filter(
      (task) => task.status === TASK_STATUS.TODO,
    ),
    [TASK_STATUS.IN_PROGRESS]: tasks.filter(
      (task) => task.status === TASK_STATUS.IN_PROGRESS,
    ),
    [TASK_STATUS.DONE]: tasks.filter(
      (task) => task.status === TASK_STATUS.DONE,
    ),
  };

  return (
    <div className="task-board">
      {TASK_COLUMNS.map((column) => (
        <TaskBoardColumn
          key={column.key}
          title={column.title}
          tasks={tasksByStatus[column.key]}
          emptyMessage={column.emptyMessage}
          onStatusChange={onStatusChange}
          onAssign={onAssign}
          teamMembers={teamMembers}
          activeDropdownId={activeDropdownId}
          setActiveDropdownId={setActiveDropdownId}
        />
      ))}
    </div>
  );
}

// ProjectDetail Component
export default function ProjectDetail() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const user = getUser();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeDropdownId, setActiveDropdownId] = useState(null);

  // Fetch project data on component mount
  useEffect(() => {
    if (projectId) {
      fetchProjectData();
    }
  }, [projectId]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (activeDropdownId !== null) {
        setActiveDropdownId(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [activeDropdownId, setActiveDropdownId]);

  // Fetches all project data in parallel
  async function fetchProjectData() {
    setLoading(true);
    setError("");

    try {
      const [projectData, tasksData, teamData] = await Promise.all([
        getProject(projectId),
        getProjectTasks(projectId),
        getTeamMembers(),
      ]);

      setProject(projectData);

      // Format tasks to handle new assignee structure
      const formattedTasks = (tasksData || []).map((task) => ({
        ...task,
        // Handle both old and new formats for backward compatibility
        assigned_name: task.assignee?.name || task.assigned_name,
        assigned_to: task.assignee?.id || task.assigned_to,
      }));

      setTasks(formattedTasks);
      setTeamMembers(teamData?.users || []);
    } catch (err) {
      setError(err.message || "Failed to load project data.");
    } finally {
      setLoading(false);
    }
  }

  // Handles user logout
  function handleLogout() {
    const loginPath = logout();
    navigate(loginPath);
  }

  // Opens create task modal
  function handleCreateTask() {
    setIsCreateModalOpen(true);
  }

  // Closes create task modal
  function handleCloseCreateModal() {
    setIsCreateModalOpen(false);
  }

  // Handles successful task creation
  function handleTaskCreated(newTask) {
    setTasks((prev) => [newTask, ...prev]);
  }

  // Handles task status change
  async function handleStatusChange(taskId, newStatus) {
    try {
      await updateTaskStatus(taskId, newStatus);
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task,
        ),
      );
    } catch (err) {
      setError(err.message || "Failed to update task status.");
    }
  }

  // Handles task assignment
  async function handleTaskAssign(taskId, userId) {
    try {
      await assignTask(taskId, userId);
      const assignee = teamMembers.find((member) => member.id === userId);
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? {
                ...task,
                assigned_name: assignee.name,
                assigned_to: userId,
                // Update assignee object for new format
                assignee: { id: userId, name: assignee.name },
              }
            : task,
        ),
      );
    } catch (err) {
      setError(err.message || "Failed to assign task.");
    }
  }

  // Handles back to dashboard navigation
  function handleBackToDashboard() {
    navigate("/pm");
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error && !project) {
    return <ErrorMessage error={error} onRetry={fetchProjectData} />;
  }

  return (
    <div className="dashboard__container">
      <header className="dashboard__header">
        <div className="dashboard__header-content">
          <div className="dashboard__header-nav">
            <button
              className="dashboard__back-btn"
              onClick={handleBackToDashboard}
              type="button"
            >
              ← Back to Dashboard
            </button>
          </div>
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
        <div className="project-detail__header">
          <div className="project-detail__info">
            <div className="project-detail__title-section">
              <h1 className="project-detail__title">{project?.title}</h1>
              {project?.description && (
                <p className="project-detail__description">
                  {project.description}
                </p>
              )}
            </div>
            <div className="project-detail__stats">
              <div className="project-detail__stat">
                <span className="project-detail__stat-number">
                  {tasks.length}
                </span>
                <span className="project-detail__stat-label">Total Tasks</span>
              </div>
              <div className="project-detail__stat">
                <span className="project-detail__stat-number">
                  {teamMembers.length}
                </span>
                <span className="project-detail__stat-label">Team Members</span>
              </div>
            </div>
          </div>
          <button
            className="dashboard__create-btn"
            onClick={handleCreateTask}
            type="button"
          >
            + Add Task
          </button>
        </div>

        {error && <ErrorMessage error={error} onRetry={fetchProjectData} />}

        <TaskBoard
          tasks={tasks}
          onStatusChange={handleStatusChange}
          onAssign={handleTaskAssign}
          teamMembers={teamMembers}
          activeDropdownId={activeDropdownId}
          setActiveDropdownId={setActiveDropdownId}
        />
      </main>

      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        projectId={projectId}
        onTaskCreated={handleTaskCreated}
      />
    </div>
  );
}
