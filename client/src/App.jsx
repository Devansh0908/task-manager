import { LayoutDashboard, LogOut, FolderKanban, Sparkles } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

export default function App() {
  const { logout, user } = useAuth();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <div className="brand">
            <span className="brand-mark">
              <Sparkles size={18} />
            </span>
            <span>Team Task Manager</span>
          </div>
          <div className="user-card">
            <div className="avatar">{user?.name?.charAt(0)?.toUpperCase() || "U"}</div>
            <div>
              <strong>{user?.name}</strong>
              <span>{user?.role}</span>
            </div>
          </div>
          <nav className="nav-list" aria-label="Primary navigation">
            <NavLink to="/dashboard">
              <LayoutDashboard size={18} />
              Dashboard
            </NavLink>
            <NavLink to="/projects">
              <FolderKanban size={18} />
              Projects
            </NavLink>
          </nav>
        </div>
        <button className="ghost-button" type="button" onClick={logout}>
          <LogOut size={18} />
          Logout
        </button>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
