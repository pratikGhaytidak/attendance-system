import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import backgroundImg from "C:/Users/HP/Desktop/My Projects/attendance-frontend/src/assets/gcek1.jpg"; // ✅ keep image inside src/assets
import logo from "C:/Users/HP/Desktop/My Projects/attendance-frontend/src/assets/logo.png";

function Login() {
  const navigate = useNavigate();
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [captchaInput, setCaptchaInput] = useState("");

  function generateCaptcha() {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    return { num1, num2, answer: num1 + num2 };
  }

  const handleLogin = async (e) => {
    e.preventDefault();

    if (parseInt(captchaInput) !== captcha.answer) {
      alert("Incorrect captcha answer. Please try again.");
      setCaptcha(generateCaptcha());
      setCaptchaInput("");
      return;
    }

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const res = await fetch("http://localhost/attendance_system/api/auth/login_old.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      // const res = await fetch("http://attenzo.site.jehttp://localhost/attendance_system/api/auth/loginNew.php", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json"
      //   },
      //   body: JSON.stringify({
      //     email,
      //     password
      //   }),
      // });

      // console.log("HTTP Status:", res.status);

      // const responseText = await res.text();

      // console.log("Server Response:", responseText);

      // const data = JSON.parse(responseText);

      // fetch("localhosthttp://localhost/attendance_system/api/auth/simple.php")
      //   .then(res => res.text())
      //   .then(data => console.log(data))
      //   .catch(err => console.log(err));

      if (data.status === "success") {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("role", data.role);
        localStorage.setItem("name", data.name);
        localStorage.setItem("faculty_id", data.faculty_id);
        localStorage.setItem("email", data.email || data.data?.email);



        alert("Login Successful");

        if (data.role === "admin") {
          navigate("/admin-dashboard");
        }
        else if (data.role === "faculty") {
          navigate("/dashboard");
        }
        else if (data.role === "student") {

          localStorage.setItem("student_id", data.id);
          console.log("student email is: ", localStorage.getItem("email"));
          navigate("/student-dashboard");

        }
        else if (data.role === "hod") {
          localStorage.setItem("department_id", data.department_id);
          localStorage.setItem("department_name", data.department_name);
          navigate("/hod-dashboard");
        }
        else if (data.role === "principal") {
          navigate("/principal-dashboard");
        }

      } else {
        alert("Invalid Login");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Server not responding!");
    }
  };

  return (
    <div
      className={styles.loginPage}
      style={{ backgroundImage: `url(${backgroundImg})` }}
    >
      <div className={styles.loginCard}>
        {/* Optional Logo */}

        <div className={styles.logo}>
          <img src={logo} alt="College Logo" />
        </div>

        <h2>Login to your account</h2>
        <p className={styles.collegeName}>
          (Government College of Engineering, Karad)
        </p>

        <form onSubmit={handleLogin}>
          <div className={styles.inputGroup}>
            <input type="email" name="email" placeholder="Email" required autoFocus />
          </div>

          <div className={styles.inputGroup}>
            <input type="password" name="password" placeholder="Password" required />
          </div>

          <div className={styles.captchaGroup}>
            <div className={styles.captchaQuestion}>
              {captcha.num1} + {captcha.num2}
            </div>

            <input
              type="text"
              placeholder="Enter Solution Here"
              value={captchaInput}
              onChange={(e) => setCaptchaInput(e.target.value)}
              required
            />
          </div>

          <button type="submit" className={styles.loginBtn}>
            Login
          </button>

          <button
            type="button"
            className={styles.backBtn}
            onClick={() => navigate("/")}
          >
            Back
          </button>
        </form>
        {/* ✅ Forgot Password Link */}
        <Link to="/forgot-password"
          className={styles.forgotLink}
        >
          Forgot Password?
        </Link>

        <p className={styles.registerLink}>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
