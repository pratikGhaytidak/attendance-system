import Header from "./Header";
import Footer from "./Footer";
import { Link } from "react-router-dom";

function Layout({ children }) {
  const role = localStorage.getItem("role");

  return (
    <div className="layout">
      <Header />

      <div className="main">
        <div className="sidebar"> 
          <h3>Menu</h3>

          {/* Admin Menu */}
          {role === "admin" && (
            <>
              <Link to="/admin-dashboard">Dashboard</Link>
              <Link to="/manage-students">Manage Students</Link>
              <Link to="/manage-faculty">Manage Faculty</Link>
            </>
          )}
          
          {role === "principal" && (
            <>
             <Link to="/principal-dashboard">Dashboard</Link>
              <Link to="/manage-hod">Manage Hod</Link>
              <Link to="/principal-faculty-directory">Manage Faculties</Link>
              <Link to="/principal-student-viewer">Display All Students</Link>
              
            </>
          )}

          {/* Faculty Menu */}
          {role === "faculty" && (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/mark-attendance-form">Take Attendance</Link>
              <Link to="/add-student">Add Student</Link>
              <Link to="/manage-students">Manage Student</Link>
              <Link to="/reports">Reports</Link>
            </>
          )}

          {/* Student Menu */}
          {role === "student" && (
            <>
              <Link to="/student-dashboard">Dashboard</Link>
              <Link to="/my-attendance">My Attendance</Link>
            </>
          )}
          {/* Student Menu */}
          {role === "hod" && (
            <>
              <Link to="/hod-dashboard">Dashboard</Link>
              <Link to="/manage-faculty">Manage Faculties</Link>
              <Link to="/manage-classes">Manage Classes</Link>
              <Link to="/display-students">Display All Students</Link>
              <Link to="/reports">Reports</Link>
            </>
          )}
        </div>

        <div className="content">
          {children}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Layout;


