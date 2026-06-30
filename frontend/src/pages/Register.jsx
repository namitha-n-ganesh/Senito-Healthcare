import "../App.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Register() {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const [age, setAge] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");

  const registerUser = async () => {

    if (
      name === "" ||
      email === "" ||
      password === "" ||
      role === ""
    ) {
      alert("Please fill all required fields");
      return;
    }

    if (
      role === "Patient" &&
      (
        age === "" ||
        bloodGroup === "" ||
        emergencyContact === ""
      )
    ) {
      alert("Please fill all patient details");
      return;
    }

    const connectionCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    let data;

if (role === "Patient") {

  data = {
    name,
    email,
    password,
    age,
    blood_group: bloodGroup,
    phone: emergencyContact,
    connection_code: connectionCode
  };

}
else {

  data = {
    name,
    email,
    password
  };

}

    try {
      let url = "";

if (role === "Patient") {
  url = "http://localhost:5000/register-patient";
}
else {
  url = "http://localhost:5000/register-caregiver";
}
      const response = await fetch(
        url,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        }
      );

      const result = await response.text();

      if (role === "Patient") {
        alert(
          result +
          "\nConnection Code : " +
          connectionCode
        );
        navigate("/patient-dashboard");
      }
      else {
        alert(result);
        navigate("/caregiver-dashboard");
      }

    }
    catch (error) {

      console.log(error);
      alert("Registration Failed");

    }

  };

  return (
  <div className="container">

    <div className="register-container">

      {/* Left Side */}
      <div className="register-left">

        <h1>Create Your Account</h1>

        <p className="register-subtitle">
          Join Senito Healthcare and experience secure patient monitoring,
          medicine reminders and caregiver support.
        </p>

        <input
          type="text"
          placeholder="👤 Full Name"
          className="input-box"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="📧 Email Address"
          className="input-box"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="🔒 Password"
          className="input-box"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <select
          className="input-box"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="">👥 Select Role</option>

          <option value="Patient">
            Patient
          </option>

          <option value="Caregiver">
            Caregiver
          </option>

        </select>

        {role === "Patient" && (

          <>

            <input
              type="number"
              placeholder="🎂 Age"
              className="input-box"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />

            <input
              type="text"
              placeholder="🩸 Blood Group"
              className="input-box"
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
            />

            <input
              type="text"
              placeholder="📞 Emergency Contact"
              className="input-box"
              value={emergencyContact}
              onChange={(e) => setEmergencyContact(e.target.value)}
            />

          </>

        )}

        <div className="role-info">

          {role === "Patient" && (

            <>
              <h3>🩺 Patient Features</h3>

              <ul>
                <li>✔ Book Appointments</li>
                <li>✔ Upload Reports</li>
                <li>✔ Medicine Reminders</li>
                <li>✔ Health Charts</li>
                <li>✔ SOS Emergency Alerts</li>
              </ul>
            </>

          )}

          {role === "Caregiver" && (

            <>
              <h3>❤️ Caregiver Features</h3>

              <ul>
                <li>✔ View Patient Health</li>
                <li>✔ Receive SOS Alerts</li>
                <li>✔ Medicine Status</li>
                <li>✔ Reports Access</li>
                <li>✔ Health Monitoring</li>
              </ul>
            </>

          )}

        </div>

        <button
          className="btn register-btn"
          onClick={registerUser}
        >
          Create Account
        </button>

        <p className="login-link">

          Already have an account?

          <span
            onClick={() => navigate("/")}
          >
            Login
          </span>

        </p>

      </div>

      {/* Right Side */}

      <div className="register-right">

        <img
  src="/healthcare.png"
  alt="Healthcare"
  className="register-image"
/>

        <h2>Why Join Senito?</h2>

        <div className="feature-box">

          <h4>🔐 Secure Login</h4>

          <p>Your health information stays protected.</p>

        </div>

        <div className="feature-box">

          <h4>🚨 SOS Emergency</h4>

          <p>Instant emergency alerts for caregivers.</p>

        </div>

        <div className="feature-box">

          <h4>💊 Medicine Reminder</h4>

          <p>Never miss your medications.</p>

        </div>

        <div className="feature-box">

          <h4>📈 Health Charts</h4>

          <p>Monitor your health trends visually.</p>

        </div>

        <div className="feature-box">

          <h4>❤️ Care Beyond Distance</h4>

          <p>Stay connected with loved ones anytime.</p>

        </div>

      </div>

    </div>

  </div>
);
}

export default Register;