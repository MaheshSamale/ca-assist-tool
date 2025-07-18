import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Deadline.css";

export default function UpcomingDeadlines() {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5001/api/deadlines", {
        headers: { Authorization: localStorage.getItem("token") },
      })
      .then((res) => setClients(res.data))
      .catch((err) => console.error("Error fetching deadlines:", err));
  }, []);

  const getDeadlineClass = (date) => {
    const today = new Date();
    const deadline = new Date(date);
    const daysLeft = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));

    if (daysLeft <= 3) return "deadline-red";
    if (daysLeft <= 7) return "deadline-yellow";
    return "deadline-green";
  };

  return (
    <div className="deadline-wrapper">
      <div className="deadline-card">
        <h2>Upcoming Deadlines</h2>

        <div className="table-container">
          <table className="deadline-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>PAN</th>
                <th>GSTIN</th>
                <th>Next Deadline</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client._id}>
                  <td>{client.name}</td>
                  <td>{client.pan}</td>
                  <td>{client.gstin}</td>
                  <td className={getDeadlineClass(client.nextDeadline)}>
                    {new Date(client.nextDeadline).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {clients.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center", padding: "20px", color: "#777" }}>
                    No deadlines found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
