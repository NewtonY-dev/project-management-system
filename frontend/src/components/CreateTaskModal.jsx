import { useState } from "react";
import { createTask } from "../api/tasks";

// Form validation constants
const VALIDATION_RULES = {
  TITLE_MIN_LENGTH: 3,
  DESCRIPTION_MAX_LENGTH: 500,
};

// Validation error messages
const ERROR_MESSAGES = {
  TITLE_REQUIRED: "Task title is required.",
  TITLE_TOO_SHORT: `Task title must be at least ${VALIDATION_RULES.TITLE_MIN_LENGTH} characters.`,
  DESCRIPTION_TOO_LONG: `Description must be less than ${VALIDATION_RULES.DESCRIPTION_MAX_LENGTH} characters.`,
  CREATE_FAILED: "Failed to create task.",
};

function validateTaskForm(title, description) {
  const errors = {};

  if (!title.trim()) {
    errors.title = ERROR_MESSAGES.TITLE_REQUIRED;
  } else if (title.trim().length < VALIDATION_RULES.TITLE_MIN_LENGTH) {
    errors.title = ERROR_MESSAGES.TITLE_TOO_SHORT;
  }

  if (
    description &&
    description.length > VALIDATION_RULES.DESCRIPTION_MAX_LENGTH
  ) {
    errors.description = ERROR_MESSAGES.DESCRIPTION_TOO_LONG;
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

export default function CreateTaskModal({
  isOpen,
  onClose,
  projectId,
  onTaskCreated,
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  if (!isOpen) return null;

  const handleInputChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));

    // Clear field-specific error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    }

    // Clear general error when user makes changes
    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { isValid, errors } = validateTaskForm(
      formData.title,
      formData.description,
    );

    if (!isValid) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const taskData = {
        title: formData.title.trim(),
        description: formData.description.trim() || null,
      };

      const newTask = await createTask(projectId, taskData);
      onTaskCreated(newTask);
      handleClose();
    } catch (err) {
      if (err.validationErrors) {
        setFieldErrors(err.validationErrors);
      } else {
        setError(err.message || ERROR_MESSAGES.CREATE_FAILED);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ title: "", description: "" });
    setError("");
    setFieldErrors({});
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <div className="modal__backdrop" onClick={handleBackdropClick}>
      <div className="modal__container">
        <div className="modal__header">
          <h2 className="modal__title">Create New Task</h2>
          <button
            className="modal__close-btn"
            onClick={handleClose}
            aria-label="Close modal"
            type="button"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal__form">
          <div className="form__group">
            <label className="form__label">Task Title *</label>
            <input
              className="form__input"
              value={formData.title}
              onChange={handleInputChange("title")}
              placeholder="Enter task title"
              type="text"
              autoFocus
              required
            />
            {fieldErrors.title && (
              <span className="form__field-error">{fieldErrors.title}</span>
            )}
          </div>

          <div className="form__group">
            <label className="form__label">Description</label>
            <textarea
              className="form__input form__textarea"
              value={formData.description}
              onChange={handleInputChange("description")}
              placeholder="Enter task description (optional)"
              rows={4}
            />
            {fieldErrors.description && (
              <span className="form__field-error">
                {fieldErrors.description}
              </span>
            )}
          </div>

          {error && <div className="form__error">{error}</div>}

          <div className="modal__actions">
            <button
              type="button"
              className="modal__btn modal__btn--secondary"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="modal__btn modal__btn--primary"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
