import { useNavigate } from "react-router-dom";

function TaskSummary({ taskSummary }) {
  const { todo = 0, in_progress = 0, done = 0 } = taskSummary;

  return (
    <div className="project-card__task-summary">
      <div className="task-summary__item">
        <span className="task-summary__label">To Do</span>
        <span className="task-summary__count task-summary__count--todo">
          {todo}
        </span>
      </div>
      <div className="task-summary__item">
        <span className="task-summary__label">In Progress</span>
        <span className="task-summary__count task-summary__count--progress">
          {in_progress}
        </span>
      </div>
      <div className="task-summary__item">
        <span className="task-summary__label">Done</span>
        <span className="task-summary__count task-summary__count--done">
          {done}
        </span>
      </div>
    </div>
  );
}


function ProjectMeta({ createdAt }) {
  return (
    <div className="project-card__footer">
      <span className="project-card__date">
        Created {new Date(createdAt).toLocaleDateString()}
      </span>
      <span className="project-card__action">View Details →</span>
    </div>
  );
}

export default function ProjectCard({ project }) {
  const navigate = useNavigate();

  const { task_summary = { todo: 0, in_progress: 0, done: 0 } } = project;
  const totalTasks =
    task_summary.todo + task_summary.in_progress + task_summary.done;

  const handleCardClick = () => {
    // Navigate to project detail page (will be implemented later)
    console.log(`Navigate to project ${project.id}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleCardClick();
    }
  };

  return (
    <div
      className="project-card"
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Project: ${project.title}, ${totalTasks} tasks`}
    >
      <div className="project-card__header">
        <h3 className="project-card__title" title={project.title}>
          {project.title}
        </h3>
        <span className="project-card__task-count">{totalTasks} tasks</span>
      </div>

      {project.description && (
        <p className="project-card__description" title={project.description}>
          {project.description}
        </p>
      )}

      <TaskSummary taskSummary={task_summary} />
      <ProjectMeta createdAt={project.created_at} />
    </div>
  );
}
