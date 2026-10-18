import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import "./EditProfile.css"; // Import the scoped CSS

function EditProfile() {
    const navigate = useNavigate();
    const storedEmail = localStorage.getItem("email");

    const [formData, setFormData] = useState({
        id: "",
        name: "",
        email: "",
        department: "",
        profile_image: "",
        role: ""
    });

    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        if (!storedEmail) {
            setMessage("Email not found in localStorage");
            setIsError(true);
            setLoading(false);
            return;
        }

        fetch(`https://gcekattendance.in/api/common/getProfile.php?email=${storedEmail}`)
            .then((res) => res.json())
            .then((data) => {
                console.log("API Response:", data);

                if (data.status && data.data) {
                    setFormData({
                        id: data.data.id || "",
                        name: data.data.name || "",
                        email: data.data.email || "",
                        department: data.data.department || "",
                        profile_image: data.data.profile_image || "",
                        role: data.data.role || ""
                    });
                } else {
                    setMessage(data.message || "Profile not found");
                    setIsError(true);
                }

                setLoading(false);
            })
            .catch((err) => {
                console.error("Fetch error:", err);
                setMessage("Server error");
                setIsError(true);
                setLoading(false);
            });
    }, [storedEmail]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch(
                "https://gcekattendance.in/api/common/updateProfile.php",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        id: formData.id,
                        name: formData.name,
                        email: formData.email,
                        role: formData.role
                    })
                }
            );

            const data = await res.json();

            if (data.status) {
                localStorage.setItem("name", formData.name);
                window.dispatchEvent(new Event("profileUpdated"));
                alert("Profile Updated Successfully ✅");
                localStorage.setItem("email", formData.email);
                navigate("/profile");
            } else {
                alert(data.message || "Update Failed ❌");
            }

        } catch (error) {
            console.error(error);
            alert("Server Error ❌");
        }
    };

    if (loading) {
        return (
            <div className="editprofile-app">
                <div className="loading-container">
                    <div className="spinner"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="editprofile-app">
            <div className="editprofile-container">
                <div className="editprofile-card">
                    <div className="editprofile-header">
                        <h2>Edit Profile</h2>
                        <div className="header-underline"></div>
                    </div>

                    {message && (
                        <div className={isError ? "error-message" : "info-message"}>
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Department</label>
                            <input
                                type="text"
                                value={formData.department}
                                disabled
                            />
                        </div>

                        <div className="form-group">
                            <label>Role</label>
                            <input
                                type="text"
                                value={formData.role}
                                disabled
                            />
                        </div>

                        <div className="form-actions"><button type="button" className="cancel-btn" onClick={() => navigate(-1)}>
                            Cancel
                        </button>
                            <button type="submit" className="update-btn">
                                Update Profile
                            </button>

                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default EditProfile;