const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root@123",
  database: "senito_db",
});

db.connect((err) => {
  if (err) {
    console.log("Database Connection Failed");
    console.log(err);
  } else {
    console.log("MySQL Connected");
  }
});

// Test Route
app.get("/", (req, res) => {
  res.send("Senito Backend Running");
});

// Patient Registration
app.post("/register-patient", (req, res) => {

  const {
    name,
    email,
    password,
    age,
    blood_group,
    phone,
    connection_code,
  } = req.body;

  const sql =
    "INSERT INTO patients (name,email,password,age,blood_group,phone,connection_code) VALUES (?,?,?,?,?,?,?)";

  db.query(
    sql,
    [
      name,
      email,
      password,
      age,
      blood_group,
      phone,
      connection_code,
    ],
    (err, result) => {

      if (err) {
        console.log(err);
        res.send("Error");
      }
      else {
        res.send("Patient Registered");
      }

    }
  );

});

// Caregiver Registration
app.post("/register-caregiver", (req, res) => {

  const {
    name,
    email,
    password
  } = req.body;

  const sql =
    "INSERT INTO caregivers (name,email,password) VALUES (?,?,?)";

  db.query(
    sql,
    [name, email, password],
    (err, result) => {

      if (err) {
        console.log(err);
        res.send("Error");
      }
      else {
        res.send("Caregiver Registered");
      }

    }
  );

});

// Patient Login
app.post("/patient-login", (req, res) => {

  const { email, password } = req.body;

  const sql =
    "SELECT * FROM patients WHERE email=? AND password=?";

  db.query(
    sql,
    [email, password],
    (err, result) => {

      if (err) {
        console.log(err);
        res.send("Error");
      }
      else if (result.length > 0) {

        res.json({
          message: "Login Successful",
          patient_id: result[0].id
        });

      }
      else {
        res.send("Invalid Credentials");
      }

    }
  );

});

// Caregiver Login
app.post("/caregiver-login", (req, res) => {

  const { email, password } = req.body;

  const sql =
    "SELECT * FROM caregivers WHERE email=? AND password=?";

  db.query(
    sql,
    [email, password],
    (err, result) => {

      if (err) {
        console.log(err);
        res.send("Error");
      }
      else if (result.length > 0) {
        res.send("Login Successful");
      }
      else {
        res.send("Invalid Credentials");
      }

    }
  );

});

// Caregiver Connect Patient
app.post("/connect-patient", (req, res) => {

  const { connection_code } = req.body;

  const sql =
    "SELECT * FROM patients WHERE connection_code=?";

  db.query(
    sql,
    [connection_code],
    (err, result) => {

      if (err) {
        console.log(err);
        res.send("Error");
      }
      else if (result.length > 0) {
        res.json(result[0]);
      }
      else {
        res.send("Invalid Code");
      }

    }
  );

});

// Add Reminder
app.post("/add-reminder", (req, res) => {

  const {
    patient_id,
    medicine_name,
    reminder_time
  } = req.body;

  const sql =
    "INSERT INTO reminders(patient_id, medicine_name, reminder_time) VALUES (?,?,?)";

  db.query(
    sql,
    [patient_id, medicine_name, reminder_time],
    (err, result) => {

      if (err) {
        console.log(err);
        res.send("Error");
      }
      else {
        res.send("Reminder Added");
      }

    }
  );

});

// Get Reminders
app.get("/reminders/:id", (req, res) => {

  const patient_id = req.params.id;

  const sql =
    "SELECT * FROM reminders WHERE patient_id=?";

  db.query(
    sql,
    [patient_id],
    (err, result) => {

      if (err) {
        console.log(err);
        res.send("Error");
      }
      else {
        res.json(result);
      }

    }
  );

});

// Delete Reminder
app.delete("/delete-reminder/:id", (req, res) => {

  const id = req.params.id;

  const sql =
    "DELETE FROM reminders WHERE id=?";

  db.query(
    sql,
    [id],
    (err, result) => {

      if (err) {
        console.log(err);
        res.send("Error");
      }
      else {
        res.send("Reminder Deleted");
      }

    }
  );

});
// Add Appointment
app.post("/add-appointment", (req, res) => {

  console.log(req.body);

  const {
    patient_id,
    doctor_name,
    appointment_date,
    appointment_time,
  } = req.body;

  const sql =
    "INSERT INTO appointments(patient_id, doctor_name, appointment_date, appointment_time) VALUES (?,?,?,?)";

  db.query(
    sql,
    [patient_id, doctor_name, appointment_date, appointment_time],
    (err, result) => {

      if (err) {
        console.log(err);
        res.send("Error");
      }
      else {

        const notificationSql =
          "INSERT INTO notifications(patient_id, message) VALUES (?,?)";

        db.query(
          notificationSql,
          [patient_id, `📅 Appointment with ${doctor_name} booked`],
          (err2) => {
            if (err2) console.log(err2);
          }
        );

        res.send("Appointment Added");

      }

    }
  );

});

// Get Appointments
app.get("/appointments/:id", (req, res) => {

  const patient_id = req.params.id;

  const sql =
    "SELECT * FROM appointments WHERE patient_id=?";

  db.query(
    sql,
    [patient_id],
    (err, result) => {

      if (err) {
        console.log(err);
        res.send("Error");
      }
      else {
        res.json(result);
      }

    }
  );

});

// Delete Appointment
app.delete("/delete-appointment/:id", (req, res) => {

  const id = req.params.id;

  const sql =
    "DELETE FROM appointments WHERE id=?";

  db.query(
    sql,
    [id],
    (err, result) => {

      if (err) {
        console.log(err);
        res.send("Error");
      }
      else {
        res.send("Appointment Deleted");
      }

    }
  );

});

// Add Report
app.post("/add-report", (req, res) => {

  const {
    patient_id,
    report_name,
    report_date
  } = req.body;

  const sql =
    "INSERT INTO reports(patient_id, report_name, report_date) VALUES (?,?,?)";

  db.query(
    sql,
    [patient_id, report_name, report_date],
    (err, result) => {

      if (err) {
        console.log(err);
        res.send("Error");
      }
      else {
        res.send("Report Added");
      }

    }
  );

});

// Get Reports
app.get("/reports/:id", (req, res) => {

  const patient_id = req.params.id;

  const sql =
    "SELECT * FROM reports WHERE patient_id=?";

  db.query(
    sql,
    [patient_id],
    (err, result) => {

      if (err) {
        console.log(err);
        res.send("Error");
      }
      else {
        res.json(result);
      }

    }
  );

});

// Delete Report
app.delete("/delete-report/:id", (req, res) => {

  const id = req.params.id;

  const sql =
    "DELETE FROM reports WHERE id=?";

  db.query(
    sql,
    [id],
    (err, result) => {

      if (err) {
        console.log(err);
        res.send("Error");
      }
      else {
        res.send("Report Deleted");
      }

    }
  );

});

// Send SOS
app.post("/send-sos", (req, res) => {

  const { patient_id } = req.body;

  const sql =
    "INSERT INTO sos_alerts(patient_id, message) VALUES (?,?)";

  db.query(
    sql,
    [patient_id, "🚨 Emergency Alert Sent"],
    (err, result) => {

      if (err) {
        console.log(err);
        res.send("Error");
      }
      else {

        const notificationSql =
          "INSERT INTO notifications(patient_id, message) VALUES (?,?)";

        db.query(
          notificationSql,
          [patient_id, "🚨 SOS Alert Sent"],
          (err2) => {
            if (err2) console.log(err2);
          }
        );

        res.send("SOS Sent");

      }

    }
  );

});

// Get SOS Alerts
app.get("/sos-alerts/:id", (req, res) => {

  const patient_id = req.params.id;

  const sql =
    "SELECT * FROM sos_alerts WHERE patient_id=?";

  db.query(
    sql,
    [patient_id],
    (err, result) => {

      if (err) {
        console.log(err);
        res.send("Error");
      }
      else {
        res.json(result);
      }

    }
  );

});

// Clear SOS
app.delete("/clear-sos/:id", (req, res) => {

  const patient_id = req.params.id;

  const sql =
    "DELETE FROM sos_alerts WHERE patient_id=?";

  db.query(
    sql,
    [patient_id],
    (err, result) => {

      if (err) {
        console.log(err);
        res.send("Error");
      }
      else {
        res.send("SOS Cleared");
      }

    }
  );

});
// Add Vitals
app.post("/add-vitals", (req, res) => {

  const {
    patient_id,
    bp,
    heart_rate,
    sugar_level,
    temperature
  } = req.body;

  const sql =
    "INSERT INTO health_vitals(patient_id,bp,heart_rate,sugar_level,temperature) VALUES (?,?,?,?,?)";

  db.query(
    sql,
    [
      patient_id,
      bp,
      heart_rate,
      sugar_level,
      temperature
    ],
    (err, result) => {

      if (err) {
        console.log(err);
        res.send("Error");
      }
      else {
        res.send("Vitals Added");
      }

    }
  );

});

// Get Vitals
app.get("/vitals/:id", (req, res) => {

  const patient_id = req.params.id;

  const sql =
    "SELECT * FROM health_vitals WHERE patient_id=? ORDER BY id ASC";

  db.query(
    sql,
    [patient_id],
    (err, result) => {

      if (err) {
        console.log(err);
        res.send("Error");
      }
      else {
        res.json(result);
      }

    }
  );

});

// Add Water
app.post("/add-water", (req, res) => {

  const {
    patient_id,
    glasses
  } = req.body;

  const sql =
    "INSERT INTO water_intake(patient_id,glasses) VALUES (?,?)";

  db.query(
    sql,
    [patient_id, glasses],
    (err, result) => {

      if (err) {
        console.log(err);
        res.send("Error");
      }
      else {
        res.send("Water Intake Saved");
      }

    }
  );

});

// Get Water
app.get("/water/:id", (req, res) => {

  const patient_id = req.params.id;

  const sql =
    "SELECT SUM(glasses) AS total_glasses FROM water_intake WHERE patient_id=?";

  db.query(
    sql,
    [patient_id],
    (err, result) => {

      if (err) {
        console.log(err);
        res.send("Error");
      }
      else {
        res.json(result);
      }

    }
  );

});

// Update Medicine Status
app.post("/update-medicine-status", (req, res) => {

  const {
  patient_id,
  reminder_id,
  medicine_name,
  status
} = req.body;

  const sql =
    "INSERT INTO medication_adherence(patient_id, medicine_name, status, taken_date) VALUES (?,?,?,CURDATE())";

  db.query(
    sql,
    [patient_id, medicine_name, status],
    (err, result) => {

      if (err) {
        console.log(err);
        res.send("Error");
      }
      else {

        const notificationSql =
          "INSERT INTO notifications(patient_id, message) VALUES (?,?)";

        db.query(
  notificationSql,
  [patient_id, `💊 ${medicine_name} ${status}`],
  (err2) => {
    if (err2) console.log(err2);
  }
);

const reminderSql =
  "UPDATE reminders SET status=? WHERE id=?";

db.query(
  reminderSql,
  [status, reminder_id],
  (err3) => {
    if (err3) {
      console.log(err3);
    }
  }
);

res.send("Medicine Updated");

      }

    }
  );

});

// Get Medicine Status
app.get("/medicine-status/:id", (req, res) => {

  const patient_id = req.params.id;

  const sql =
    "SELECT * FROM medication_adherence WHERE patient_id=? ORDER BY id DESC";

  db.query(
    sql,
    [patient_id],
    (err, result) => {

      if (err) {
        console.log(err);
        res.send("Error");
      }
      else {
        res.json(result);
      }

    }
  );

});

// Get Notifications
app.get("/notifications/:id", (req, res) => {

  const patient_id = req.params.id;

  const sql =
    "SELECT * FROM notifications WHERE patient_id=? ORDER BY created_at DESC";

  db.query(
    sql,
    [patient_id],
    (err, result) => {

      if (err) {
        console.log(err);
        res.send("Error");
      }
      else {
        res.json(result);
      }

    }
  );

});

// Get Connection Code
app.get("/connection-code/:id", (req, res) => {

  const patient_id = req.params.id;

  const sql =
    "SELECT connection_code FROM patients WHERE id=?";

  db.query(
    sql,
    [patient_id],
    (err, result) => {

      if (err) {
        console.log(err);
        res.send("Error");
      }
      else {
        res.json(result[0]);
      }

    }
  );

});

// Update Connection Code
app.post("/update-connection-code", (req, res) => {

  const {
    patient_id,
    connection_code
  } = req.body;

  const sql =
    "UPDATE patients SET connection_code=? WHERE id=?";

  db.query(
    sql,
    [connection_code, patient_id],
    (err, result) => {

      if (err) {
        console.log(err);
        res.send("Error");
      }
      else {
        res.send("Code Updated");
      }

    }
  );

});

// Patient Details
app.get("/patient-details/:id", (req, res) => {

  const patient_id = req.params.id;

  const sql =
    "SELECT name, age, blood_group, phone FROM patients WHERE id=?";

  db.query(
    sql,
    [patient_id],
    (err, result) => {

      if (err) {
        console.log(err);
        res.send("Error");
      }
      else {
        res.json(result[0]);
      }

    }
  );

});

// Server Start
app.listen(5000, () => {
  console.log("Server running on port 5000");
});