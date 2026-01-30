const API_BASE = "http://localhost:8080";

export function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

export async function handleResponse(res) {
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const error = new Error(data.error || data.message || "Request failed");
    error.validationErrors = data.errors;
    error.status = res.status;
    throw error;
  }

  return data;
}

export async function apiRequest(url, options = {}) {
  const response = await fetch(`${API_BASE}${url}`, {
    headers: getAuthHeaders(),
    ...options,
  });

  return handleResponse(response);
}
