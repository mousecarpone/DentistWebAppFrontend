import "./styles.css"

export default function Login() {
  return (
    <div className="container">
      <header>
        <div className="logo">San Diego Dental Studio</div>
        <nav>
          <ul>
            <li>
              <a href="index.html">Home</a>
            </li>
            <li>
              <a href="services.html">Services</a>
            </li>
            <li>
              <a href="hygiene.html">Dental Hygiene</a>
            </li>
            <li>
              <a href="login.jsx" className="portal-btn">
                Patient Portal
              </a>
            </li>
          </ul>
        </nav>
      </header>

      <main className="login-page">
        <div className="login-container">
          <h1>Patient Portal</h1>
          <p>Access your dental records, appointments, and more.</p>

          <form className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" required />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" name="password" required />
            </div>

            <div className="form-actions">
              <button type="submit" className="cta-button">
                Log In
              </button>
              <a href="#" className="text-link">
                Forgot Password?
              </a>
            </div>
          </form>

          <div className="new-patient">
            <p>
              New patient?{" "}
              <a href="#" className="text-link">
                Register here
              </a>
            </p>
          </div>
        </div>
      </main>

      <footer>
        <div className="footer-content">
          <div className="contact">
            <h3>Contact Us</h3>
            <p>3295 Meade Ave, San Diego, CA 92116</p>
            <p>Phone: (619) 280-5408</p>
            <p>Email: info@sandiegodentalstudio.com</p>
          </div>
          <div className="hours">
            <h3>Office Hours</h3>
            <p>Monday - Thursday: 8am - 5pm</p>
            <p>Friday: 8am - 2pm</p>
            <p>Saturday - Sunday: Closed</p>
          </div>
        </div>
        <div className="copyright">
          <p>&copy; 2023 San Diego Dental Studio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
