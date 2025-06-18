import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

const AdminDashboardUserAdd = ({ adminCompanyId }) => {
  const [name, setName] = useState("");
  const [tags, setTags] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [message, setMessage] = useState("");
  

  useEffect(() => {    
    axios.get(`${API_URL}/tags?companyID=${adminCompanyId}`)
      .then(res => setAllTags(res.data))
      .catch(() => setAllTags([]));
  }, [adminCompanyId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {     
      const userRes = await axios.post(`${API_URL}/users`, {
        name,
        companyID: adminCompanyId
      });
      const userId = userRes.data.id;
      // Assign tags to user
      if (tags.length > 0) {
        await axios.post(`${API_URL}/users/${userId}/tags`, { tagIDs: tags });
      }
      setMessage("User created and tags assigned!");
      setName("");
      setTags([]);
    } catch (err) {
      setMessage("Error creating user or assigning tags.");
    }
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: 16, borderRadius: 8, maxWidth: 400 }}>
      <h3>Add User to Your Company</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="User Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          style={{ width: "100%", marginBottom: 8 }}
        />
        <label>Assign Tags:</label>
        <select
          multiple
          value={tags}
          onChange={e => setTags(Array.from(e.target.selectedOptions, option => Number(option.value)))}
          style={{ width: "100%", marginBottom: 8 }}
        >
          {allTags.map(tag => (
            <option key={tag.id} value={tag.id}>{tag.name}</option>
          ))}
        </select>
        <button type="submit">Add User</button>
      </form>
      {message && <div style={{ marginTop: 8 }}>{message}</div>}
    </div>
  );
};

export default AdminDashboardUserAdd;