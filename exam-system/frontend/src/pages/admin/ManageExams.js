import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import Spinner from '../../components/Spinner';
import Pagination from '../../components/Pagination';

export default function ManageExams() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  const load = async (p = 1, s = search) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/exams?page=${p}&limit=8&search=${encodeURIComponent(s)}`);
      setExams(data.exams); setPages(data.pages); setTotal(data.total);
    } catch { toast.error('Failed to load exams'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(1, ''); }, []);

  const del = async (id) => {
    if (!window.confirm('Delete this exam?')) return;
    try { await api.delete(`/exams/${id}`); toast.success('Deleted'); load(page); }
    catch { toast.error('Delete failed'); }
  };

  const toggle = async (exam) => {
    try {
      await api.put(`/exams/${exam._id}`, { isActive: !exam.isActive });
      toast.success(exam.isActive ? 'Deactivated' : 'Activated');
      load(page);
    } catch { toast.error('Update failed'); }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-bold mb-0">Manage Exams <span className="badge bg-secondary ms-1">{total}</span></h5>
        <Link to="/admin/exams/new" className="btn btn-primary btn-sm">
          <i className="bi bi-plus-lg me-1"></i>New Exam
        </Link>
      </div>

      <div className="card mb-3">
        <div className="card-body py-2">
          <form onSubmit={(e) => { e.preventDefault(); setPage(1); load(1, search); }} className="d-flex gap-2">
            <input className="form-control form-control-sm" placeholder="Search exams..."
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
                  <tr><th>Title</th><th>Questions</th><th>Duration</th><th>Marks</th><th>Status</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {exams.length === 0
                    ? <tr><td colSpan={6} className="text-center text-muted py-4">No exams found</td></tr>
                    : exams.map((ex) => (
                      <tr key={ex._id}>
                        <td>
                          <div className="fw-medium">{ex.title}</div>
                          <small className="text-muted">{ex.description?.slice(0,50)}</small>
                        </td>
                        <td>{ex.questions?.length || 0}</td>
                        <td>{ex.duration} min</td>
                        <td>{ex.totalMarks}</td>
                        <td><span className={`badge ${ex.isActive ? 'bg-success' : 'bg-secondary'}`}>{ex.isActive ? 'Active' : 'Inactive'}</span></td>
                        <td>
                          <div className="d-flex gap-1">
                            <Link to={`/admin/exams/${ex._id}/edit`} className="btn btn-sm btn-outline-primary"><i className="bi bi-pencil"></i></Link>
                            <button className="btn btn-sm btn-outline-warning" onClick={() => toggle(ex)}><i className={`bi ${ex.isActive ? 'bi-pause-fill' : 'bi-play-fill'}`}></i></button>
                            <button className="btn btn-sm btn-outline-danger" onClick={() => del(ex._id)}><i className="bi bi-trash"></i></button>
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
    </div>
  );
}
