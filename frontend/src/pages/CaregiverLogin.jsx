import "./../App.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function CaregiverLogin() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const loginCaregiver = async () => {

    if (email === "" || password === "") {
      alert("Please fill all fields");
      return;
    }

    try {

      const response = await fetch(
        "http://localhost:5000/caregiver-login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email,
            password
          })
        }
      );

      const result = await response.text();

      if (result === "Login Successful") {

        alert(result);

        navigate("/caregiver-dashboard");

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
            Caregiver Login
          </h1>

          <p className="login-subtitle">
            Login to monitor your connected patients,
            receive emergency alerts and manage
            healthcare from anywhere.
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
              onClick={() => setShowPassword(!showPassword)}
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
            onClick={loginCaregiver}
          >
            ❤️ Login as Caregiver
          </button>

          <div className="divider">
            <span>or</span>
          </div>

          <button
            className="register-btn2"
            onClick={() => navigate("/register")}
          >
            👤 Create Caregiver Account
          </button>

          <p className="secure-text">
            🛡️ Secure access to patient care and monitoring.
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

              📊

              <h4>Patient Monitoring</h4>

              <p>
                View patient vitals
                in real time.
              </p>

            </div>

            <div className="login-feature">

              🚨

              <h4>Emergency Alerts</h4>

              <p>
                Receive SOS alerts
                instantly.
              </p>

            </div>

            <div className="login-feature">

              💊

              <h4>Medicine Tracking</h4>

              <p>
                Monitor medicine
                adherence easily.
              </p>

            </div>

          </div>

          <div className="quote-box">

            <h3>
              ❤️ Caring Beyond Distance
            </h3>

            <p>
              Stay connected with your loved ones
              anytime, anywhere.
            </p>

          </div>

        </div>

      </div>

    </div>

  );

}

export default CaregiverLogin;