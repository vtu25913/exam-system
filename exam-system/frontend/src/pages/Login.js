import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(user.role === 'admin' ? '/admin' : '/student');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Check credentials.');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <div className="text-center mb-4">
          <div style={{width:68,height:68,background:'linear-gradient(135deg,#6366f1,#ec4899)',borderRadius:20,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 14px',boxShadow:'0 8px 24px rgba(99,102,241,0.35)'}}>
            <i className="bi bi-mortarboard-fill text-white" style={{fontSize:'1.8rem'}}></i>
          </div>
          <h4 className="fw-bold" style={{background:'linear-gradient(135deg,#6366f1,#ec4899)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>ExamSystem</h4>
          <p className="text-muted small mb-0">Sign in to your account</p>
        </div>

        <form onSubmit={submit}>
          <div className="mb-3">
            <label className="form-label fw-medium">Email</label>
            <input type="email" className="form-control" placeholder="you@example.com"
              value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} required />
          </div>
          <div className="mb-4">
            <label className="form-label fw-medium">Password</label>
            <input type="password" className="form-control" placeholder="••••••••"
              value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} required />
          </div>
          <button className="btn btn-primary w-100 py-2 fw-semibold" disabled={loading}>
            {loading && <span className="spinner-border spinner-border-sm me-2"/>}
            Sign In
          </button>
        </form>

        <p className="text-center mt-3 mb-3 small">
          No account? <Link to="/register" className="fw-semibold">Register here</Link>
        </p>

        <div className="rounded-3 p-3 small mt-1" style={{background:'linear-gradient(135deg,#f5f3ff,#fdf2f8)',border:'1px solid #e9d5ff'}}>
          <div className="fw-semibold mb-2" style={{color:'#6366f1'}}>🎯 Demo Credentials</div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="badge" style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)'}}>Admin</span>
            <span className="text-muted">admin@exam.com / admin123</span>
          </div>
          <div className="d-flex align-items-center gap-2">
            <span className="badge" style={{background:'linear-gradient(135deg,#14b8a6,#06b6d4)'}}>Student</span>
            <span className="text-muted">alice@exam.com / student123</span>
          </div>
        </div>
      </div>
    </div>
  );
}
