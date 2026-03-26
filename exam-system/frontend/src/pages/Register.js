import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ name:'', email:'', password:'', confirm:'' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return toast.error('Passwords do not match');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created!');
      navigate('/student');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  const f = (field) => (e) => setForm({...form, [field]: e.target.value});

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <div className="text-center mb-4">
          <div style={{width:60,height:60,background:'linear-gradient(135deg,#6366f1,#8b5cf6)',borderRadius:16,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 12px'}}>
            <i className="bi bi-person-plus-fill text-white fs-3"></i>
          </div>
          <h4 className="fw-bold">Create Account</h4>
          <p className="text-muted small mb-0">Register as a student</p>
        </div>

        <form onSubmit={submit}>
          {[
            { label:'Full Name',        field:'name',     type:'text',     ph:'John Doe' },
            { label:'Email',            field:'email',    type:'email',    ph:'you@example.com' },
            { label:'Password',         field:'password', type:'password', ph:'Min 6 characters' },
            { label:'Confirm Password', field:'confirm',  type:'password', ph:'Repeat password' },
          ].map(({ label, field, type, ph }) => (
            <div className="mb-3" key={field}>
              <label className="form-label fw-medium">{label}</label>
              <input type={type} className="form-control" placeholder={ph}
                value={form[field]} onChange={f(field)} required />
            </div>
          ))}
          <button className="btn btn-primary w-100 py-2 fw-semibold mt-1" disabled={loading}>
            {loading && <span className="spinner-border spinner-border-sm me-2"/>}
            Create Account
          </button>
        </form>

        <p className="text-center mt-3 mb-0 small">
          Already have an account? <Link to="/login" className="fw-semibold">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
