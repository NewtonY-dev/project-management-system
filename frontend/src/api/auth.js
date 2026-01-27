const API_BASE = "http://localhost:8080";

export async function login({ email, password }) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(data.error || data.message || "Login failed");
    error.validationErrors = data.errors;
    throw error;
  }
  return data; // { token, user }
}

export async function register({ name, email, password, role }) {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, role }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(data.error || data.message || "Sign-up failed");
    error.validationErrors = data.errors;
    throw error;
  }
  return data; // { token, user }
}
