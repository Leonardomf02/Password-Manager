import React, { useState } from "react";
import axios from "axios";

const CreatePassword = ({ onClose, onPasswordCreated }) => {
  const [formData, setFormData] = useState({
    service: "",
    username: "",
    password: "",
    notes: "",
    url: "",
    protected: false,
  });
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5000/api/passwords/create",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Password created successfully!");
      setFormData({
        service: "",
        username: "",
        password: "",
        notes: "",
        url: "",
        protected: false,
      });
      onPasswordCreated();
      onClose();
    } catch (error) {
      console.error("Error creating password:", error);
      alert("Error creating password.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50">
      <div
        className="card p-4 shadow-lg"
        style={{
          maxWidth: "600px",
          width: "90%",
        }}
      >
        <h3 className="text-center mb-4">Add Password</h3>
        <form onSubmit={handleSubmit}>
          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <div className="form-floating">
                <input
                  type="text"
                  className="form-control"
                  id="service"
                  placeholder="Service"
                  value={formData.service}
                  onChange={(e) =>
                    setFormData({ ...formData, service: e.target.value })
                  }
                  required
                />
                <label htmlFor="service">Service</label>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-floating">
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  required
                />
                <label htmlFor="username">Username</label>
              </div>
            </div>
          </div>
          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <div className="form-floating">
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
                <label htmlFor="password">Password</label>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-floating">
                <input
                  type="url"
                  className="form-control"
                  id="url"
                  placeholder="URL"
                  value={formData.url}
                  onChange={(e) =>
                    setFormData({ ...formData, url: e.target.value })
                  }
                />
                <label htmlFor="url">URL (Optional)</label>
              </div>
            </div>
          </div>
          <div className="form-floating mb-3">
            <textarea
              className="form-control"
              id="notes"
              placeholder="Notes (Optional)"
              style={{ height: "120px" }}
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
            ></textarea>
            <label htmlFor="notes">Notes (Optional)</label>
          </div>

          {/* Checkbox */}
          <div className="form-check mb-4">
            <input
              className="form-check-input"
              type="checkbox"
              id="protected"
              checked={formData.protected}
              onChange={(e) =>
                setFormData({ ...formData, protected: e.target.checked })
              }
            />
            <label className="form-check-label" htmlFor="protected">
              Require master password to reveal password
            </label>
          </div>
          <div className="d-flex gap-3">
            <button type="submit" className="btn btn-primary w-50">
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary w-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePassword;
