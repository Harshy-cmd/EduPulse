import './Login.css';

export default function Login({ onLogin, onInstructorLogin }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    const submittedUserName = new FormData(event.currentTarget).get('username');
    if (typeof submittedUserName !== 'string' || !submittedUserName.trim()) return;
    onLogin(submittedUserName.trim());
  };

  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-title">
        <div className="login-brand">
          <div className="brand-logo" aria-hidden="true">
            EP
          </div>
          <div>
            <div className="brand-title">EduPulse</div>
            <span className="brand-sub">Learning Management</span>
          </div>
        </div>

        <div className="login-heading">
          <h1 id="login-title">Welcome back</h1>
          <p>Sign in to continue your learning journey.</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="login-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="btn-primary login-submit">
            Sign in
          </button>
        </form>

        <p className="login-note">Demo access. Enter any username and password.</p>
        <button type="button" className="login-instructor-link" onClick={onInstructorLogin}>
          Are you an instructor? Sign in here
        </button>
      </section>
    </main>
  );
}
