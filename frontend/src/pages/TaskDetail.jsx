import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUser, logout, dashboardPathForRole } from "../api/session";
import { getTaskDetail, updateTaskStatus, addTaskComment } from "../api/tasks";
import TaskStatusControls from "../components/TaskStatusControls.jsx";
import CommentList from "../components/CommentList";
import CommentForm from "../components/CommentForm";
import { LoadingSpinner, ErrorMessage } from "../components/Dashboard";
import "./Dashboard.css";
import "./ProjectDetail.css";
import "./TaskDetail.css";

export default function TaskDetail() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const user = getUser();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch task data on component mount
  useEffect(() => {
    if (taskId) {
      fetchTaskData();
    }
  }, [taskId]);

  async function fetchTaskData() {
    setLoading(true);
    setError("");

    try {
      const taskData = await getTaskDetail(taskId);
      setTask(taskData);
    } catch (err) {
      setError(err.message || "Failed to load task details.");
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    const loginPath = logout();
    navigate(loginPath);
  }

  function handleBackToDashboard() {
    const dashboardPath = dashboardPathForRole(user?.role);
    navigate(dashboardPath);
  }

  async function handleStatusChange(newStatus) {
    if (!task || !user) return;

    setIsUpdating(true);
    try {
      await updateTaskStatus(task.id, newStatus);
      setTask((prev) => ({ ...prev, status: newStatus }));
    } catch (err) {
      setError(err.message || "Failed to update task status.");
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleAddComment(content) {
    if (!task || !user) return;

    try {
      const newComment = await addTaskComment(task.id, content);
      setTask((prev) => ({
        ...prev,
        comments: [...(prev.comments || []), newComment],
      }));
    } catch (err) {
      setError(err.message || "Failed to add comment.");
      throw err; // Re-throw to let CommentForm handle the error state
    }
  }

  function formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (loading) {
    return <LoadingSpinner message="Loading task details..." />;
  }

  if (error && !task) {
    return <ErrorMessage error={error} onRetry={fetchTaskData} />;
  }

  if (!task) {
    return (
      <div className="dashboard__error">
        <span>Task not found.</span>
        <button
          className="dashboard__retry-btn"
          onClick={handleBackToDashboard}
          type="button"
        >
          Back to Dashboard
        </button>
      </div>
    );
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
        <div className="task-detail">
          <div className="task-detail__header">
            <div className="task-detail__title-section">
              <h1 className="task-detail__title">{task.title}</h1>
              <div className="task-detail__meta">
                <span className="task-detail__project">
                  Project: {task.project_title}
                </span>
                {task.created_at && (
                  <span className="task-detail__created">
                    Created: {formatDate(task.created_at)}
                  </span>
                )}
              </div>
            </div>

            <TaskStatusControls
              task={task}
              currentUserId={user?.id}
              onStatusChange={handleStatusChange}
              disabled={isUpdating}
            />
          </div>

          {task.description && (
            <div className="task-detail__description">
              <h2 className="task-detail__section-title">Description</h2>
              <p className="task-detail__description-text">
                {task.description}
              </p>
            </div>
          )}

          <div className="task-detail__assignment">
            <h2 className="task-detail__section-title">Assignment</h2>
            <div className="task-detail__assignment-info">
              <span className="task-detail__assigned-to">
                Assigned to: {task.assigned_name || "Unassigned"}
              </span>
            </div>
          </div>

          {error && <ErrorMessage error={error} onRetry={() => setError("")} />}

          <div className="task-detail__comments">
            <h2 className="task-detail__section-title">Comments</h2>

            <CommentList comments={task.comments || []} />

            <div className="task-detail__comment-form">
              <CommentForm onSubmit={handleAddComment} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
