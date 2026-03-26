import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const isAdmin = user?.role === 'admin';

  const links = isAdmin ? [
    { to: '/admin',         icon: 'bi-speedometer2', label: 'Dashboard',          end: true },
    { to: '/admin/exams',   icon: 'bi-journal-text', label: 'Manage Exams' },
    { to: '/admin/results', icon: 'bi-bar-chart-fill', label: 'Results & Analytics' },
    { to: '/admin/users',   icon: 'bi-people-fill',  label: 'Manage Students' },
  ] : [
    { to: '/student',         icon: 'bi-house-fill', label: 'Dashboard', end: true },
    { to: '/student/results', icon: 'bi-trophy-fill', label: 'My Results' },
  ];

  const doLogout = () => { logout(); navigate('/login'); };

  return (
    <>
      <nav className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-icon">
            <i className="bi bi-mortarboard-fill" style={{color:'#fff'}}></i>
          </div>
          <h5>ExamSystem</h5>
          <small>{isAdmin ? '⚡ Admin Panel' : '🎓 Student Portal'}</small>
        </div>

        <ul className="nav flex-column flex-grow-1 mt-2 px-1">
          {links.map((l) => (
            <li key={l.to}>
              <NavLink to={l.to} end={l.end} className="nav-link" onClick={() => setOpen(false)}>
                <i className={`bi ${l.icon}`}></i> {l.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="sidebar-footer">
          <div className="d-flex align-items-center gap-2 mb-3 px-2">
            <div style={{width:36,height:36,borderRadius:'50%',background:'rgba(255,255,255,0.25)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
              <i className="bi bi-person-fill text-white"></i>
            </div>
            <div>
              <div className="text-white fw-semibold" style={{fontSize:'0.82rem'}}>{user?.name}</div>
              <div style={{fontSize:'0.72rem',color:'rgba(255,255,255,0.65)'}}>{user?.email}</div>
            </div>
          </div>
          <button className="btn btn-sm w-100 fw-semibold"
            style={{background:'rgba(255,255,255,0.2)',color:'#fff',border:'1px solid rgba(255,255,255,0.3)',borderRadius:10}}
            onClick={doLogout}>
            <i className="bi bi-box-arrow-right me-2"></i>Logout
          </button>
        </div>
      </nav>

      <div className="top-bar">
        <button className="btn btn-sm d-md-none" style={{color:'#fff',border:'1px solid rgba(255,255,255,0.4)'}} onClick={() => setOpen(!open)}>
          <i className="bi bi-list fs-5"></i>
        </button>
        <span className="page-title">
          Welcome back, {user?.name} 👋
        </span>
        <span className="user-badge">
          <i className={`bi ${isAdmin ? 'bi-shield-fill' : 'bi-mortarboard-fill'}`}></i>
          {user?.role?.toUpperCase()}
        </span>
      </div>

      <main className="main-content">
        <Outlet />
      </main>
    </>
  );
}
