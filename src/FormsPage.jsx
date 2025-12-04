import React, { useState, useEffect } from "react";

const API = "http://localhost:5000/api/basic-info";

export default function FormsPage() {
  const [data, setData] = useState([]);
  const [mode, setMode] = useState(""); // completed / inprogress

  useEffect(() => {
    fetch(API)
      .then(res => res.json())
      .then(setData)
      .catch(err => console.log(err));
  }, []);

  const filteredData = () => {
    if (mode === "completed") {
      return data.filter(f => f.Status === "complete");
    } else if (mode === "inprogress") {
      return data.filter(f => f.Status === "draft");
    }
    return [];
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Saved Forms</h1>

      {/* TWO BUTTONS */}
      <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
        <button
          onClick={() => setMode("completed")}
          style={{ padding: 12, background: "#22c55e", color: "#fff", borderRadius: 6 }}
        >
          Completed Forms
        </button>

        <button
          onClick={() => setMode("inprogress")}
          style={{ padding: 12, background: "#facc15", color: "#000", borderRadius: 6 }}
        >
          InProgress Forms
        </button>
      </div>

      {/* LIST */}
      <div style={{ marginTop: 20 }}>
        {filteredData().map((item) => (
          <div
            key={item.ID}
            onClick={() => (window.location.href = `/form/${item.ID}`)}
            style={{
              padding: 12,
              border: "1px solid #ddd",
              borderRadius: 6,
              marginBottom: 10,
              cursor: "pointer",
              background: "#f1f5f9"
            }}
          >
            <div><strong>ID:</strong> {item.ID}</div>
            <div><strong>Status:</strong> {item.Status}</div>
            <div><strong>Saved At:</strong> {item.Timestamp}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
