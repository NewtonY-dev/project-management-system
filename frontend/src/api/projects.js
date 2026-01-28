const API_BASE = "http://localhost:8080";

// Helper functions
function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

async function handleResponse(res) {
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const error = new Error(data.error || data.message || "Request failed");
    error.validationErrors = data.errors;
    error.status = res.status;
    throw error;
  }

  return data;
}

async function apiRequest(url, options = {}) {
  const response = await fetch(`${API_BASE}${url}`, {
    headers: getAuthHeaders(),
    ...options,
  });

  return handleResponse(response);
}

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
