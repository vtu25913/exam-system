import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import Spinner from '../../components/Spinner';
import Pagination from '../../components/Pagination';

export default function AdminResults() {
  const [results, setResults] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => { api.get('/exams?limit=100').then(({ data }) => setExams(data.exams)); }, []);

  const load = async (p = 1, ef = filter) => {
    setLoading(true);
    try {
      const q = new URLSearchParams({ page: p, limit: 15 });
      if (ef) q.append('examId', ef);
      const { data } = await api.get(`/results?${q}`);
      setResults(data.results); setPages(data.pages); setTotal(data.total);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(1, ''); }, []);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-bold mb-0">Results <span className="badge bg-secondary ms-1">{total}</span></h5>
        <select className="form-select form-select-sm" style={{width:220}} value={filter}
          onChange={(e) => { setFilter(e.target.value); setPage(1); load(1, e.target.value); }}>
          <option value="">All Exams</option>
          {exams.map((ex) => <option key={ex._id} value={ex._id}>{ex.title}</option>)}
        </select>
      </div>

      {loading ? <Spinner /> : (
        <>
          <div className="card">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr><th>Student</th><th>Exam</th><th>Score</th><th>Percentage</th><th>Status</th><th>Date</th></tr>
                </thead>
                <tbody>
                  {results.length === 0
                    ? <tr><td colSpan={6} className="text-center text-muted py-4">No results found</td></tr>
                    : results.map((r) => (
                      <tr key={r._id}>
                        <td><div className="fw-medium">{r.student?.name}</div><small className="text-muted">{r.student?.email}</small></td>
                        <td>{r.exam?.title}</td>
                        <td>{r.score} / {r.totalMarks}</td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div className="progress flex-grow-1" style={{height:6,minWidth:60}}>
                              <div className={`progress-bar ${r.passed?'bg-success':'bg-danger'}`} style={{width:`${r.percentage}%`}}/>
                            </div>
                            <small>{r.percentage}%</small>
                          </div>
                        </td>
                        <td><span className={`badge ${r.passed?'badge-pass':'badge-fail'}`}>{r.passed?'PASS':'FAIL'}</span></td>
                        <td className="text-muted small">{new Date(r.submittedAt).toLocaleDateString()}</td>
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
