import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import GuestUpload from "../components/GuestUpload";
import WishModeration from "../components/WishModeration";
import "../styles/admin.css";

export default function AdminPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAccess() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/login");
        return;
      }

      const { data: role } = await supabase.rpc("get_my_role");

      if (role !== "admin") {
        await supabase.auth.signOut();
        navigate("/login");
        return;
      }

      setLoading(false);
    }

    checkAccess();
  }, [navigate]);

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/login");
  }

  if (loading) {
    return <p>Checking access...</p>;
  }

  return (
    <main className="admin-page">
      <header className="admin-header">
        <h1 className="admin-brand">Fevi &amp; Dawit <span className="admin-label">INVITATION STUDIO</span></h1>

        <button className="admin-logout" onClick={handleLogout}>Logout</button>
      </header>

      <div className="admin-content admin-workspace">
        <GuestUpload />
        <WishModeration />
      </div>
    </main>
  );
}
