// App.jsx
import { useEffect, useState } from 'react';
import './App.css';
import io from "socket.io-client";
import { Input } from './components/Input';

// Connect to the backend server via Socket.IO
const socket = io('http://localhost:3000');

function App() {
  const [formData, setFormData] = useState({});
  const [allformData, setAllformData] = useState([]);

  // Setup listeners once on component mount
  useEffect(() => {
    socket.on("connect", () => {
      console.log("✅ Connected to socket.io server");
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Connection error:", err);
    });

    // Listen for updates from server
    socket.on("allformData", (data) => {
      setAllformData(data);
      console.log("📦 Received allformData:", data);
    });

    // Clean up on unmount
    return () => {
      socket.off("allformData");
    };
  }, []);

  // Handle input field changes
  function handleInput(event) {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  // Send formData to backend
  function sendFormData() {
    console.log("📤 Sending:", formData);
    socket.emit('formData', formData);  // Send to server
    setFormData({});                    // Reset input fields
  }

  // Populate form for editing
  function handleEdit(entry) {
    setFormData(entry);  // Pre-fill form with existing values
  }

  // Send delete request to backend
  function handleDelete(id) {
    socket.emit("deleteEntry", id);
  }

  return (
    <>
      <h1>🔁 Real-time CRUD with Socket.IO</h1>

      {/* Form section */}
      <div className="div" style={{ maxWidth: '400px', margin: 'auto' }}>
        <Input name="name" placeholder="Enter your name" handleInput={handleInput} value={formData.name || ''} />
        <br />
        <Input name="age" placeholder="Enter your age" handleInput={handleInput} value={formData.age || ''} />
        <br />
        <Input name="phone" placeholder="Enter your phone number" handleInput={handleInput} value={formData.phone || ''} />
        <br />
        <button
          onClick={sendFormData}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Submit
        </button>
      </div>

      {/* Display submitted entries */}
      <div style={{ maxWidth: '700px', margin: '40px auto', padding: '10px' }}>
        <h2>📋 Submitted Entries</h2>

        {allformData.length === 0 ? (
          <p>No entries yet.</p>
        ) : (
          <table style={{
            width: '100%',
            marginTop: '20px',
            borderCollapse: 'collapse',
            textAlign: 'left'
          }}>
            <thead>
              <tr>
                <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Name</th>
                <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Age</th>
                <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Phone</th>
                <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {allformData.map((entry, index) => (
                <tr key={index}>
                  <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{entry.name}</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{entry.age}</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{entry.phone}</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                    <button onClick={() => handleEdit(entry)} style={{ marginRight: '10px' }}>Edit</button>
                    <button onClick={() => handleDelete(entry.id)} style={{ color: 'red' }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

export default App;
