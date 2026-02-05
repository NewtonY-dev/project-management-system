const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export async function verifyGoogleToken(token) {
  try {
    const response = await fetch(`${API_BASE}/api/auth/google/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      const error = new Error(data.error || data.message || "Google token verification failed");
      error.status = response.status;
      throw error;
    }
    
    return data;
  } catch (error) {
    throw error;
  }
}

export async function login(credentials) {
  const { email, password } = credentials;
  
  try {
    const response = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      const error = new Error(data.error || data.message || "Login failed");
      error.validationErrors = data.errors;
      error.status = response.status;
      throw error;
    }
    
    return data;
  } catch (error) {
    throw error;
  }
}

export async function register(userData) {
  const { name, email, password, role } = userData;
  
  try {
    const response = await fetch(`${API_BASE}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      const error = new Error(data.error || data.message || "Registration failed");
      error.validationErrors = data.errors;
      error.status = response.status;
      throw error;
    }
    
    return data;
  } catch (error) {
    throw error;
  }
}
