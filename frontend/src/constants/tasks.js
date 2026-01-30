// Task status values
export const TASK_STATUS = {
  TODO: "todo",
  IN_PROGRESS: "in_progress",
  DONE: "done",
};

// Task column configuration for kanban boards
export const TASK_COLUMNS = [
  {
    key: TASK_STATUS.TODO,
    title: "To Do",
    emptyMessage: "No tasks to do",
  },
  {
    key: TASK_STATUS.IN_PROGRESS,
    title: "In Progress",
    emptyMessage: "No tasks in progress",
  },
  {
    key: TASK_STATUS.DONE,
    title: "Done",
    emptyMessage: "No completed tasks",
  },
];

// CSS custom properties for status colors
export const STATUS_COLORS = {
  [TASK_STATUS.TODO]: "var(--color-todo)",
  [TASK_STATUS.IN_PROGRESS]: "var(--color-progress)",
  [TASK_STATUS.DONE]: "var(--color-done)",
};

export function getStatusColor(status) {
  return STATUS_COLORS[status] || "var(--color-text-secondary)";
}
