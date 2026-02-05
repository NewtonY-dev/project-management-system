import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { saveSession, dashboardPathForRole } from "../api/session";

const GOOGLE_AUTH_ENDPOINT = "/api/auth/google/token";

function GoogleLoginButton() {
  const navigate = useNavigate();
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const handleGoogleAuthSuccess = async (credentialResponse) => {
    try {
      const response = await authenticateWithBackend(credentialResponse.credential);
      const authData = await response.json();

      if (response.ok) {
        await handleSuccessfulAuth(authData);
      } else {
        handleAuthError(response.status, authData);
      }
    } catch (error) {
      handleNetworkError(error);
    }
  };

  const authenticateWithBackend = async (token) => {
    const response = await fetch(`${apiBaseUrl}${GOOGLE_AUTH_ENDPOINT}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    return response;
  };

  const handleSuccessfulAuth = async (authData) => {
    saveSession({ token: authData.token, user: authData.user });
    
    const dashboardPath = dashboardPathForRole(authData.user.role);
    navigate(dashboardPath);
  };

  const handleAuthError = (status, errorData) => {
    // Store error info for potential UI feedback in future
    const errorInfo = { status, error: errorData.error || errorData.message };
    
    if (import.meta.env.DEV) {
      console.error('Authentication error:', errorInfo);
    }
    
    // Silent error handling in production
    // Could add toast notifications or error state management here
  };

  const handleNetworkError = (error) => {
    // Handle network-specific errors
    const networkErrorInfo = {
      name: error.name,
      message: error.message,
      isNetworkError: true
    };
    
    if (import.meta.env.DEV) {
      console.error('Network error:', networkErrorInfo);
    }
    
    // Silent error handling in production
    // Could add retry logic or user notification here
  };

  const handleGoogleAuthError = () => {
    // Handle Google SDK initialization or configuration errors
    const googleErrorInfo = {
      type: 'google_auth_error',
      message: 'Google authentication initialization failed'
    };
    
    if (import.meta.env.DEV) {
      console.error('Google auth error:', googleErrorInfo);
    }
    
    // Silent error handling in production
    // Could show fallback login method here
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleLogin
        onSuccess={handleGoogleAuthSuccess}
        onError={handleGoogleAuthError}
        useOneTap={false}
        theme="filled_blue"
        size="large"
        text="signin_with"
        shape="rectangular"
        width="300"
      />
    </GoogleOAuthProvider>
  );
}

export default GoogleLoginButton;
