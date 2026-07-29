// import { useNavigate } from "react-router-dom";

// function Home() {
//   const navigate = useNavigate();

//   return (
//     <div className="home-container">
//       <h1 className="home-title">Attendance System</h1>
//       <p className="home-subtitle">
//         Welcome! Please login or register to continue.
//       </p>

//       <div className="button-container">
//         <button
//           className="btn login-btn"
//           onClick={() => navigate("/login")}
//         >
//           Login
//         </button>

//         <button
//           className="btn register-btn"
//           onClick={() => navigate("/register")}
//         >
//           Register
//         </button>
//       </div>
//     </div>
//   );
// }

// export default Home;
// Home.jsx
// Home.jsx
// Home.jsx
// Home.jsx
// Home.jsx
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";
import logo from "../assets/logo.png";
import backgroundImg from "../assets/gcek1.jpg";

function Home() {
  const navigate = useNavigate();

  return (
    <div
      className={styles.homePage}
      style={{ backgroundImage: `url(${backgroundImg})` }}
    >
      <div className={styles.homeCard}>
        {/* Logo */}
        <div className={styles.logo}>
          <img src={logo} alt="College Logo" />
        </div>

        <h1 className={styles.homeTitle}>Attendance System</h1>

        <p className={styles.homeSubtitle}>
          Welcome! Please login or register to continue.
        </p>

        <div className={styles.buttonContainer}>
          <button
            className={styles.loginBtn}
            onClick={() => navigate("/login")}
          >
            Login
          </button>

          <button
            className={styles.registerBtn}
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;