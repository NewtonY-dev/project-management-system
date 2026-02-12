import { useState } from "react";
import { uploadDocument } from "../api/tasks";
import { formatFileSize } from "../utils/format";

export default function DocumentUploadForm({ taskId, onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (selectedFile.size > maxSize) {
      setError("File size must be less than 10MB");
      return;
    }

    setFile(selectedFile);
    setError("");

    if (import.meta.env.DEV) {
      console.log('DocumentUploadForm: File selected', {
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type
      });
    }
  };

  const handleUpload = () => {''
    if (!file || uploading) return;

    setUploading(true);
    setError("");
    setProgress(0);

    // Create XMLHttpRequest for progress tracking
    const xhr = new XMLHttpRequest();
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("file", file);

    // Track upload progress
    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) {
        const percentComplete = (e.loaded / e.total) * 100;
        setProgress(percentComplete);
        
        if (import.meta.env.DEV) {
          console.log(`Upload progress: ${percentComplete}%`);
        }
      }
    });

    // Handle completion
    xhr.addEventListener("load", () => {
      if (xhr.status === 201) {
        const response = JSON.parse(xhr.responseText);
        onUploadSuccess(response);
        setFile(null);
        setProgress(0);
        // Reset file input
        document.getElementById('file-input').value = '';
      } else {
        setError("Upload failed. Please try again.");
      }
      setUploading(false);
    });

    // Handle errors
    xhr.addEventListener("error", () => {
      setError("Upload failed. Please check your connection.");
      setUploading(false);
    });

    // Send request
    xhr.open("POST", `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"}/api/documents/${taskId}/documents`);
    xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    xhr.send(formData);
  };

  return (
    <div className="document-upload-form">
      <div className="document-upload-form__input-section">
        <input
          id="file-input"
          type="file"
          accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.txt"
          onChange={handleFileSelect}
          disabled={uploading}
        />
        <button
          type="button"
          onClick={handleUpload}
          disabled={!file || uploading}
          className="document-upload-form__upload-btn"
        >
          {uploading ? "Uploading..." : "Upload Document"}
        </button>
      </div>

      {file && (
        <div className="document-upload-form__file-info">
          <span className="document-upload-form__file-name">{file.name}</span>
          <span className="document-upload-form__file-size">{formatFileSize(file.size)}</span>
        </div>
      )}

      {uploading && (
        <div className="document-upload-form__progress">
          <div 
            className="document-upload-form__progress-bar"
            style={{ width: `${progress}%` }}
          />
          <span className="document-upload-form__progress-text">{Math.round(progress)}%</span>
        </div>
      )}

      {error && (
        <div className="document-upload-form__error">
          {error}
        </div>
      )}
    </div>
  );
}
