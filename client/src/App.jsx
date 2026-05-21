import { CalendarDays, FolderKanban, LayoutDashboard, LogOut } from "lucide-react";
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
              <img src="/image.png" alt="Team Task Manager logo" />
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
        <header className="workspace-topbar">
          <div>
            <span className="topbar-label">Workspace</span>
            <strong>Team operations</strong>
          </div>
          <div className="topbar-date">
            <CalendarDays size={17} />
            {new Date().toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}
          </div>
        </header>
        <Outlet />
      </main>
    </div>
  );
}
