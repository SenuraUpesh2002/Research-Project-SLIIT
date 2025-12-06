// src/screens/DemandDashboard.jsx
import React, { useState } from "react";
import DemandChart from "../components/DemandChart";

const mockStations = ["Station A – Malabe", "Station B – Kandy"];
const mockFuelTypes = ["All", "Petrol 92", "Petrol 95", "Diesel"];

const mockSummary = {
  week: { qty: 3450, ciLow: 3230, ciHigh: 3670, refillDate: "2025-12-13" },
  month: { qty: 14800, ciLow: 13900, ciHigh: 15700 },
  year: { qty: 173000, trend: "Increasing" }
};

const DemandDashboard = () => {
  const [station, setStation] = useState(mockStations[0]);
  const [fuelType, setFuelType] = useState("Petrol 92");
  const [horizon, setHorizon] = useState("week");
  const [granularity, setGranularity] = useState("daily");

  const weekly = mockSummary.week;
  const monthly = mockSummary.month;
  const yearly = mockSummary.year;

  return (
    <div className="page demand-dashboard" style={{ padding: "24px" }}>
      {/* Header */}
      <header
        className="page-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px"
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>Fuel Demand Prediction</h1>
          <p style={{ margin: "4px 0", color: "#555" }}>
            Upcoming weekly, monthly and annual demand per fuel type.
          </p>
        </div>
        <div
          className="user-badge"
          style={{
            padding: "6px 12px",
            borderRadius: "999px",
            background: "#EEF2FF",
            color: "#4F46E5",
            fontSize: "14px"
          }}
        >
          Station Admin
        </div>
      </header>

      {/* Filters row */}
      <section
        className="filters-row"
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr 1.2fr",
          gap: "16px",
          marginBottom: "24px"
        }}
      >
        <div className="field">
          <label style={{ display: "block", marginBottom: "4px" }}>
            Station
          </label>
          <select
            value={station}
            onChange={e => setStation(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          >
            {mockStations.map(s => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="field">
          <label style={{ display: "block", marginBottom: "4px" }}>
            Fuel type
          </label>
          <select
            value={fuelType}
            onChange={e => setFuelType(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          >
            {mockFuelTypes.map(t => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="field">
          <label style={{ display: "block", marginBottom: "4px" }}>
            Horizon
          </label>
          <div style={{ display: "flex", gap: "8px" }}>
            {["week", "month", "year"].map(h => (
              <button
                key={h}
                type="button"
                onClick={() => setHorizon(h)}
                style={{
                  flex: 1,
                  padding: "8px",
                  borderRadius: "6px",
                  border: "1px solid",
                  borderColor: horizon === h ? "#4F46E5" : "#E5E7EB",
                  background: horizon === h ? "#EEF2FF" : "#FFFFFF",
                  color: horizon === h ? "#111827" : "#4B5563",
                  cursor: "pointer"
                }}
              >
                {h === "week" ? "Week" : h === "month" ? "Month" : "Year"}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Summary cards */}
      <section
        className="summary-row"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: "16px",
          marginBottom: "24px"
        }}
      >
        <div
          className="card"
          style={{
            padding: "16px",
            borderRadius: "12px",
            border: "1px solid #E5E7EB",
            background: "#FFFFFF"
          }}
        >
          <h3 style={{ marginTop: 0 }}>Weekly Demand</h3>
          <p style={{ fontSize: "24px", fontWeight: 600 }}>
            {weekly.qty.toLocaleString()} L
          </p>
          <p style={{ margin: "4px 0" }}>
            Confidence: {weekly.ciLow} – {weekly.ciHigh} L
          </p>
          <p style={{ margin: "4px 0" }}>
            Next refill date: {weekly.refillDate}
          </p>
        </div>

        <div
          className="card"
          style={{
            padding: "16px",
            borderRadius: "12px",
            border: "1px solid #E5E7EB",
            background: "#FFFFFF"
          }}
        >
          <h3 style={{ marginTop: 0 }}>Monthly Demand</h3>
          <p style={{ fontSize: "24px", fontWeight: 600 }}>
            {monthly.qty.toLocaleString()} L
          </p>
          <p style={{ margin: "4px 0" }}>
            Confidence: {monthly.ciLow} – {monthly.ciHigh} L
          </p>
        </div>

        <div
          className="card"
          style={{
            padding: "16px",
            borderRadius: "12px",
            border: "1px solid #E5E7EB",
            background: "#FFFFFF"
          }}
        >
          <h3 style={{ marginTop: 0 }}>Annual Demand</h3>
          <p style={{ fontSize: "24px", fontWeight: 600 }}>
            {yearly.qty.toLocaleString()} L
          </p>
          <p style={{ margin: "4px 0" }}>Trend: {yearly.trend}</p>
        </div>
      </section>

      {/* Chart area */}
      <section
        className="chart-section"
        style={{
          borderRadius: "12px",
          border: "1px solid #E5E7EB",
          background: "#FFFFFF",
          padding: "16px",
          marginBottom: "24px"
        }}
      >
        <div
          className="chart-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "12px"
          }}
        >
          <h2 style={{ margin: 0, fontSize: "18px" }}>
            Historical vs Forecasted Demand
          </h2>
          <div style={{ display: "flex", gap: "8px" }}>
            {["daily", "weekly", "monthly"].map(g => (
              <button
                key={g}
                type="button"
                onClick={() => setGranularity(g)}
                style={{
                  padding: "6px 10px",
                  borderRadius: "999px",
                  border: "1px solid",
                  borderColor: granularity === g ? "#4F46E5" : "#E5E7EB",
                  background: granularity === g ? "#EEF2FF" : "#FFFFFF",
                  fontSize: "12px",
                  cursor: "pointer"
                }}
              >
                {g.charAt(0).toUpperCase() + g.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <DemandChart
          horizon={horizon}
          fuelType={fuelType}
          granularity={granularity}
        />
      </section>

      {/* Refill recommendation */}
      <section
        className="recommendation-row"
        style={{
          display: "flex",
          gap: "16px",
          alignItems: "stretch"
        }}
      >
        <div
          className="card"
          style={{
            flex: 1,
            padding: "16px",
            borderRadius: "12px",
            border: "1px solid #E5E7EB",
            background: "#FFFFFF"
          }}
        >
          <h3 style={{ marginTop: 0 }}>Refill Recommendation</h3>
          <p style={{ margin: "4px 0" }}>
            Current stock ({fuelType}): 8,200 L (41% of tank capacity).
          </p>
          <p style={{ margin: "4px 0" }}>
            Required for next{" "}
            {horizon === "week"
              ? "7 days"
              : horizon === "month"
              ? "30 days"
              : "12 months"}
            : {weekly.qty} L (approx.).
          </p>
          <p style={{ margin: "4px 0" }}>Recommended order amount: 3,000 L.</p>
        </div>

        <div
          className="actions"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            justifyContent: "flex-end"
          }}
        >
          <button
            type="button"
            className="btn primary"
            style={{
              padding: "10px 16px",
              borderRadius: "8px",
              border: "none",
              background: "#4F46E5",
              color: "#FFFFFF",
              cursor: "pointer"
            }}
            onClick={() => (window.location.href = "/auto-refill")}
          >
            Configure Auto‑Refill Alert
          </button>
          <button
            type="button"
            className="btn secondary"
            style={{
              padding: "10px 16px",
              borderRadius: "8px",
              border: "1px solid #D1D5DB",
              background: "#FFFFFF",
              color: "#111827",
              cursor: "pointer"
            }}
          >
            Download Report
          </button>
        </div>
      </section>
    </div>
  );
};

export default DemandDashboard;
