import React, { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import axios from "axios";

const PasswordDetails = ({
  password,
  onClose,
  onPasswordUpdated,
  onPasswordDeleted,
}) => {
  const [updatedPassword, setUpdatedPassword] = useState({ ...password });
  const [error, setError] = useState("");
  const [masterPassword, setMasterPassword] = useState("");
  const [revealedPassword, setRevealedPassword] = useState("");
  const [isRequestingReveal, setIsRequestingReveal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(!password.protected);

  useEffect(() => {
    setUpdatedPassword({ ...password });
  }, [password]);

  const handleAuthenticate = async () => {
    try {
      setIsRequestingReveal(true);
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `http://localhost:5000/api/passwords/${password.id}/reveal`,
        { password: masterPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        setIsAuthenticated(true);
        setRevealedPassword(response.data.password);
        setUpdatedPassword({
          ...updatedPassword,
          password: response.data.password,
        });
        setError("");
      }
    } catch (err) {
      console.error("Authentication failed:", err);
      setError(err.response?.data?.message || "Invalid master password.");
    } finally {
      setIsRequestingReveal(false);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:5000/api/passwords/${password.id}`,
        updatedPassword,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        onPasswordUpdated(response.data);
        setError("");
        onClose();
      }
    } catch (err) {
      console.error("Error updating password:", err);
      setError("Error updating password.");
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/passwords/${password.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      onPasswordDeleted(password.id);
      onClose();
    } catch (err) {
      console.error("Error deleting password:", err);
      setError("Error deleting password.");
    }
  };

  const handleDeleteConfirmation = () => {
    const userConfirmed = window.confirm(
      "Are you sure you want to delete this password?"
    );
    if (userConfirmed) {
      handleDelete();
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50">
      <div
        className="card shadow-lg position-relative"
        style={{
          maxWidth: "600px",
          width: "90%",
          padding: "20px",
        }}
      >
        {!isAuthenticated ? (
          <div>
            <button
              onClick={onClose}
              className="btn-close position-absolute top-0 end-0 m-2"
            ></button>
            <h3 className="text-center mb-4">Master Password</h3>
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Enter master password"
                value={masterPassword}
                onChange={(e) => setMasterPassword(e.target.value)}
              />
              <button
                className="btn btn-primary mt-3 w-100"
                onClick={handleAuthenticate}
                disabled={isRequestingReveal}
              >
                {isRequestingReveal ? "Authenticating..." : "Continue"}
              </button>
            </div>
            {error && <p className="text-danger text-center">{error}</p>}
          </div>
        ) : (
          <>
            <button
              onClick={onClose}
              className="btn-close position-absolute top-0 end-0 m-2"
            ></button>
            <h3 className="text-center mb-4">Manage Password</h3>
            <form>
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control"
                      id="service"
                      value={updatedPassword.service}
                      onChange={(e) =>
                        setUpdatedPassword({
                          ...updatedPassword,
                          service: e.target.value,
                        })
                      }
                      placeholder="Service"
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
                      value={updatedPassword.username}
                      onChange={(e) =>
                        setUpdatedPassword({
                          ...updatedPassword,
                          username: e.target.value,
                        })
                      }
                      placeholder="Username"
                    />
                    <label htmlFor="username">Username</label>
                  </div>
                </div>
              </div>
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control"
                      id="password"
                      value={revealedPassword || updatedPassword.password}
                      onChange={(e) =>
                        setUpdatedPassword({
                          ...updatedPassword,
                          password: e.target.value,
                        })
                      }
                      placeholder="Password"
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
                      value={updatedPassword.url}
                      onChange={(e) =>
                        setUpdatedPassword({
                          ...updatedPassword,
                          url: e.target.value,
                        })
                      }
                      placeholder="URL"
                    />
                    <label htmlFor="url">URL</label>
                  </div>
                </div>
              </div>
              <div className="form-floating mb-3">
                <textarea
                  className="form-control"
                  id="notes"
                  style={{ height: "100px" }}
                  value={updatedPassword.notes}
                  onChange={(e) =>
                    setUpdatedPassword({
                      ...updatedPassword,
                      notes: e.target.value,
                    })
                  }
                  placeholder="Notes (Optional)"
                ></textarea>
                <label htmlFor="notes">Notes (Optional)</label>
              </div>
              <div className="form-check mb-4">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="protected"
                  checked={updatedPassword.protected}
                  onChange={(e) =>
                    setUpdatedPassword({
                      ...updatedPassword,
                      protected: e.target.checked,
                    })
                  }
                />
                <label className="form-check-label" htmlFor="protected">
                  Require master password to reveal password
                </label>
              </div>
              <div className="d-flex gap-3">
                <button onClick={handleSave} className="btn btn-primary w-100">
                  Save
                </button>
                <button
                  onClick={handleDeleteConfirmation}
                  className="btn btn-danger w-100"
                >
                  <FaTrash className="me-2" /> Delete
                </button>
              </div>
            </form>
            {error && <p className="text-danger text-center mt-3">{error}</p>}
          </>
        )}
      </div>
    </div>
  );
};

export default PasswordDetails;
