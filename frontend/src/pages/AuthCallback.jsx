import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
// import { saveSession, dashboardPathForRole } from "../api/session";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      // Decode token to get user info (you'll need jwt-decode package)
      // npm install jwt-decode
      // import jwtDecode from 'jwt-decode';
      // const user = jwtDecode(token);

      // For now, we'll just save the token and redirect
      // In a real app, you'd want to validate the token first
      localStorage.setItem("token", token);

      // Redirect to dashboard (the dashboard will fetch user data)
      navigate("/");
    } else {
      navigate("/login?error=no_token");
    }
  }, [navigate, searchParams]);

  return (
    <div className="auth-callback">
      <h2>Completing login...</h2>
      <p>Please wait while we log you in.</p>
    </div>
  );
}
