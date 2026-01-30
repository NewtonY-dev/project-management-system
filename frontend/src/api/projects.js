import { apiRequest } from "./utils";

// API endpoints
export async function getProjects() {
  return apiRequest("/api/projects", { method: "GET" });
}

export async function createProject({ title, description }) {
  return apiRequest("/api/projects", {
    method: "POST",
    body: JSON.stringify({ title, description }),
  });
}
