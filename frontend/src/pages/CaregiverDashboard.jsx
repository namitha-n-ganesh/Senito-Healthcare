import "./../App.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function CaregiverDashboard() {

  const navigate = useNavigate();

  const patientId =
    localStorage.getItem("connected_patient_id");

  const [enteredCode, setEnteredCode] = useState("");
  const [connected, setConnected] = useState(false);
  const [patientData, setPatientData] = useState(null);
  const [sosAlerts, setSosAlerts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [vitals, setVitals] = useState(null);
  const [water, setWater] = useState(0);
  const [medicineStatus, setMedicineStatus] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [reports, setReports] = useState([]);
  const [missedMedicines, setMissedMedicines] = useState([]);
  const [lastMissedCount, setLastMissedCount] = useState(0);

  useEffect(() => {

    if (!patientId) {
      return;
    }

    // Patient Details
    fetch(
      `http://localhost:5000/patient-details/${patientId}`
    )
      .then(res => res.json())
      .then(data => {
        setPatientData(data);
        setConnected(true);
      });

    // Latest Vitals
    fetch(
      `http://localhost:5000/vitals/${patientId}`
    )
      .then(res => res.json())
      .then(data => {

        if (data.length > 0) {
          setVitals(data[data.length - 1]);
        }

      });

    // Water Intake
    fetch(
      `http://localhost:5000/water/${patientId}`
    )
      .then(res => res.json())
      .then(data => {

        if (data.length > 0) {
          setWater(data[0].total_glasses);
        }

      });

    // Medicine Status
    fetch(
  `http://localhost:5000/medicine-status/${patientId}`
)
.then((response) => response.json())
.then((data) => {

  setMedicineStatus(data);

  const missed = data.filter(
    (item) => item.status === "Missed"
  );

  setMissedMedicines(missed);

});
    // Notifications
    fetch(
      `http://localhost:5000/notifications/${patientId}`
    )
      .then(res => res.json())
      .then(data => {
        setNotifications(data || []);
      });

    // SOS Alerts
    fetch(
      `http://localhost:5000/sos-alerts/${patientId}`
    )
      .then(res => res.json())
      .then(data => {
        setSosAlerts(data);
      });

    // Appointments
    fetch(
      `http://localhost:5000/appointments/${patientId}`
    )
      .then(res => res.json())
      .then(data => {

        const loadedAppointments =
          data.map(item => ({
            id: item.id,
            doctor: item.doctor_name,
            date: item.appointment_date,
            time: item.appointment_time
          }));

        setAppointments(loadedAppointments);

      });

    // Reports
    fetch(
      `http://localhost:5000/reports/${patientId}`
    )
      .then(res => res.json())
      .then(data => {
        setReports(data);
      });

      

  }, [patientId]);

  useEffect(() => {

  if (!patientId) return;

  const interval = setInterval(() => {

    fetch(
      `http://localhost:5000/medicine-status/${patientId}`
    )
      .then((response) => response.json())
      .then((data) => {

        setMedicineStatus(data);

        const missed = data.filter(
  (item) => item.status === "Missed"
);

if (missed.length > lastMissedCount) {

  const latestMedicine =
    missed[missed.length - 1];

  if ("speechSynthesis" in window) {

    const speech =
      new SpeechSynthesisUtterance(
        `Alert. Patient has missed medicine ${latestMedicine.medicine_name}.`
      );

    speech.lang = "en-US";

    window.speechSynthesis.speak(speech);

  }

}

setLastMissedCount(missed.length);

setMissedMedicines(missed);

      });

    fetch(
      `http://localhost:5000/notifications/${patientId}`
    )
      .then((response) => response.json())
      .then((data) => {

        setNotifications(data || []);

      });

    fetch(
      `http://localhost:5000/sos-alerts/${patientId}`
    )
      .then((response) => response.json())
      .then((data) => {

        setSosAlerts(data);

      });

  }, 5000);

  return () => clearInterval(interval);

}, [patientId, lastMissedCount]);

  const connectPatient = async () => {

    try {

      const response = await fetch(
        "http://localhost:5000/connect-patient",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            connection_code: enteredCode
          })
        }
      );

      const data = await response.json();

      setConnected(true);
      setPatientData(data);

      localStorage.setItem(
        "connected_patient_id",
        data.id
      );

      window.location.reload();

    }
    catch (error) {

      alert("Invalid Connection Code");

    }

  };
  return (
  <div className="container">

    <div className="navbar">

      <h2>Senito Healthcare</h2>

      <button
        className="btn"
        onClick={() => {
          localStorage.removeItem("connected_patient_id");
          navigate("/");
        }}
      >
        Logout
      </button>

    </div>

    <h1>Caregiver Dashboard</h1>

    <div className="dashboard-grid">

      {/* Connect Patient */}
      <div className="dashboard-card">

        <h2>🔗 Connect Patient</h2>

        <input
          type="text"
          placeholder="Enter 6 Digit Code"
          className="input-box"
          value={enteredCode}
          onChange={(e) =>
            setEnteredCode(e.target.value)
          }
        />

        <button
          className="btn"
          onClick={connectPatient}
        >
          Connect
        </button>

        {connected && patientData && (
          <>
            <p>✅ Connected Successfully</p>

            <p>
              <strong>Patient:</strong> {patientData.name}
            </p>

            <p>
              <strong>Age:</strong> {patientData.age}
            </p>

            <p>
              <strong>Blood Group:</strong> {patientData.blood_group}
            </p>

            <p>
              <strong>Phone:</strong> {patientData.phone}
            </p>
          </>
        )}

      </div>

      {/* Patient Profile */}
      <div className="dashboard-card">

        <h2>👤 Patient Profile</h2>

        <p><strong>Name:</strong> {patientData?.name}</p>
        <p><strong>Age:</strong> {patientData?.age}</p>
        <p><strong>Blood Group:</strong> {patientData?.blood_group}</p>
        <p><strong>Phone:</strong> {patientData?.phone}</p>

      </div>

      {/* Health Monitoring */}
      <div className="dashboard-card">

        <h2>💓 Health Monitoring</h2>

        {vitals ? (
          <>
            <p>Blood Pressure : {vitals.bp}</p>
            <p>Heart Rate : {vitals.heart_rate} BPM</p>
            <p>Sugar Level : {vitals.sugar_level}</p>
            <p>Temperature : {vitals.temperature} °F</p>
          </>
        ) : (
          <p>No vitals available</p>
        )}

      </div>

      {/* Patient Status */}
      <div className="dashboard-card">

        <h2>🩺 Patient Status</h2>

        {
          vitals &&
          (
            vitals.heart_rate > 120 ||
            vitals.temperature > 101 ||
            vitals.sugar_level > 200
          ) ? (

            <>
              <h3>🔴 Emergency</h3>
              <p>Immediate medical attention required.</p>
            </>

          ) :

          vitals &&
          (
            vitals.heart_rate > 90 ||
            vitals.temperature > 99 ||
            vitals.sugar_level > 150
          ) ? (

            <>
              <h3>🟡 Needs Attention</h3>
              <p>Please monitor the patient closely.</p>
            </>

          ) : (

            <>
              <h3>🟢 Stable</h3>
              <p>Latest vitals are within the normal range.</p>
            </>

          )

        }

      </div>

      {/* Patient Contact */}
      <div className="dashboard-card">

        <h2>📞 Patient Contact</h2>

        <p><strong>Name:</strong> {patientData?.name}</p>
        <p><strong>Phone:</strong> {patientData?.phone}</p>

        <button
          className="btn"
          onClick={() => {
  if (patientData?.phone) {
    window.location.href = `tel:${patientData.phone}`;
  }
}}
        >
          Call Patient
        </button>

      </div>

      {/* Water Intake */}
      <div className="dashboard-card">

        <h2>💧 Water Intake</h2>

        <h3>{water}</h3>

        <p>Glasses Consumed Today</p>

      </div>

      {/* Medicine Status */}
      <div className="dashboard-card">

        <h2>💊 Medicine Status</h2>

        {
          medicineStatus.length === 0 ?

            <p>No medicine updates.</p>

            :

            medicineStatus.map((item) => (

              <div key={item.id}>

                <p>
                  {item.medicine_name}
                </p>

                <small>
                  Status : {item.status}
                </small>

                <hr />

              </div>

            ))
        }

      </div>
            {/* Appointments */}
      <div className="dashboard-card">

        <h2>📅 Appointments</h2>

        {
          appointments.length === 0 ?

            <p>No Appointments</p>

            :

            appointments.map((item) => (

              <div key={item.id}>

                <p>
                  <strong>Doctor:</strong> {item.doctor}
                </p>

                <small>
                  {item.date} | {item.time}
                </small>

                <hr />

              </div>

            ))
        }

      </div>

      {/* Medical Reports */}
      <div className="dashboard-card">

        <h2>📄 Medical Reports</h2>

        {
          reports.length === 0 ?

            <p>No Reports Available</p>

            :

            reports.map((item) => (

              <div key={item.id}>

                <p>{item.report_name}</p>

                <small>
                  {new Date(item.report_date).toLocaleDateString()}
                </small>

                <hr />

              </div>

            ))
        }

      </div>

      {/* Notification History */}
      <div className="dashboard-card">

        <h2>🔔 Notification History</h2>

        {
          notifications.length === 0 ?

            <p>No Notifications</p>

            :

            notifications.map((item) => (

              <div key={item.id}>

                <p>{item.message}</p>

                <small>
                  {new Date(item.created_at).toLocaleString()}
                </small>

                <hr />

              </div>

            ))
        }

      </div>
      <div
  className={`dashboard-card ${
    missedMedicines.length > 0
      ? "missed-card"
      : ""
  }`}
>

  <h2>🚨</h2>

  <h3>Missed Medicines</h3>

  {
    missedMedicines.length === 0 ? (

      <p>No missed medicines 🎉</p>

    ) : (

      missedMedicines.map((item) => (

        <div
          key={item.id}
          className="alert-box"
          style={{ marginTop: "15px" }}
        >

          <h4>💊 {item.medicine_name}</h4>

<p>
🕒 <strong>Time:</strong> {item.reminder_time}
</p>

<p
style={{
color:"#DC2626",
fontWeight:"bold"
}}
>

❌ Status : MISSED

</p>

        </div>

      ))

    )
  }

</div>

      {/* Emergency Alerts */}
      <div className="dashboard-card">

        <h2>🚨 Emergency Alerts</h2>

        {
          sosAlerts.length === 0 ?

            <p>No Active Alerts</p>

            :

            <>

              <h3>🚨 SOS Received</h3>

              <p>
                Patient requires immediate attention.
              </p>

              <small>
                {
                  new Date(
                    sosAlerts[sosAlerts.length - 1].created_at
                  ).toLocaleString("en-GB")
                }
              </small>

            </>

        }

      </div>

    </div>

    <footer className="footer">

      <p>© 2026 Senito Healthcare</p>

      <p>Care Beyond Distance ❤️</p>

    </footer>

  </div>

);

}

export default CaregiverDashboard;