import { useSearchParams } from "react-router-dom";
import { useState } from "react";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();

    if (!token || !password) {
      setMessage("❌ Invalid request");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(
        "http://localhost/attendance-system/attendance-backend/api/common/updatePassword.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            token: token,
            password: password,
          }),
        }
      );

      const data = await res.text();
      setMessage(data);

    } catch (err) {
      setMessage("❌ Server error");
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Reset Password 🔐</h2>

      {!token ? (
        <p style={{ color: "red" }}>❌ Invalid or missing token</p>
      ) : (
        <form onSubmit={handleReset}>
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <br /><br />

          <button disabled={loading}>
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      )}

      {message && <p>{message}</p>}
    </div>
  );
}

export default ResetPassword;