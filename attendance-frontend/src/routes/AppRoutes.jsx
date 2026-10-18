import { Routes, Route } from "react-router-dom";

// Pages
import AdminDashboard from "../pages/dashboard/AdminDashboard";
import StudentDashboard from "../pages/dashboard/StudentDashboard";
import ProtectedRoute from "../components/common/ProtectedRoute";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/dashboard/Dashboard";
import Home from "../pages/Home";
import Layout from "../components/layout/Layout";
import MarkAttendance from "../pages/faculty/markAttendance";
import MarkAttendanceFrom from "../pages/faculty/MarkAttendanceForm";
import SubjectPage from "../pages/faculty/SubjectPage";
import ViewAttendance from "../pages/faculty/ViewAttendance";
import RecentAttendance from "../components/RecentAttendance";
import PrincipalDashboard from "../pages/dashboard/PrincipalDashnoard"
import HodDashboard from "../pages/dashboard/HodDashboard";
import AddStudent from "../pages/faculty/AddStudent";
import MyAttendance from "../pages/student/MyAttendance";
import EditAttendance from "../pages/faculty/EditAttendance";
import ManageFaculty from "../pages/hod/ManageFaculty";
import Profile from "../pages/common/Profile";
import Managestudents from "../pages/hod/Managestudents";
import Reports from "../pages/faculty/Reports";
import AddFaculty from "../pages/hod/AddFaculty";
import AssignSubject from "../pages/hod/AssignSubject";
import FacultySubjects from "../pages/hod/FacultySubjects";
import DisplayAllStudents from "../pages/hod/DisplayAllStudents";
import ManageStudent from "../pages/faculty/ManageStudent";
import ShowSubjectAttendance from "../pages/faculty/ShowSubjectAttendance";
import EditFacultyForm from "../pages/hod/EditFacultyForm";
import ManageClasses from "../pages/hod/ManageClasses";
import UpdateStudent from "../pages/faculty/UpdateStudent";
import EditProfile from "../pages/common/EditProfile";
import ChangePassword from "../pages/common/ChangePassword";
import PrincipalStudentViewer from "../pages/principal/PrincipalStudentViewer";
import PrincipalFacultyDirectory from "../pages/principal/PrincipalFacultyDirectory";
import ManageHod from "../pages/principal/ManageHod";
import ForgotPassword from "../pages/common/ForgotPassword";
import ResetPassword from "../pages/common/ResetPassword";
import MarkAttendance2 from "../pages/faculty/MarkAttendance2";
import DaDashboard from "../pages/dashboard/DaDashboard";


function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/forgot-password"
        element={
          <ForgotPassword />
        }
      />
      <Route
        path="/reset-password"
        element={
          <ResetPassword />
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute role="faculty">
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/da-dashboard"
        element={
          <ProtectedRoute role="da">
            <Layout>
              <DaDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute role="admin">
            <Layout>
              <AdminDashboard /> </Layout>
          </ProtectedRoute>
        }
      />

      {/* Student Dashboard */}
      <Route
        path="/student-dashboard"
        element={
          <ProtectedRoute role="student">
            <Layout> <StudentDashboard /> </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/mark-attendance-form"
        element={
          <ProtectedRoute role="faculty">
            <Layout> <MarkAttendanceFrom /> </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/mark-attendance/:subject_id/:departmentId/:year"
        element={
          <ProtectedRoute role="faculty">
            <Layout> <MarkAttendance2 /> </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/subject/:id"
        element={<ProtectedRoute role="faculty">
          <Layout> <SubjectPage /> </Layout>
        </ProtectedRoute>
        }
      />
      <Route
        path="/view-attendance"
        element={<ProtectedRoute role={"faculty" | "hod"}>
          <Layout> <ViewAttendance /> </Layout>
        </ProtectedRoute>

        } />
      <Route
        path="/principal-dashboard"
        element={
          <ProtectedRoute role="principal">
            <Layout><PrincipalDashboard /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/hod-dashboard"
        element={
          <ProtectedRoute role="hod">
            <Layout><HodDashboard /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/add-student"
        element={
          <ProtectedRoute role="faculty">
            <Layout><AddStudent /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-attendance"
        element={
          <ProtectedRoute role="student">
            <Layout><MyAttendance /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/edit-attendance/:id"
        element={
          <ProtectedRoute role="faculty">
            <Layout><EditAttendance /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/manage-faculty"
        element={
          <ProtectedRoute role="hod">
            <Layout><ManageFaculty /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute role={"hod" | "student" | "faculty" | "principal" | "admin"}>
            <Layout><Profile /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/edit-profile"
        element={
          <ProtectedRoute role={"hod" | "student" | "faculty" | "principal" | "admin"}>
            <Layout><EditProfile /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/manage-students"
        element={
          <ProtectedRoute role={"hod" | "faculty"}>
            <Layout><Managestudents /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute role={"faculty" | "hod"}>
            <Layout><Reports /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/add-faculty"
        element={
          <ProtectedRoute role="hod">
            <Layout><AddFaculty /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/assign-subject"
        element={
          <ProtectedRoute role="hod">
            <Layout><AssignSubject /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/faculty-subject"
        element={
          <ProtectedRoute role="hod">
            <Layout><FacultySubjects /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/display-students"
        element={
          <ProtectedRoute role="hod">
            <Layout><DisplayAllStudents /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/manage-student/:id"
        element={
          <ProtectedRoute role="faculty">
            <Layout><ManageStudent /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/show-subject-attendance/:id"
        element={
          <ProtectedRoute role={"faculty" | "hod"}>
            <Layout><ShowSubjectAttendance /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/edit-faculty-form/:id"
        element={
          <ProtectedRoute role="hod">
            <Layout><EditFacultyForm /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/manage-classes"
        element={
          <ProtectedRoute role="hod">
            <Layout><ManageClasses /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/update-student/:id"
        element={
          <ProtectedRoute role="faculty">
            <Layout><UpdateStudent /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/change-password"
        element={
          <ProtectedRoute role={"hod" | "student" | "faculty" | "principal" | "admin"}>
            <Layout><ChangePassword /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/principal-faculty-directory"
        element={
          <ProtectedRoute role="principal">
            <Layout><PrincipalFacultyDirectory /></Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/principal-student-viewer"
        element={
          <ProtectedRoute role="principal">
            <Layout><PrincipalStudentViewer /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/manage-hod"
        element={
          <ProtectedRoute role="principal">
            <Layout><ManageHod /></Layout>
          </ProtectedRoute>
        }
      />

      {/* 404 */}
      <Route path="*" element={<h2>Page Not Found</h2>} />
    </Routes>
    

  );
}

export default AppRoutes;