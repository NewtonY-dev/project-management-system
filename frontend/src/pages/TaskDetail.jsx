import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUser, logout, dashboardPathForRole } from "../api/session";
import { getTaskDetail, updateTaskStatus, addTaskComment, getTaskDocuments, deleteDocument } from "../api/tasks";
import TaskStatusControls from "../components/TaskStatusControls.jsx";
import CommentList from "../components/CommentList";
import CommentForm from "../components/CommentForm";
import DocumentUploadForm from "../components/DocumentUploadForm";
import DocumentList from "../components/DocumentList";
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
  const [documents, setDocuments] = useState([]);
  const [documentsLoading, setDocumentsLoading] = useState(false);
  const [documentsError, setDocumentsError] = useState("");

  // Fetch task data on component mount
  useEffect(() => {
    if (taskId) {
      fetchTaskData();
    }
  }, [taskId]);

  async function fetchTaskData() {
    setLoading(true);
    setError("");
    setDocumentsLoading(true);
    setDocumentsError("");

    try {
      const taskData = await getTaskDetail(taskId);
      setTask(taskData);
      
      // Fetch documents after task loads successfully
      try {
        const documentsData = await getTaskDocuments(taskId);
        setDocuments(documentsData.documents || []);
        
        if (import.meta.env.DEV) {
          console.log('Documents fetched:', documentsData.documents);
        }
      } catch (docErr) {
        setDocumentsError(docErr.message || "Failed to load documents");
      }
    } catch (err) {
      setError(err.message || "Failed to load task details.");
    } finally {
      setLoading(false);
      setDocumentsLoading(false);
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

  // Enhanced permission check using project_owner_id from backend
  const canUploadDocuments = user && (
    task?.assignee_id === user.id || 
    task?.project_owner_id === user.id
  );

  async function handleDocumentUpload(newDocument) {
    setDocuments(prev => [...prev, newDocument]);
  }

  async function handleDocumentDelete(documentId) {
    try {
      await deleteDocument(documentId);
      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
    } catch (err) {
      setDocumentsError(err.message || "Failed to delete document");
    }
  }

  function handleRetryDocuments() {
    fetchDocuments();
  }

  async function fetchDocuments() {
    setDocumentsLoading(true);
    setDocumentsError("");
    
    try {
      const documentsData = await getTaskDocuments(taskId);
      setDocuments(documentsData.documents || []);
    } catch (err) {
      setDocumentsError(err.message || "Failed to load documents");
    } finally {
      setDocumentsLoading(false);
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

          {documentsError && (
            <ErrorMessage error={documentsError} onRetry={handleRetryDocuments} />
          )}

          <div className="task-detail__documents">
            <h2 className="task-detail__section-title">Documents</h2>
            
            {canUploadDocuments && (
              <DocumentUploadForm 
                taskId={task.id} 
                onUploadSuccess={handleDocumentUpload} 
              />
            )}
            
            <DocumentList
              documents={documents}
              currentUserId={user?.id}
              onDelete={handleDocumentDelete}
              loading={documentsLoading}
              error={documentsError}
              onRetry={handleRetryDocuments}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
