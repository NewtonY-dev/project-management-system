import { apiRequest } from "./utils";

// Project-related endpoints
export async function getProject(projectId) {
  return apiRequest(`/api/projects/${projectId}`, { method: "GET" });
}

export async function getProjectTasks(projectId) {
  return apiRequest(`/api/projects/${projectId}/tasks`, { method: "GET" });
}

export async function createTask(projectId, { title, description }) {
  return apiRequest(`/api/tasks/${projectId}/tasks`, {
    method: "POST",
    body: JSON.stringify({ title, description }),
  });
}

// Task management endpoints
export async function updateTaskStatus(taskId, status) {
  return apiRequest(`/api/tasks/${taskId}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
}

export async function assignTask(taskId, userId) {
  return apiRequest(`/api/tasks/${taskId}/assign`, {
    method: "PUT",
    body: JSON.stringify({ assignee_id: userId }),
  });
}

// User-related endpoints
export async function getMyTasks() {
  return apiRequest("/api/tasks/me", { method: "GET" });
}

export async function getTeamMembers() {
  return apiRequest("/api/users?role=team_member", { method: "GET" });
}

// Task detail endpoints
export async function getTaskDetail(taskId) {
  return apiRequest(`/api/tasks/${taskId}`, { method: "GET" });
}

export async function addTaskComment(taskId, content) {
  return apiRequest(`/api/tasks/${taskId}/comments`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });
}

// Document-related endpoints
export async function getTaskDocuments(taskId) {
  return apiRequest(`/api/documents/${taskId}/documents`, { method: "GET" });
}

export async function uploadDocument(taskId, file) {
  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("document", file);
  
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"}/api/documents/${taskId}/documents`, {
    method: "POST",
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: formData
  });
  
  return handleResponse(response);
}

export async function deleteDocument(documentId) {
  return apiRequest(`/api/documents/${documentId}`, { method: "DELETE" });
}

export async function downloadDocument(documentId) {
  const token = localStorage.getItem("token");
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
  
  // Append token as query parameter for download authentication
  const downloadUrl = `${baseUrl}/api/documents/${documentId}/download?token=${encodeURIComponent(token)}`;
  
  // Create temporary link and trigger download
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
