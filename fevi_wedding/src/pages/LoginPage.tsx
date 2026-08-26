import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "../styles/admin.css";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();

    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    const { data: roleData, error: roleError } =
      await supabase.rpc("get_my_role");

    if (roleError) {
      await supabase.auth.signOut();
      setError("Could not determine account role.");
      setLoading(false);
      return;
    }

    if (roleData === "admin") {
      navigate("/admin");
    } else if (roleData === "gate") {
      navigate("/gate");
    } else {
      await supabase.auth.signOut();
      setError("This account has no valid role.");
    }

    setLoading(false);
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <p className="section-eyebrow">FEVI &amp; ABU</p>
        <h1>Wedding Invitation Login</h1>
        <p className="login-copy">
          Sign in to manage invitations or welcome guests.
        </p>

        <form onSubmit={handleLogin}>
          <div>
            <label>Email</label>

            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div>
            <label>Password</label>

            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          {error && <p>❌ {error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </section>
    </main>
  );
}
