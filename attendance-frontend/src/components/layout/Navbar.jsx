import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div style={styles.navbar}>
      <h2>AAS Dashboard</h2>

      <button onClick={handleLogout} style={styles.logoutBtn}>
        Logout
      </button>
    </div>
  );
}

const styles = {
  navbar: {
    height: "60px",
    background: "#333",
    color: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 20px",
  },
  logoutBtn: {
    background: "red",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    cursor: "pointer",
  },
};

export default Navbar;