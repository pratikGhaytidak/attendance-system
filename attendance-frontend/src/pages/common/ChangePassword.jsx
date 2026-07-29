import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ChangePassword.css";

function ChangePassword() {
    const email = localStorage.getItem("email");
    const role = localStorage.getItem("role");
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        current_password: "",
        new_password: "",
        confirm_password: ""
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Clear message when user starts typing again
        if (message) setMessage("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.current_password || !formData.new_password || !formData.confirm_password) {
            setIsError(true);
            setMessage("All fields are required");
            return;
        }

        if (formData.new_password !== formData.confirm_password) {
            setIsError(true);
            setMessage("New passwords do not match");
            return;
        }

        if (formData.new_password.length < 4) {
            setIsError(true);
            setMessage("New password must be at least 6 characters");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const res = await fetch("http://localhost/attendance-system/attendance-backend/api/common/changePassword.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    role,
                    current_password: formData.current_password,
                    new_password: formData.new_password
                })
            });

            const data = await res.json();

            if (data.status) {
                setIsError(false);
                setMessage(data.message || "Password changed successfully!");

                setFormData({
                    current_password: "",
                    new_password: "",
                    confirm_password: ""
                });

                setTimeout(() => {
                    navigate("/profile");
                }, 1500);
            } else {
                setIsError(true);
                setMessage(data.message || "Failed to change password");
            }
        } catch (error) {
            console.error(error);
            setIsError(true);
            setMessage("Server error. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="changepassword-app">
            <div className="changepassword-container">
                <div className="changepassword-card">
                    <div className="changepassword-header">
                        <h2>Change Password</h2>
                        <div className="header-underline"></div>
                    </div>

                    {message && (
                        <div className={isError ? "error-message" : "success-message"}>
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Current Password</label>
                            <input
                                type="password"
                                name="current_password"
                                placeholder="Enter current password"
                                value={formData.current_password}
                                onChange={handleChange}
                                disabled={loading}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>New Password</label>
                            <input
                                type="password"
                                name="new_password"
                                placeholder="Enter new password (min 4 characters)"
                                value={formData.new_password}
                                onChange={handleChange}
                                disabled={loading}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Confirm New Password</label>
                            <input
                                type="password"
                                name="confirm_password"
                                placeholder="Confirm new password"
                                value={formData.confirm_password}
                                onChange={handleChange}
                                disabled={loading}
                                required
                            />
                        </div>

                        <div className="button-group">
                            <button type="button" className="cancel-btn" onClick={() => navigate(-1)}>
                                Cancel
                            </button>
                            <button type="submit" className="update-btn" disabled={loading}>
                                {loading ? "Updating..." : "Update Password"}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}

export default ChangePassword;