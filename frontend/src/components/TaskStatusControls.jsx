import { TASK_STATUS, getStatusColor } from "../constants/tasks";

function getNextStatusOptions(currentStatus) {
  const statusMap = {
    [TASK_STATUS.TODO]: [
      {
        value: TASK_STATUS.IN_PROGRESS,
        label: "Start Progress",
        className: "status-btn--progress",
      },
    ],
    [TASK_STATUS.IN_PROGRESS]: [
      {
        value: TASK_STATUS.DONE,
        label: "Mark Complete",
        className: "status-btn--done",
      },
    ],
    [TASK_STATUS.DONE]: [],
  };

  return statusMap[currentStatus] || [];
}

export default function TaskStatusControls({
  task,
  currentUserId,
  onStatusChange,
  disabled = false,
}) {
  const canUpdateStatus = currentUserId === task.assignee_id;
  const statusOptions = getNextStatusOptions(task.status);

  // Render read-only status display
  if (!canUpdateStatus) {
    return (
      <div className="task-status-controls task-status-controls--readonly">
        <div className="task-status-controls__current">
          <span className="task-status-controls__label">Status:</span>
          <div
            className="task-status-controls__indicator"
            style={{ backgroundColor: getStatusColor(task.status) }}
          />
          <span className="task-status-controls__value">
            {task.status.replace("_", " ")}
          </span>
        </div>
        {!task.assignee_id && (
          <p className="task-status-controls__unassigned">
            This task is not assigned to anyone.
          </p>
        )}
      </div>
    );
  }

  // Render interactive status controls
  return (
    <div className="task-status-controls">
      <div className="task-status-controls__current">
        <span className="task-status-controls__label">Status:</span>
        <div
          className="task-status-controls__indicator"
          style={{ backgroundColor: getStatusColor(task.status) }}
        />
        <span className="task-status-controls__value">
          {task.status.replace("_", " ")}
        </span>
      </div>

      {statusOptions.length > 0 && (
        <div className="task-status-controls__actions">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              className={`task-status-controls__btn ${option.className}`}
              onClick={() => onStatusChange(option.value)}
              disabled={disabled}
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
