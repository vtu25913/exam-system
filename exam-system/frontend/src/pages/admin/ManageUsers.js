import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import Spinner from '../../components/Spinner';
import Pagination from '../../components/Pagination';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [modal, setModal] = useState(false);
  const [nu, setNu] = useState({ name:'', email:'', password:'' });
  const [creating, setCreating] = useState(false);

  const load = async (p=1, s=search) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/users?page=${p}&limit=10&search=${encodeURIComponent(s)}`);
      setUsers(data.users); setPages(data.pages); setTotal(data.total);
    } catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(1,''); }, []);

  const toggle = async (id) => {
    try { const { data } = await api.put(`/users/${id}/toggle`); toast.success(data.message); load(page); }
    catch { toast.error('Failed'); }
  };

  const del = async (id) => {
    if (!window.confirm('Delete student?')) return;
    try { await api.delete(`/users/${id}`); toast.success('Deleted'); load(page); }
    catch { toast.error('Delete failed'); }
  };

  const create = async (e) => {
    e.preventDefault(); setCreating(true);
    try {
      await api.post('/users', nu);
      toast.success('Student created'); setModal(false); setNu({name:'',email:'',password:''}); load(1,'');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setCreating(false); }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-bold mb-0">Students <span className="badge bg-secondary ms-1">{total}</span></h5>
        <button className="btn btn-primary btn-sm" onClick={() => setModal(true)}>
          <i className="bi bi-person-plus me-1"></i>Add Student
        </button>
      </div>

      <div className="card mb-3">
        <div className="card-body py-2">
          <form onSubmit={(e) => { e.preventDefault(); setPage(1); load(1,search); }} className="d-flex gap-2">
            <input className="form-control form-control-sm" placeholder="Search by name or email..."
              value={search} onChange={(e) => setSearch(e.target.value)} />
            <button className="btn btn-outline-primary btn-sm px-3"><i className="bi bi-search"></i></button>
          </form>
        </div>
      </div>

      {loading ? <Spinner /> : (
        <>
          <div className="card">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr><th>Name</th><th>Email</th><th>Joined</th><th>Status</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {users.length === 0
                    ? <tr><td colSpan={5} className="text-center text-muted py-4">No students found</td></tr>
                    : users.map((u) => (
                      <tr key={u._id}>
                        <td className="fw-medium">{u.name}</td>
                        <td className="text-muted">{u.email}</td>
                        <td className="text-muted small">{new Date(u.createdAt).toLocaleDateString()}</td>
                        <td><span className={`badge ${u.isActive?'bg-success':'bg-secondary'}`}>{u.isActive?'Active':'Inactive'}</span></td>
                        <td>
                          <div className="d-flex gap-1">
                            <button className="btn btn-sm btn-outline-warning" onClick={() => toggle(u._id)}>
                              <i className={`bi ${u.isActive?'bi-person-slash':'bi-person-check'}`}></i>
                            </button>
                            <button className="btn btn-sm btn-outline-danger" onClick={() => del(u._id)}>
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>
          <Pagination page={page} pages={pages} onPageChange={(p) => { setPage(p); load(p); }} />
        </>
      )}

      {modal && (
        <div className="modal show d-block" style={{background:'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Student</h5>
                <button className="btn-close" onClick={() => setModal(false)} />
              </div>
              <form onSubmit={create}>
                <div className="modal-body">
                  {[['Full Name','name','text'],['Email','email','email'],['Password','password','password']].map(([label,field,type]) => (
                    <div className="mb-3" key={field}>
                      <label className="form-label">{label}</label>
                      <input type={type} className="form-control" value={nu[field]}
                        onChange={(e) => setNu({...nu,[field]:e.target.value})} required minLength={field==='password'?6:undefined} />
                    </div>
                  ))}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={creating}>
                    {creating && <span className="spinner-border spinner-border-sm me-2"/>}Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
