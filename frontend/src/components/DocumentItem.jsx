import { useState } from "react";
import { downloadDocument, deleteDocument } from "../api/tasks";
import { formatFileSize, formatDate } from "../utils/format";

export default function DocumentItem({ document, currentUserId, onDelete }) {
  const [deleting, setDeleting] = useState(false);

  const getFileIcon = (mimeType) => {
    if (!mimeType) return "📄";
    
    if (mimeType.startsWith("image/")) return "🖼️";
    if (mimeType.includes("pdf")) return "📄";
    if (mimeType.includes("word") || mimeType.includes("document")) return "📝";
    if (mimeType.includes("text")) return "📄";
    
    return "📎";
  };

  const handleDownload = () => {
    downloadDocument(document.id);
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this document?")) {
      return;
    }

    setDeleting(true);
    try {
      await onDelete(document.id);
    } catch (error) {
      // Error handling delegated to calling component
    } finally {
      setDeleting(false);
    }
  };

  const canDelete = document.author_id === currentUserId;
  const fileIcon = getFileIcon(document.mime_type);

  return (
    <div className="document-item">
      <div className="document-item__icon">
        <span className="document-item__icon-emoji">{fileIcon}</span>
      </div>
      
      <div className="document-item__info">
        <div className="document-item__name" title={document.original_filename}>
          {document.original_filename}
        </div>
        
        <div className="document-item__meta">
          <span className="document-item__size">
            {formatFileSize(document.file_size)}
          </span>
          <span className="document-item__separator">•</span>
          <span className="document-item__author">
            {document.author_name}
          </span>
          <span className="document-item__separator">•</span>
          <span className="document-item__date">
            {formatDate(document.created_at)}
          </span>
        </div>
      </div>

      <div className="document-item__actions">
        <button
          onClick={handleDownload}
          className="document-item__action-btn document-item__download-btn"
          title="Download document"
        >
          ⬇️
        </button>

        {canDelete && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="document-item__action-btn document-item__delete-btn"
            title="Delete document"
          >
            {deleting ? "🗙️" : "🗑️"}
          </button>
        )}
      </div>
    </div>
  );
}
