import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../api/auth";
import { saveSession, dashboardPathForRole } from "../api/session";
import "./Auth.css";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true);
    try {
      const data = await login({ email: email.trim(), password });
      saveSession({ token: data.token, user: data.user });
      nav(dashboardPathForRole(data.user.role));
    } catch (err) {
      if (err.validationErrors) {
        setFieldErrors(err.validationErrors);
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth__container">
      <div className="auth__card">
        <form onSubmit={onSubmit} className="auth__form">
          <h1 className="auth__title">Log in</h1>

          <div className="form__group">
            <label className="form__label">Email</label>
            <div className="form__input-container">
              <input
                className="form__input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="johnDoe@gmail.com"
                type="email"
                autoFocus
                autoComplete="email"
                required
              />
            </div>
            {fieldErrors.email && (
              <span className="form__field-error">{fieldErrors.email}</span>
            )}
          </div>

          <div className="form__group">
            <label className="form__label">Password</label>
            <div className="form__input-container">
              <input
                className="form__input"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="form__toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>
            {fieldErrors.password && (
              <span className="form__field-error">{fieldErrors.password}</span>
            )}
          </div>

          {error && <div className="form__error">{error}</div>}

          <button className="auth__button" disabled={loading}>
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <div className="auth__footer">
          Don't have an account?
          <Link to="/signup" className="auth__link">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
