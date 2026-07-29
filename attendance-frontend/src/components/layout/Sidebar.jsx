import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();

  const menu = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Students", path: "/students" },
    { name: "Subjects", path: "/subjects" },
    { name: "Attendance", path: "/attendance" },
    { name: "Reports", path: "/reports" },
  ];

  return (
    <div style={styles.sidebar}>
      <h3 style={{ color: "#fff" }}>AAS</h3>

      <ul style={styles.menu}>
        {menu.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              style={{
                ...styles.link,
                background:
                  location.pathname === item.path ? "#555" : "transparent",
              }}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  sidebar: {
    width: "200px",
    height: "100vh",
    background: "#222",
    padding: "20px",
  },
  menu: {
    listStyle: "none",
    padding: 0,
  },
  link: {
    display: "block",
    padding: "10px",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "5px",
    marginBottom: "10px",
  },
};

export default Sidebar;