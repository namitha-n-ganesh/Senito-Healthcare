import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

import { Line } from "react-chartjs-2";
import { useState, useEffect } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function HealthChart() {
  const [vitals, setVitals] = useState([]);

  useEffect(() => {

    const patientId = localStorage.getItem("patient_id");

    if (!patientId) return;

    fetch(`http://localhost:5000/vitals/${patientId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setVitals(data);
      })
      .catch((error) => {
        console.log(error);
      });

  }, []);

  const labels = vitals.map(
    (item, index) => `Record ${index + 1}`
  );

  const chart1Data = {
    labels,
    datasets: [
      {
        label: "Heart Rate",
        data: vitals.map(
          (item) => Number(item.heart_rate)
        ),
        borderColor: "red",
        backgroundColor: "red",
        tension: 0.4
      },
      {
        label: "Temperature",
        data: vitals.map(
          (item) => Number(item.temperature)
        ),
        borderColor: "blue",
        backgroundColor: "blue",
        tension: 0.4
      }
    ]
  };

  const chart2Data = {
    labels,
    datasets: [
      {
        label: "Sugar Level",
        data: vitals.map(
          (item) => Number(item.sugar_level)
        ),
        borderColor: "green",
        backgroundColor: "green",
        tension: 0.4
      },
      {
        label: "Blood Pressure",
        data: vitals.map(
          (item) => Number(item.bp)
        ),
        borderColor: "orange",
        backgroundColor: "orange",
        tension: 0.4
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top"
      }
    }
  };

  return (
    <div>

      <h3>Heart Rate & Temperature</h3>

      <Line
        data={chart1Data}
        options={options}
      />

      <br />

      <h3>Sugar Level & Blood Pressure</h3>

      <Line
        data={chart2Data}
        options={options}
      />

    </div>
  );
}

export default HealthChart;