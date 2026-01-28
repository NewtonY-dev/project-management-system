
import { useState } from "react";
import { createProject } from "../api/projects";


function validateForm(title, description) {
  const errors = {};
  
  if (!title.trim()) {
    errors.title = "Project title is required.";
  } else if (title.trim().length < 3) {
    errors.title = "Project title must be at least 3 characters.";
  }
  
  if (description && description.length > 500) {
    errors.description = "Description must be less than 500 characters.";
  }
  
  return { isValid: Object.keys(errors).length === 0, errors };
}


export default function CreateProjectModal({ isOpen, onClose, onProjectCreated }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  if (!isOpen) return null;

  const handleInputChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    // Clear field-specific errors when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: "" }));
    }
    // Clear general error when user makes changes
    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const { isValid, errors } = validateForm(formData.title, formData.description);
    
    if (!isValid) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const projectData = {
        title: formData.title.trim(),
        description: formData.description.trim() || null,
      };

      const newProject = await createProject(projectData);
      onProjectCreated(newProject);
      handleClose();
    } catch (err) {
      if (err.validationErrors) {
        setFieldErrors(err.validationErrors);
      } else {
        setError(err.message || "Failed to create project.");
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
          <h2 className="modal__title">Create New Project</h2>
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
            <label className="form__label">Project Title *</label>
            <input
              className="form__input"
              value={formData.title}
              onChange={handleInputChange("title")}
              placeholder="Enter project title"
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
              placeholder="Enter project description (optional)"
              rows={4}
            />
            {fieldErrors.description && (
              <span className="form__field-error">{fieldErrors.description}</span>
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
              {loading ? "Creating..." : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
