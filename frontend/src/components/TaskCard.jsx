import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Task status configuration
const TASK_STATUS = {
  TODO: "todo",
  IN_PROGRESS: "in_progress",
  DONE: "done",
};

// CSS custom properties for status colors
const STATUS_COLORS = {
  [TASK_STATUS.TODO]: "var(--color-todo)",
  [TASK_STATUS.IN_PROGRESS]: "var(--color-progress)",
  [TASK_STATUS.DONE]: "var(--color-done)",
};

function getStatusColor(status) {
  return STATUS_COLORS[status] || "var(--color-text-secondary)";
}

function TaskAssignee({
  task,
  teamMembers,
  isAssigning,
  showDropdown,
  onAssignClick,
  onTeamMemberSelect,
}) {
  return (
    <div className="task-card__assign-section">
      {showDropdown && (
        <div
          className="task-card__assign-dropdown"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="task-card__assign-dropdown-header">
            {task.assigned_name ? "Reassign to:" : "Assign to:"}
          </div>
          {(teamMembers || []).map((member) => (
            <button
              key={member.id}
              className={`task-card__assign-option ${
                task.assigned_name === member.name ? "current-assignee" : ""
              }`}
              onClick={(e) => onTeamMemberSelect(member.id, e)}
              disabled={isAssigning}
              type="button"
            >
              <span>{member.name}</span>
              {task.assigned_name === member.name && <span>✓</span>}
            </button>
          ))}
        </div>
      )}

      {task.assigned_name ? (
        <div className="task-card__assignee-with-btn">
          <span className="task-card__assignee-name">{task.assigned_name}</span>
          <button
            className="task-card__reassign-btn"
            onClick={onAssignClick}
            disabled={isAssigning}
            type="button"
            title="Reassign task"
          >
            {isAssigning ? "..." : "↻"}
          </button>
        </div>
      ) : (
        <button
          className="task-card__assign-btn"
          onClick={onAssignClick}
          disabled={isAssigning}
          type="button"
        >
          {isAssigning ? "Assigning..." : "Assign"}
        </button>
      )}
    </div>
  );
}

function TaskStatusActions({ task, onStatusChange }) {
  return (
    <div className="task-card__status-actions">
      {task.status === TASK_STATUS.TODO && (
        <button
          className="task-card__status-btn task-card__status-btn--progress"
          onClick={() => onStatusChange(TASK_STATUS.IN_PROGRESS)}
          type="button"
          title="Move to In Progress"
        >
          →
        </button>
      )}
      {task.status === TASK_STATUS.IN_PROGRESS && (
        <button
          className="task-card__status-btn task-card__status-btn--done"
          onClick={() => onStatusChange(TASK_STATUS.DONE)}
          type="button"
          title="Mark as Done"
        >
          ✓
        </button>
      )}
    </div>
  );
}

export default function TaskCard({
  task,
  onStatusChange,
  onAssign,
  teamMembers,
  activeDropdownId,
  setActiveDropdownId,
}) {
  const [isAssigning, setIsAssigning] = useState(false);
  const showAssignDropdown = activeDropdownId === task.id;
  const navigate = useNavigate();

  const handleStatusChange = (newStatus) => {
    onStatusChange(task.id, newStatus);
  };

  const handleAssignClick = (e) => {
    e.stopPropagation();
    setActiveDropdownId(showAssignDropdown ? null : task.id);
  };

  const handleTeamMemberSelect = (userId, e) => {
    e.stopPropagation();
    setIsAssigning(true);
    onAssign(task.id, userId).finally(() => {
      setIsAssigning(false);
      setActiveDropdownId(null);
    });
  };

  const handleCardClick = () => {
    navigate(`/tasks/${task.id}`);
  };

  return (
    <div className="task-card task-card--clickable" onClick={handleCardClick}>
      <div className="task-card__header">
        <h4 className="task-card__title">{task.title}</h4>
        <div
          className="task-card__status-indicator"
          style={{ backgroundColor: getStatusColor(task.status) }}
        />
      </div>

      {task.description && (
        <p className="task-card__description">{task.description}</p>
      )}

      <div className="task-card__footer">
        <TaskAssignee
          task={task}
          teamMembers={teamMembers}
          isAssigning={isAssigning}
          showDropdown={showAssignDropdown}
          onAssignClick={handleAssignClick}
          onTeamMemberSelect={handleTeamMemberSelect}
        />

        <TaskStatusActions task={task} onStatusChange={handleStatusChange} />
      </div>
    </div>
  );
}
