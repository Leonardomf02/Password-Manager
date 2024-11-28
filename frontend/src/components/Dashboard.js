import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaTachometerAlt, FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';
import axios from 'axios';
import CreatePassword from './CreatePassword';
import PasswordDetails from './PasswordDetails';

const Dashboard = () => {
  const navigate = useNavigate();
  const [passwords, setPasswords] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedPassword, setSelectedPassword] = useState(null);
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const fetchPasswords = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/passwords', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPasswords(response.data);
    } catch (error) {
      console.error('Error fetching passwords:', error);
    }
  };

  useEffect(() => {
    if (token) fetchPasswords();
    else navigate('/login');
  }, [token, navigate]);

  const handleCardClick = (password) => {
    setSelectedPassword(password);
  };

  const updatePassword = (updatedPassword) => {
    setPasswords((prev) =>
      prev.map((password) =>
        password.id === updatedPassword.id ? updatedPassword : password
      )
    );
  };

  const deletePassword = (id) => {
    setPasswords((prev) => prev.filter((password) => password.id !== id));
  };

  return (
    <div className="d-flex min-vh-100" style={{ backgroundColor: '#f1f1f1' }}>
      {/* Sidebar */}
      <div
        className="d-flex flex-column p-4 text-white"
        style={{
          width: '250px',
          backgroundColor: '#2a1b3d',
          borderRadius: '8px 0 0 8px',
        }}
      >
        {/* Logo */}
        <h2
          className="text-center fw-bold mb-4"
          style={{
            background: 'linear-gradient(to right, #6a11cb, #2575fc)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          LockItUp
        </h2>

        {/* Menu Options */}
        <ul className="list-unstyled flex-grow-1">
          <li className="py-2 d-flex align-items-center gap-2" style={{ fontSize: '18px', cursor: 'pointer' }}>
            <FaTachometerAlt /> Dashboard
          </li>
          <li className="py-2 d-flex align-items-center gap-2" style={{ fontSize: '18px', cursor: 'pointer' }}>
            <FaUser /> Profile
          </li>
          <li className="py-2 d-flex align-items-center gap-2" style={{ fontSize: '18px', cursor: 'pointer' }}>
            <FaCog /> Settings
          </li>
        </ul>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="btn text-white d-flex align-items-center justify-content-center gap-2 mt-auto"
          style={{ backgroundColor: '#6a11cb', border: 'none' }}
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>My Vault</h2>
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn text-white d-flex align-items-center gap-2"
            style={{ backgroundColor: '#6a11cb', border: 'none' }}
          >
            <FaPlus /> Add Password
          </button>
        </div>

        {/* Password Cards */}
        <div className="row g-3">
          {passwords.map((password) => (
            <div
              key={password.id}
              className="col-12 col-md-4 col-lg-3"
              onClick={() => handleCardClick(password)}
            >
              <div
                className="card p-3 text-center"
                style={{
                  cursor: 'pointer',
                  backgroundColor: '#fff',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                }}
              >
                <p className="fw-bold mb-0">{password.service}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Create Password Form */}
        {showCreateForm && (
          <CreatePassword
            onClose={() => setShowCreateForm(false)}
            onPasswordCreated={fetchPasswords}
          />
        )}

        {/* Password Details */}
        {selectedPassword && (
          <PasswordDetails
            password={selectedPassword}
            onClose={() => setSelectedPassword(null)}
            onPasswordUpdated={updatePassword}
            onPasswordDeleted={deletePassword}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
