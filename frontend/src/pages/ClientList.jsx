import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "../styles/ClientList.css";

export default function ClientList() {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5001/api/clients", {
        headers: { Authorization: localStorage.getItem("token") },
      })
      .then((res) => setClients(res.data))
      .catch((err) => console.error("Error loading clients", err));
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      try {
        await axios.delete(`http://localhost:5001/api/clients/${id}`, {
          headers: { Authorization: localStorage.getItem("token") },
        });
        setClients((prev) => prev.filter((c) => c._id !== id));
      } catch (err) {
        alert("Failed to delete. Check console.");
        console.error(err);
      }
    }
  };

  const exportToExcel = () => {
    const data = clients.map((client) => ({
      Name: client.name,
      PAN: client.pan,
      GSTIN: client.gstin,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Clients");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), "clients.xlsx");
  };

  const filteredClients = clients.filter((client) => {
    const q = search.toLowerCase();
    return (
      client.name?.toLowerCase().includes(q) ||
      client.pan?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="client-wrapper">
      <div className="client-card">
        <h2>Client List</h2>

        <input
          type="text"
          className="search-input"
          placeholder="Search by name or PAN"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="action-buttons">
          <button className="button" onClick={exportToExcel}>Export to Excel</button>
          <Link to="/add" className="button">Add Client</Link>
        </div>

        <div className="table-containerc">
          <table className="client-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>PAN</th>
                <th>GSTIN</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.length > 0 ? (
                filteredClients.map((client) => (
                  <tr key={client._id}>
                    <td>{client.name}</td>
                    <td>{client.pan}</td>
                    <td>{client.gstin}</td>
                    <td>
                      <Link to={`/edit/${client._id}`} className="edit-link">Edit</Link>
                      <button className="delete-btn" onClick={() => handleDelete(client._id)}>Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="empty-message">No matching clients</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
