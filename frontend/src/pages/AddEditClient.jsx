import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/AddClient.css";

export default function AddEditClient() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [client, setClient] = useState({
    name: "",
    pan: "",
    gstin: "",
    email: "",
    nextDeadline: "",
    documentStatus: {
      gstReturn: false,
      tdsFiling: false
    }
  });

  useEffect(() => {
    if (id) {
      axios
        .get("http://localhost:5001/api/clients", {
          headers: { Authorization: localStorage.getItem("token") }
        })
        .then((res) => {
          const found = res.data.find((c) => c._id === id);
          if (found) setClient(found);
        })
        .catch((err) => console.error("Failed to load client:", err));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setClient((prev) => ({
        ...prev,
        documentStatus: {
          ...prev.documentStatus,
          [name]: checked
        }
      }));
    } else {
      setClient((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await axios.put(`http://localhost:5001/api/clients/${id}`, client, {
          headers: { Authorization: localStorage.getItem("token") }
        });
      } else {
        await axios.post("http://localhost:5001/api/clients", client, {
          headers: { Authorization: localStorage.getItem("token") }
        });
      }
      navigate("/");
    } catch (err) {
      console.error("Submit failed:", err);
      alert("Failed to save client.");
    }
  };

  return (
    <div className="form-container">
      <form className="client-form" onSubmit={handleSubmit}>
        <h2>{id ? "Edit Client Details" : "Add New Client"}</h2>

        <label>Name</label>
        <input type="text" name="name" value={client.name} onChange={handleChange} required />

        <label>PAN</label>
        <input type="text" name="pan" value={client.pan} onChange={handleChange} required />

        <label>GSTIN</label>
        <input type="text" name="gstin" value={client.gstin} onChange={handleChange} />

        <label>Email</label>
        <input type="email" name="email" value={client.email} onChange={handleChange} />

        <label>Next Deadline</label>
        <input
          type="date"
          name="nextDeadline"
          value={client.nextDeadline?.slice(0, 10)}
          onChange={handleChange}
        />

        <div className="checkbox-group">
          <label>
            <input
              type="checkbox"
              name="gstReturn"
              checked={client.documentStatus.gstReturn}
              onChange={handleChange}
            />
            GST Return Submitted
          </label>
          <label>
            <input
              type="checkbox"
              name="tdsFiling"
              checked={client.documentStatus.tdsFiling}
              onChange={handleChange}
            />
            TDS Filing Submitted
          </label>
        </div>

        <button type="submit">{id ? "Update Client" : "Add Client"}</button>
      </form>
    </div>
  );
}
