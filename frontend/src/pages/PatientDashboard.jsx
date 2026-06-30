import "./../App.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import HealthChart from "../components/HealthChart";

function PatientDashboard() {
  const navigate = useNavigate();
  const patientId = localStorage.getItem("patient_id");
  const [medicine, setMedicine] = useState("");
  const [time, setTime] = useState("");
  const [doctor, setDoctor] = useState("");
  const [date, setDate] = useState("");
  const [apptTime, setApptTime] = useState("");
  const [connectionCode, setConnectionCode] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [activeReminder, setActiveReminder] = useState(null);
  const [isReminderActive, setIsReminderActive] = useState(false);
  const [spokenReminders, setSpokenReminders] = useState([]);
  const [reportName, setReportName] = useState("");
  const [reportDate, setReportDate] = useState("");
  const [reports, setReports] = useState([]);
  const [sosAlerts, setSosAlerts] = useState([]);
  const [bp, setBp] = useState("");
  const [heartRate, setHeartRate] = useState("");
  const [sugarLevel, setSugarLevel] = useState("");
  const [temperature, setTemperature] = useState("");
  const [glasses, setGlasses] = useState("");
  const [waterTotal, setWaterTotal] = useState(0);
  const [latestVitals, setLatestVitals] = useState({});
  const [medicineStatus, setMedicineStatus] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [patient, setPatient] = useState({});

  useEffect(() => {

  async function askPermission() {

    if ("Notification" in window) {

      const permission =
        await Notification.requestPermission();

      console.log(permission);

    }

  }

  askPermission();



    fetch(`http://localhost:5000/appointments/${patientId}`)
      .then((response) => response.json())
      .then((data) => {
        const loadedAppointments = data.map((item) => ({
  id: item.id,
  doctor: item.doctor_name,
  date: item.appointment_date,
  time: item.appointment_time,
}));

        setAppointments(loadedAppointments);
      });

fetch(
  `http://localhost:5000/reminders/${localStorage.getItem("patient_id")}`
)
      .then((response) => response.json())
      .then((data) => {
        const loadedReminders = data.map((item) => ({
  id: item.id,
  medicine: item.medicine_name,
  time: item.reminder_time,
  status: item.status,
}));

        setReminders(loadedReminders);
      });
fetch(`http://localhost:5000/reports/${patientId}`)
  .then((response) => response.json())
  .then((data) => {
    setReports(data);
  });
  fetch(`http://localhost:5000/notifications/${patientId}`)
  .then((response) => response.json())
  .then((data) => {
    setNotifications(data);
  });
  fetch(`http://localhost:5000/connection-code/${patientId}`)
  .then((response) => response.json())
  .then((data) => {
    setConnectionCode(data.connection_code);
  });
  
  fetch(`http://localhost:5000/patient-details/${patientId}`)
  .then((response) => response.json())
  .then((data) => {
    setPatient(data);
  });
  fetch(`http://localhost:5000/water/${patientId}`)
.then((response)=>response.json())
.then((data)=>{
  if(data.length>0){
    setWaterTotal(data[0].total_glasses);
  }
});
fetch(`http://localhost:5000/vitals/${patientId}`)
.then((response)=>response.json())
.then((data)=>{

  if(data.length>0){
    setLatestVitals(data[data.length-1]);
  }


});
fetch(`http://localhost:5000/medicine-status/${patientId}`)
  .then((response) => response.json())
  .then((data) => {
    setMedicineStatus(data);
  });

  }, [patientId]);

  const generateCode = async () => {

  const newCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  setConnectionCode(newCode);

  try {

    const response = await fetch(
  "http://localhost:5000/update-connection-code",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
  patient_id: patientId,
  connection_code: newCode
})

      }
    );

    const result = await response.text();

    alert(result);

  }
  catch (error) {

    console.log(error);

  }

};

  const addReminder = async () => {
    if (medicine === "" || time === "") {
      alert("Please enter medicine and time");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/add-reminder",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
  patient_id: localStorage.getItem("patient_id"),
  medicine_name: medicine,
  reminder_time: time,
}),
     } );

      const result = await response.text();

      alert(result);

      fetch(
  `http://localhost:5000/reminders/${localStorage.getItem("patient_id")}`
)
  .then((response) => response.json())
  .then((data) => {
    const loadedReminders = data.map((item) => ({
  id: item.id,
  medicine: item.medicine_name,
  time: item.reminder_time,
  status: item.status,
}));

    setReminders(loadedReminders);
  });

      setMedicine("");
      setTime("");
    } catch (error) {
      console.log(error);
      alert("Failed");
    }
  };

  const deleteReminder = async (id) => {
    try {
      await fetch(
        `http://localhost:5000/delete-reminder/${id}`,
        {
          method: "DELETE",
        }
      );
    

     fetch(
  `http://localhost:5000/reminders/${localStorage.getItem("patient_id")}`
)
  .then((response) => response.json())
  .then((data) => {
    const loadedReminders = data.map((item) => ({
      id: item.id,
      medicine: item.medicine_name,
      time: item.reminder_time,
    }));

    setReminders(loadedReminders);
  });
    } catch (error) {
      console.log(error);
    }
  };
  const deleteAppointment = async (id) => {
  try {
    await fetch(
      `http://localhost:5000/delete-appointment/${id}`,
      {
        method: "DELETE",
      }
    );

    fetch(`http://localhost:5000/appointments/${patientId}`)
  .then((response) => response.json())
  .then((data) => {
    const loadedAppointments = data.map((item) => ({
      id: item.id,
      doctor: item.doctor_name,
      date: item.appointment_date,
      time: item.appointment_time,
    }));

    setAppointments(loadedAppointments);
  });
  } catch (error) {
    console.log(error);
  }
};
const addReport = async () => {
  if (reportName === "" || reportDate === "") {
    alert("Fill all fields");
    return;
  }

  try {
    const response = await fetch(
      "http://localhost:5000/add-report",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
       body: JSON.stringify({
  patient_id: localStorage.getItem("patient_id"),
  report_name: reportName,
  report_date: reportDate,
}),
      }
    );

    const result = await response.text();

    alert(result);

    fetch(`http://localhost:5000/reports/${patientId}`)
      .then((response) => response.json())
      .then((data) => {
        setReports(data);
      });
      fetch(`http://localhost:5000/sos-alerts/${patientId}`)
  .then((response) => response.json())
  .then((data) => {
    setSosAlerts(data);
  });

    setReportName("");
    setReportDate("");
  } catch (error) {
    console.log(error);
  }
};
const deleteReport = async (id) => {
  try {
    await fetch(
      `http://localhost:5000/delete-report/${id}`,
      {
        method: "DELETE",
      }
    );

    fetch(`http://localhost:5000/reports/${patientId}`)
      .then((response) => response.json())
      .then((data) => {
        setReports(data);
      });
  } catch (error) {
    console.log(error);
  }
};
const sendSOS = async () => {
  try {
    const response = await fetch(
  "http://localhost:5000/send-sos",
  {
    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({
      patient_id: patientId
    })
  }
);

    const result = await response.text();

    alert(result);

    fetch(`http://localhost:5000/sos-alerts/${patientId}`)
  .then((response) => response.json())
  .then((data) => {
    setSosAlerts(data);
    fetch(`http://localhost:5000/notifications/${patientId}`)
  .then((response) => response.json())
  .then((data) => {
    setNotifications(data);
  });
  });

  } catch (error) {
    console.log(error);
  }
};
const clearSOS = async () => {
  try {
    await fetch(
  `http://localhost:5000/clear-sos/${patientId}`,
      {
        method: "DELETE",
      }
    );

    setSosAlerts([]);
  } catch (error) {
    console.log(error);
  }
};
const addVitals = async () => {
  if (
    bp === "" ||
    heartRate === "" ||
    sugarLevel === "" ||
    temperature === ""
  ) {
    alert("Fill all fields");
    return;
  }

  try {
    const response = await fetch(
      "http://localhost:5000/add-vitals",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
  patient_id: localStorage.getItem("patient_id"),
  bp,
  heart_rate: heartRate,
  sugar_level: sugarLevel,
  temperature,
}),
      }
    );

    const result = await response.text();

    alert(result);
    fetch(`http://localhost:5000/vitals/${patientId}`)
  .then((response) => response.json())
  .then((data) => {

    if (data.length > 0) {
      setLatestVitals(data[data.length - 1]);
    }

  });
    setBp("");
    setHeartRate("");
    setSugarLevel("");
    setTemperature("");
  } catch (error) {
    console.log(error);
  }
};
const addWater = async () => {
  if (glasses === "") {
    alert("Enter number of glasses");
    return;
  }

  try {
    const response = await fetch(
      "http://localhost:5000/add-water",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
  patient_id: localStorage.getItem("patient_id"),
  glasses,
}),
      }
    );

    const result = await response.text();

    alert(result);
    fetch(`http://localhost:5000/water/${patientId}`)
  .then((response) => response.json())
  .then((data) => {

    if (data.length > 0) {
      setWaterTotal(data[0].total_glasses);
    }

  });
    setGlasses("");
  } catch (error) {
    console.log(error);
  }
};
const updateMedicineStatus = async (
  reminderId,
  medicineName,
  status
) => {
  try {
    const response = await fetch(
      "http://localhost:5000/update-medicine-status",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
  patient_id: localStorage.getItem("patient_id"),
  reminder_id: reminderId,
  medicine_name: medicineName,
  status,
}),
      }
    );

    const result = await response.text();

    alert(result);
    fetch(`http://localhost:5000/notifications/${patientId}`)
  .then((response) => response.json())
  .then((data) => {
    setNotifications(data);
  });

    fetch(`http://localhost:5000/medicine-status/${patientId}`)
  .then((response) => response.json())
  .then((data) => {
    setMedicineStatus(data);
  });

  fetch(`http://localhost:5000/reminders/${patientId}`)
  .then((response) => response.json())
  .then((data) => {

    const loadedReminders = data.map((item) => ({
      id: item.id,
      medicine: item.medicine_name,
      time: item.reminder_time,
      status: item.status,
    }));

    setReminders(loadedReminders);

  });

  } catch (error) {
    console.log(error);
  }
};
  const bookAppointment = async () => {
    if (
      doctor === "" ||
      date === "" ||
      apptTime === ""
    ) {
      alert("Fill all fields");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/add-appointment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
  patient_id: patientId,
  doctor_name: doctor,
  appointment_date: date,
  appointment_time: apptTime,
}),
        }
      );

      const result = await response.text();

      alert(result);
      fetch(`http://localhost:5000/notifications/${patientId}`)
  .then((response) => response.json())
  .then((data) => {
    setNotifications(data);
  });
  fetch(`http://localhost:5000/appointments/${patientId}`)
  .then((response) => response.json())
  .then((data) => {
    const loadedAppointments = data.map((item) => ({
      id: item.id,
      doctor: item.doctor_name,
      date: item.appointment_date,
      time: item.appointment_time,
    }));

    setAppointments(loadedAppointments);
  });

      setDoctor("");
      setDate("");
      setApptTime("");
    } catch (error) {
      console.log(error);
      alert("Failed");
    }
  };

  useEffect(() => {

  const interval = setInterval(() => {

    const now = new Date();

    const currentTime =
      now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      });

    reminders.forEach((item) => {

      if (
        item.time === currentTime &&
        !spokenReminders.includes(item.id) &&
        !item.status
      ) {

        if ("speechSynthesis" in window) {

          const speech =
            new SpeechSynthesisUtterance(
              `Attention. It is time to take your medicine ${item.medicine}`
            );

          speech.lang = "en-US";

          window.speechSynthesis.speak(speech);
          setActiveReminder(item);
          setIsReminderActive(true);
          setTimeout(() => {

  if (activeReminder !== null) {

    updateMedicineStatus(
      item.id,
      item.medicine,
      "Missed"
    );

    setActiveReminder(null);

    if ("speechSynthesis" in window) {

      const speech = new SpeechSynthesisUtterance(
        `${item.medicine} was missed. Caregiver has been notified.`
      );

      speech.lang = "en-US";

      window.speechSynthesis.speak(speech);

    }

  }

}, 60000);
        }
        if (Notification.permission === "granted") {

  new Notification(
    "💊 Senito Healthcare",
    {
      body:
        `Time to take your medicine: ${item.medicine}`,
      icon: "/healthcare.png"
    }
  );

}

        setSpokenReminders(prev => [
          ...prev,
          item.id
        ]);

      }

    });

  }, 1000);

  return () => clearInterval(interval);

}, [reminders, spokenReminders]);
    return (
    <div className="container">
      {activeReminder && (

<div className="medicine-popup-overlay">

<div className="medicine-popup">

<h2>🚨 Medicine Reminder</h2>

<h3>{activeReminder.medicine}</h3>

<p>

Please take your medicine now.

</p>

<div className="popup-buttons">

<button
className="btn"
onClick={() => {

updateMedicineStatus(
  activeReminder.id,
  activeReminder.medicine,
  "Taken"
);

setActiveReminder(null);
setIsReminderActive(false);

}}
>

✅ Taken

</button>

<button
className="btn"
onClick={() => {

const medicine = activeReminder;

setActiveReminder(null);
setIsReminderActive(false);

setTimeout(() => {

setActiveReminder(medicine);

if ("speechSynthesis" in window) {

const speech = new SpeechSynthesisUtterance(
`Reminder. Please take your medicine ${medicine.medicine}`
);

speech.lang = "en-US";

window.speechSynthesis.speak(speech);

}

if (Notification.permission === "granted") {

new Notification(
"💊 Senito Healthcare",
{
body: `Please take your medicine: ${medicine.medicine}`,
icon: "/healthcare.png"
}
);

}

}, 5 * 60 * 1000);

}}

>

⏰ Remind Me Later

</button>

</div>

</div>

</div>

)}
      <div className="navbar">
        <h2>Senito Healthcare</h2>

        <button
          className="btn"
          onClick={() => {

  localStorage.removeItem("patient_id");

  navigate("/");

}}
        >
          Logout
        </button>
      </div>

      <div className="header-card">
  <h1>👋 Welcome, {patient.name}</h1>
  <p>Care Beyond Distance ❤️</p>
</div>
<div className="stats-grid">

  <div className="stats-card blue">
    <h2>{reminders.length}</h2>
    <p>💊 Medicines</p>
  </div>

  <div className="stats-card green">
    <h2>{appointments.length}</h2>
    <p>📅 Appointments</p>
  </div>

  <div className="stats-card red">
  <h2>{latestVitals.heart_rate || 0}</h2>
  <p>❤️ Heart Rate</p>
</div>
<div className="stats-card cyan">
  <h2>{waterTotal || 0}</h2>
  <p>💧 Water</p>
</div>

</div>

 

   <div className="dashboard-card profile-card">

  <div className="profile-left">

    <div className="profile-avatar">
      {patient.name?.charAt(0).toUpperCase()}
    </div>

    <h3>{patient.name}</h3>

  </div>

  <div className="profile-right">

    <h2>👤 Patient Profile</h2>

    <p><strong>Age:</strong> {patient.age}</p>

    <p><strong>Blood Group:</strong> {patient.blood_group}</p>

    <p><strong>Phone:</strong> {patient.phone}</p>

  </div>

</div>
<div style={{ marginBottom: "40px" }}></div>
      <div className="dashboard-grid">

        <div className="dashboard-card">
          <h2>🔗</h2>
          <h3>Connection Code</h3>

          <div className="connection-code">
  {connectionCode}
</div>

          <button
            className="btn"
            onClick={generateCode}
          >
            Generate New Code
          </button>
        </div>

        <div
  className={`dashboard-card medicine-card ${
    isReminderActive ? "medicine-alert" : ""
  }`}
>
          <h2>💊</h2>
          <h3>Medicine Reminders</h3>

          <input
            type="text"
            placeholder="Medicine Name"
            className="input-box"
            value={medicine}
            onChange={(e) => setMedicine(e.target.value)}
          />

          <input
            type="time"
            className="input-box"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />

          <button
            className="btn"
            onClick={addReminder}
          >
            Add Reminder
          </button>

          {reminders.map((item) => (
  <div key={item.id}>
    <p>
      {item.medicine} - {item.time}
    </p>
<div className="button-row">

  <button
  className="btn"
  disabled={!!item.status }
  style={{
    backgroundColor:
      item.status === "Taken"
        ? "gray"
        : "#2563EB"
  }}
  onClick={() =>
    updateMedicineStatus(
      item.id,
      item.medicine,
      "Taken"
    )
  }
>
  Taken
</button>

  <button
  className="btn"
  disabled={!!item.status}
  style={{
    backgroundColor:
      item.status === "Missed"
        ? "gray"
        : "#2563EB"
  }}
  onClick={() =>
    updateMedicineStatus(
      item.id,
      item.medicine,
      "Missed"
    )
  }
>
  Missed
</button>
  <button
    className="btn"
    onClick={() => deleteReminder(item.id)}
  >
    Delete
  </button>

</div>
   
     </div>
     ))}
        </div>

        <div className="dashboard-card appointment-card">
          <h2>📅</h2>
          <h3>Book Appointment</h3>

          <input
            type="text"
            placeholder="Doctor Name"
            className="input-box"
            value={doctor}
            onChange={(e) => setDoctor(e.target.value)}
          />

          <input
            type="date"
            className="input-box"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <input
            type="time"
            className="input-box"
            value={apptTime}
            onChange={(e) => setApptTime(e.target.value)}
          />

          <button
            className="btn"
            onClick={bookAppointment}
          >
            Book
          </button>

          {appointments.map((item) => (
         <div key={item.id} className="report-item">

  <p>
    {item.doctor} - {item.date} - {item.time}
  </p>

  <div className="button-row">

    <button
      className="btn"
      onClick={() => deleteAppointment(item.id)}
    >
      Delete
    </button>

  </div>

</div>
))}
        </div>

      <div className="dashboard-card vitals-card">
  <h2>💓</h2>
  <h3>Health Vitals</h3>

  <input
    type="text"
    placeholder="Blood Pressure"
    className="input-box"
    value={bp}
    onChange={(e) => setBp(e.target.value)}
  />

  <input
    type="number"
    placeholder="Heart Rate"
    className="input-box"
    value={heartRate}
    onChange={(e) => setHeartRate(e.target.value)}
  />

  <input
    type="text"
    placeholder="Sugar Level"
    className="input-box"
    value={sugarLevel}
    onChange={(e) => setSugarLevel(e.target.value)}
  />

  <input
    type="number"
    placeholder="Temperature"
    className="input-box"
    value={temperature}
    onChange={(e) => setTemperature(e.target.value)}
  />

  <button
    className="btn"
    onClick={addVitals}
  >
    Save Vitals
  </button>
</div>  
  <div className="dashboard-card water-card">
  <h2>💧</h2>
  <h3>Water Intake</h3>

  <input
    type="number"
    placeholder="Number of glasses"
    className="input-box"
    value={glasses}
    onChange={(e) => setGlasses(e.target.value)}
  />

  <button
    className="btn"
    onClick={addWater}
  >
    Save Water Intake
  </button>
</div>


<div className="dashboard-card">
  <h2>📊</h2>
  <h3>Health Charts</h3>

  <HealthChart />
</div>

        <div className="dashboard-card report-card">
  <h2>📄</h2>
  <h3>Medical Reports</h3>

  <input
    type="text"
    placeholder="Report Name"
    className="input-box"
    value={reportName}
    onChange={(e) => setReportName(e.target.value)}
  />

  <input
    type="date"
    className="input-box"
    value={reportDate}
    onChange={(e) => setReportDate(e.target.value)}
  />

  <button
    className="btn"
    onClick={addReport}
  >
    Add Report
  </button>

  {reports.map((item) => (
  <div className="report-item" key={item.id}>
    <h4>📄 {item.report_name}</h4>

    <p>
      📅 {new Date(item.report_date).toLocaleDateString()}
    </p>

    <button
      className="btn"
      onClick={() => deleteReport(item.id)}
    >
      Delete
    </button>
  </div>
))}
</div>

        <div className="dashboard-card">
          <h2>🚨</h2>
          <h3>Emergency Contact</h3>

          <p>Caregiver: John</p>
          <p>+91 9876543210</p>
        </div>
        <div className="dashboard-card">
  <h2>🔔</h2>
  <h3>Notification History</h3>

  {notifications.length === 0 ? (
  <p>No Notifications</p>
) : (
  notifications.map((item) => (
    <div className="notification-card" key={item.id}>
      <h4>🔔 {item.message}</h4>

      <small>
        {new Date(item.created_at).toLocaleString()}
      </small>
    </div>
  ))
)}

</div>
     
    <div className="dashboard-card">

  <h2>🚨 Emergency SOS</h2>

  <div className="button-row">

    <button
      className="btn sos-btn"
      onClick={sendSOS}
    >
      Send SOS Alert
    </button>

    <button
      className="btn"
      onClick={clearSOS}
    >
      Clear Alert
    </button>

  </div>

  {sosAlerts.length > 0 && (
    <div className="alert-box">
      🚨 {sosAlerts[sosAlerts.length - 1].message}
    </div>
  )}

</div>

      </div>

      <footer className="footer">
        <p>© 2026 Senito Healthcare</p>
        <p>Care Beyond Distance ❤️</p>
      </footer>
    </div>
  );
}

export default PatientDashboard;

