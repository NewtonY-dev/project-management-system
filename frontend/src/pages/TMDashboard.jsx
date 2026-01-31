import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUser, logout } from "../api/session";
import { getMyTasks } from "../api/tasks";
import { TASK_STATUS, TASK_COLUMNS } from "../constants/tasks";
import TMTaskCard from "../components/TMTaskCard";
import {
  LoadingSpinner,
  ErrorMessage,
  EmptyState,
} from "../components/Dashboard";
import "./Dashboard.css";
import "./ProjectDetail.css";

function TaskBoardColumn({ title, tasks, emptyMessage, onTaskClick }) {
  return (
    <div className="task-board__column">
      <div className="task-board__column-header">
        <h3 className="task-board__column-title">{title}</h3>
        <span className="task-board__column-count">{tasks.length}</span>
      </div>
      <div className="task-board__column-content">
        {tasks.map((task) => (
          <TMTaskCard key={task.id} task={task} onClick={onTaskClick} />
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

function TaskBoard({ tasks, onTaskClick }) {
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
          onTaskClick={onTaskClick}
        />
      ))}
    </div>
  );
}

function TMDashboardStats({ tasks }) {
  const stats = {
    todo: tasks.filter((t) => t.status === TASK_STATUS.TODO).length,
    inProgress: tasks.filter((t) => t.status === TASK_STATUS.IN_PROGRESS)
      .length,
    done: tasks.filter((t) => t.status === TASK_STATUS.DONE).length,
  };

  return (
    <div className="tm-dashboard__stats">
      <div className="tm-dashboard__stat">
        <span className="tm-dashboard__stat-number">{stats.todo}</span>
        <span className="tm-dashboard__stat-label">To Do</span>
      </div>
      <div className="tm-dashboard__stat">
        <span className="tm-dashboard__stat-number">{stats.inProgress}</span>
        <span className="tm-dashboard__stat-label">In Progress</span>
      </div>
      <div className="tm-dashboard__stat">
        <span className="tm-dashboard__stat-number">{stats.done}</span>
        <span className="tm-dashboard__stat-label">Completed</span>
      </div>
    </div>
  );
}

export default function TMDashboard() {
  const user = getUser();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    setError("");

    try {
      const tasksData = await getMyTasks();
      setTasks(tasksData.tasks || []);
    } catch (err) {
      setError(err.message || "Failed to load your tasks.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    const loginPath = logout();
    navigate(loginPath);
  };

  const handleTaskClick = (task) => {
    // Navigate to task detail (Step 4)
    navigate(`/tasks/${task.id}`);
  };

  const renderHeader = () => (
    <header className="dashboard__header">
      <div className="dashboard__header-content">
        <h1 className="dashboard__title">My Tasks</h1>
        <div className="dashboard__user-info">
          <span className="dashboard__user-name">{user?.name}</span>
          <button className="dashboard__logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );

  const renderContent = () => {
    if (loading) {
      return <LoadingSpinner message="Loading your tasks..." />;
    }

    if (error && tasks.length === 0) {
      return <ErrorMessage error={error} onRetry={fetchTasks} />;
    }

    if (tasks.length === 0) {
      return (
        <EmptyState
          title="No tasks assigned yet"
          message="Your Project Manager will assign tasks to you soon."
        />
      );
    }

    return (
      <>
        {error && <ErrorMessage error={error} onRetry={fetchTasks} />}
        <TMDashboardStats tasks={tasks} />
        <TaskBoard tasks={tasks} onTaskClick={handleTaskClick} />
      </>
    );
  };

  return (
    <div className="dashboard__container">
      {renderHeader()}
      <main className="dashboard__main">{renderContent()}</main>
    </div>
  );
}
