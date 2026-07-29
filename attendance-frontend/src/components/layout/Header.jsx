// ===== Header.js (updated with animation, z-index fix, mobile click support) =====
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import "./Header.css";

function Header() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef(null);
  const profileContainerRef = useRef(null);
  const dropdownRef = useRef(null);
  const [name, setName] = useState(localStorage.getItem("name") || "");
  const [supportsHover, setSupportsHover] = useState(true);

  useEffect(() => {
  const updateName = () => {
    setName(localStorage.getItem("name") || "");
  };

  window.addEventListener("storage", updateName);
  window.addEventListener("profileUpdated", updateName);

  return () => {
    window.removeEventListener("storage", updateName);
    window.removeEventListener("profileUpdated", updateName);
  };
}, []);

  useEffect(() => {
    // Modern way to check for hover capability
    const hoverMediaQuery = window.matchMedia("(hover: hover)");
    setSupportsHover(hoverMediaQuery.matches);

    // Listen for changes (e.g., device orientation change or hybrid devices)
    const handleChange = (e) => setSupportsHover(e.matches);
    hoverMediaQuery.addEventListener("change", handleChange);
    return () => hoverMediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Click outside handler (works for both mobile and desktop)
  useEffect(() => {
    const handleClickOutside = (event) => {
      // If dropdown is open and click is outside profile container AND outside dropdown itself
      if (open &&
        profileContainerRef.current &&
        !profileContainerRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)) {
        setOpen(false);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [open]);

  // Hover event handlers (only active on devices that support hover)
  const handleMouseEnter = () => {
    if (!supportsHover) return;
    clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    if (!supportsHover) return;
    timeoutRef.current = setTimeout(() => {
      setOpen(false);
    }, 200); // small delay prevents flicker when moving to dropdown
  };

  // Click/tap handler for mobile & touch devices
  const handleToggle = () => {
    if (supportsHover) return; // On desktop with hover, we don't interfere with hover behavior
    // On touch devices, toggle the dropdown
    setOpen(prev => !prev);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="header">
      <h1>Attendance System</h1>

      <div className="header-right">
        <h3 className="user-name">Welcome {name}</h3>
        <div
          className="profile-container"
          ref={profileContainerRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleToggle}
        >
          <div className="profile-icon">👤</div>
          <div className={`profile-dropdown ${open ? "show" : ""}`} ref={dropdownRef}>
            <button onClick={() => navigate("/profile")}>View Profile</button>
            <button onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;