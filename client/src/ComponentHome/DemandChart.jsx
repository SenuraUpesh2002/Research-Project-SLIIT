// src/components/DemandChart.jsx
import React from "react";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  TimeScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";
import "chartjs-adapter-date-fns";
import { Line } from "react-chartjs-2";

ChartJS.register(LineElement, PointElement, TimeScale, LinearScale, Tooltip, Legend);

const DemandChart = ({ horizon, fuelType, granularity }) => {
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;

  // simple dummy data; replace with real API data
  const history = Array.from({ length: 14 }).map((_, i) => ({
    x: new Date(now - (14 - i) * oneDay),
    y: 500 + i * 40
  }));

  const forecast = Array.from({ length: 7 }).map((_, i) => ({
    x: new Date(now + i * oneDay),
    y: 1100 + i * 50
  }));

  const data = {
    datasets: [
      {
        label: "Historical demand",
        data: history,
        borderColor: "#4F46E5",
        backgroundColor: "rgba(79,70,229,0.1)",
        tension: 0.3,
        pointRadius: 2
      },
      {
        label: "Forecast",
        data: forecast,
        borderColor: "#F97316",
        borderDash: [6, 4],
        tension: 0.3,
        pointRadius: 2
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: { position: "top" },
      tooltip: { enabled: true }
    },
    scales: {
      x: {
        type: "time",
        time: {
          unit:
            granularity === "daily"
              ? "day"
              : granularity === "weekly"
              ? "week"
              : "month"
        },
        title: { display: true, text: "Date" }
      },
      y: {
        title: { display: true, text: "Liters" }
      }
    }
  };

  return (
    <div style={{ height: "320px" }}>
      <Line data={data} options={options} />
      <p style={{ marginTop: "8px", fontSize: "12px", color: "#6B7280" }}>
        Showing {granularity} demand for {fuelType} ({horizon} horizon, sample
        data).
      </p>
    </div>
  );
};

export default DemandChart;
