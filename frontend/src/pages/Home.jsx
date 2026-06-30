import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="container">

      <div className="hero">

  <h1>Care Beyond Distance ❤️</h1>

  <p>
    Smart healthcare platform connecting patients and caregivers through
    medicine reminders, health monitoring, appointments and emergency support.
  </p>

  <button className="hero-btn">
    Get Started
  </button>

</div>

      {/* About Section */}
      <div className="dashboard-card">
        <h2>About Senito</h2>

        <p>
          Senito is a healthcare monitoring platform that connects
          patients and caregivers. It helps users manage medicines,
          appointments, emergency alerts, health records, and
          real-time monitoring to ensure better care and safety.
        </p>
      </div>

      {/* Features Section */}
      <h2>Our Features</h2>

      <div className="dashboard-grid">

        <div className="dashboard-card feature-card">
          <h2>💊</h2>
          <h3>Medicine Reminders</h3>
        </div>

        <div className="dashboard-card feature-card">
          <h2>📅</h2>
          <h3>Appointment Booking</h3>
        </div>

        <div className="dashboard-card feature-card">
          <h2>🚨</h2>
          <h3>Emergency Alerts</h3>
        </div>

        <div className="dashboard-card feature-card">
          <h2>💓</h2>
          <h3>Health Monitoring</h3>
        </div>

        <div className="dashboard-card feature-card">
          <h2>📍</h2>
          <h3>Location Tracking</h3>
        </div>

        <div className="dashboard-card feature-card">
          <h2>👨‍⚕️</h2>
          <h3>Caregiver Support</h3>
        </div>

      </div>

      {/* Get Started Section */}
      <div className="dashboard-card get-started">
  <h2>Get Started</h2>

  <div className="button-group">

    <Link to="/patient-login">
      <button className="btn">Patient Login</button>
    </Link>

    <Link to="/caregiver-login">
      <button className="btn">Caregiver Login</button>
    </Link>

    <Link to="/register">
      <button className="btn">Register</button>
    </Link>

  </div>
</div>

      {/* Footer */}
      <footer className="footer">
        <p>© 2026 Senito Healthcare</p>
        <p>Care Beyond Distance ❤️</p>
      </footer>

    </div>
  );
}

export default Home;