import { useState } from "react";

export default function CommentForm({ onSubmit, disabled = false }) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(content.trim());
      setContent(""); // Clear form on successful submission
    } catch (error) {
      // Error handling is done by parent component
      console.error("Comment form error:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleContentChange(e) {
    setContent(e.target.value);
  }

  const isSubmitDisabled = disabled || isSubmitting || !content.trim();

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <div className="comment-form__field">
        <textarea
          className="comment-form__textarea"
          value={content}
          onChange={handleContentChange}
          placeholder="Add a comment..."
          rows={3}
          disabled={disabled || isSubmitting}
          maxLength={1000}
        />
      </div>
      <div className="comment-form__actions">
        <button
          type="submit"
          className="comment-form__submit-btn"
          disabled={isSubmitDisabled}
        >
          {isSubmitting ? "Adding..." : "Add Comment"}
        </button>
      </div>
    </form>
  );
}
