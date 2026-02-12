import { LoadingSpinner, ErrorMessage, EmptyState } from "./Dashboard";
import DocumentItem from "./DocumentItem";

export default function DocumentList({ documents, currentUserId, onDelete, loading, error, onRetry }) {
  if (loading) {
    return <LoadingSpinner message="Loading documents..." />;
  }

  if (error) {
    return <ErrorMessage error={error} onRetry={onRetry} />;
  }

  if (!documents || documents.length === 0) {
    return (
      <EmptyState
        title="No Documents"
        message="No documents have been uploaded to this task yet."
      />
    );
  }

  return (
    <div className="document-list">
      <div className="document-list__header">
        <h3 className="document-list__title">
          Documents ({documents.length})
        </h3>
      </div>

      <div className="document-list__grid">
        {documents.map((document) => (
          <DocumentItem
            key={document.id}
            document={document}
            currentUserId={currentUserId}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
