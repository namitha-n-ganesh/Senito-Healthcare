import "../App.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function PatientLogin() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const loginPatient = async () => {

    if (email === "" || password === "") {
      alert("Please fill all fields");
      return;
    }

    try {

      const response = await fetch(
        "http://localhost:5000/patient-login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const result = await response.json();

      if (result.message === "Login Successful") {

        localStorage.setItem(
          "patient_id",
          result.patient_id
        );

        alert(result.message);

        navigate("/patient-dashboard");

      }
      else {

        alert("Invalid Credentials");

      }

    }
    catch (error) {

      console.log(error);
      alert("Login Failed");

    }

  };

  return (
  <div className="container">

    <div className="login-container">

      {/* Left Side */}

      <div className="login-left">

        <div className="brand">

          <h2>💙 Senito Healthcare</h2>

        </div>

        <h4 className="welcome-text">
          Welcome Back!
        </h4>

        <h1 className="login-title">
          Patient Login
        </h1>

        <p className="login-subtitle">
          Login to access your health dashboard,
          monitor your health and stay connected
          with your caregivers.
        </p>

        <label>Email Address</label>

        <input
          type="email"
          className="input-box"
          placeholder="📧 Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Password</label>

        <div className="password-box">

          <input
            type={showPassword ? "text" : "password"}
            className="input-box"
            placeholder="🔒 Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="button"
            className="eye-btn"
            onClick={() =>
              setShowPassword(!showPassword)
            }
          >
            {showPassword ? "🙈" : "👁"}
          </button>

        </div>

        <div className="login-options">

          <label>

            <input type="checkbox" />

            Remember Me

          </label>

          <span className="forgot-password">

            Forgot Password?

          </span>

        </div>

        <button
          className="btn login-btn"
          onClick={loginPatient}
        >
          🔓 Login
        </button>

        <div className="divider">

          <span>or</span>

        </div>

        <button
          className="register-btn2"
          onClick={() => navigate("/register")}
        >
          👤 New Patient? Create an Account
        </button>

        <p className="secure-text">

          🛡️ Your data is safe and secure with us.

        </p>

      </div>

      {/* Right Side */}

      <div className="login-right">

        <img
          src="/healthcare.png"
          alt="Healthcare"
          className="login-image"
        />

        <div className="feature-row">

          <div className="login-feature">

            ❤️

            <h4>Monitor</h4>

            <p>
              Track your health
              in real time.
            </p>

          </div>

          <div className="login-feature">

            🔔

            <h4>Reminder</h4>

            <p>
              Get medicine &
              appointment alerts.
            </p>

          </div>

          <div className="login-feature">

            👨‍👩‍👧

            <h4>Connect</h4>

            <p>
              Stay connected
              with caregivers.
            </p>

          </div>

        </div>

        <div className="quote-box">

          <h3>
            💙 Your health is our priority.
          </h3>

          <p>

            We're here to support you
            every step of the way.

          </p>

        </div>

      </div>

    </div>

  </div>
);
      
}

export default PatientLogin;