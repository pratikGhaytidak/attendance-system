import { useState } from "react";
import styles from "./ForgotPassword.module.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSendLink = async () => {
    if (!email.trim()) {
      setMessage("❌ Email is required");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(
        "https://gcekattendance.in/api/common/sendResetLink.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim() }),
        }
      );

      const data = await res.json();
      setMessage(data.message);

    } catch (err) {
      console.error(err);
      setMessage("❌ Server error");
    }

    setLoading(false);
  };

  return (
    <div className={styles["forgot-container"]}>
      <div className={styles["forgot-card"]}>
        <h2>Forgot Password</h2>

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button onClick={handleSendLink} disabled={loading}>
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        {message && (
          <div className={styles.message}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;