export function LoadingSpinner({ message = "Loading..." }) {
  return (
    <div className="dashboard__loading">
      <div className="dashboard__spinner"></div>
      <p>{message}</p>
    </div>
  );
}

export function ErrorMessage({ error, onRetry }) {
  return (
    <div className="dashboard__error">
      <span>{error}</span>
      <button
        className="dashboard__retry-btn"
        onClick={onRetry}
        type="button"
        aria-label="Retry loading"
      >
        Retry
      </button>
    </div>
  );
}

export function EmptyState({ title, message }) {
  return (
    <div className="dashboard__empty-state">
      <h3>{title}</h3>
      <p>{message}</p>
    </div>
  );
}
