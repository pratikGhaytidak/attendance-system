// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";

// function Register() {
//   const navigate = useNavigate();

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleRegister = (e) => {
//     e.preventDefault();

//     // TEMP register (no API yet)
//     if (name && email && password) {
//       alert("Registered successfully!");
//       navigate("/login");
//     } else {
//       alert("Please fill all fields");
//     }
//   };

//   return (
//     <div style={{ textAlign: "center", marginTop: "100px" }}>
//       <h2>Register</h2>

//       <form onSubmit={handleRegister}>
//         <div>
//           <input type="text" placeholder="Enter Name" value={name} onChange={(e) => setName(e.target.value)} />
//           <br /><br />
//         </div>

//         <div>
//           <input type="email" placeholder="Enter Email" value={email} onChange={(e) => setEmail(e.target.value)} />
//           <br /><br />
//         </div>

//         <div>
//           <input type="password" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)} />
//           <br /><br />
//         </div>

//         <button className="login-btn" type="submit">Register</button>
//         <button className="back-btn" type="button" onClick={() => navigate("/")}>Back</button>
//       </form>

//       <p>
//         Already have an account? <Link to="/login">Login</Link>
//       </p>
//     </div>
//   );
// }

// export default Register;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Register.module.css";
import backgroundImg from "C:/Users/HP/Desktop/My Projects/attendance-frontend/src/assets/gcek1.jpg"; // ✅ keep image inside src/assets
import logo from "C:/Users/HP/Desktop/My Projects/attendance-frontend/src/assets/logo.png";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();

    if (name && email && password) {
      alert("Registered successfully!");
      navigate("/login");
    } else {
      alert("Please fill all fields");
    }
  };

  return (
    <div
      className={styles.registerPage}
      style={{ backgroundImage: `url(${backgroundImg})` }}
    >
      <div className={styles.registerCard}>
        {/* Logo */}
        <div className={styles.logo}>
          <img src={logo} alt="College Logo" />
        </div>

        <h2>Create Faculty Account</h2>
        <p className={styles.collegeName}>
          (Government College of Engineering, Karad)
        </p>

        <form onSubmit={handleRegister}>
          <div className={styles.inputGroup}>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <input
              type="password"
              placeholder="Create Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className={styles.registerBtn}>
            Register
          </button>

          <button
            type="button"
            className={styles.backBtn}
            onClick={() => navigate("/")}
          >
            Back
          </button>
        </form>

        <p className={styles.loginLink}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;