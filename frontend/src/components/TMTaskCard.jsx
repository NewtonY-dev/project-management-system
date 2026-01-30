import { getStatusColor } from "../constants/tasks";

export default function TMTaskCard({ task, onClick }) {
  const handleCardClick = () => onClick(task);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleCardClick();
    }
  };

  return (
    <div
      className="task-card task-card--clickable"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label={`View task: ${task.title} from project ${task.project_title}`}
    >
      <div className="task-card__header">
        <h4 className="task-card__title">{task.title}</h4>
        <div
          className="task-card__status-indicator"
          style={{ backgroundColor: getStatusColor(task.status) }}
        />
      </div>

      <div className="task-card__project">
        <span className="task-card__project-label">Project:</span>
        <span className="task-card__project-name">{task.project_title}</span>
      </div>

      <div className="task-card__footer">
        <div className="task-card__status-text">
          Status:{" "}
          <span className="task-card__status-value">
            {task.status.replace("_", " ")}
          </span>
        </div>
        <div className="task-card__click-hint">Click to view details →</div>
      </div>
    </div>
  );
}
