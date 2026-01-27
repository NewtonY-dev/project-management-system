export function saveSession({ token, user }) {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
}

export function getUser() {
  const raw = localStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
}

export function getToken() {
  return localStorage.getItem("token");
}

export function dashboardPathForRole(role) {
  if (role === "project_manager") return "/pm";
  if (role === "team_member") return "/tm";
  return "/login";
}

export function clearSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export function logout() {
  clearSession();
  return "/login";
}