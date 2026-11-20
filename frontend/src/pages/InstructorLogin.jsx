import './InstructorLogin.css';

export default function InstructorLogin({ onLogin, onBackToMain }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get('username');
    const password = formData.get('password');

    if (typeof name !== 'string' || !name.trim() || typeof password !== 'string' || !password) {
      return;
    }

    onLogin({
      name: name.trim(),
      email: name.trim(),
      role: 'instructor'
    });
  };

  return (
    <main className="inst-login-page">
      <section className="inst-login-card" aria-labelledby="inst-login-title">
        <div className="inst-login-brand">
          <div className="inst-login-logo" aria-hidden="true">EP</div>
          <div>
            <div className="inst-login-brand-title">EduPulse</div>
            <span className="inst-login-brand-sub">Learning Management</span>
          </div>
        </div>

        <span className="inst-login-portal">Instructor Portal</span>
        <div className="inst-login-heading">
          <h1 id="inst-login-title">Instructor Sign In</h1>
          <p>Sign in to manage your courses, grades, and students.</p>
        </div>

        <form className="inst-login-form" onSubmit={handleSubmit}>
          <div className="inst-login-field">
            <label htmlFor="inst-login-username">Username or email</label>
            <input
              id="inst-login-username"
              name="username"
              type="text"
              autoComplete="username"
              placeholder="Enter your username or email"
              required
            />
          </div>

          <div className="inst-login-field">
            <label htmlFor="inst-login-password">Password</label>
            <input
              id="inst-login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="inst-login-submit">Sign in to portal</button>
        </form>

        <p className="inst-login-note">Demo access. Enter any username and password.</p>
        <button type="button" className="inst-login-back" onClick={onBackToMain}>
          Back to Student / Main Login
        </button>
      </section>
    </main>
  );
}
