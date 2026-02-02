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
