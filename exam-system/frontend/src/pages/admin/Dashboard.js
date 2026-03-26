import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import Spinner from '../../components/Spinner';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [analytics, setAnalytics] = useState([]);

  useEffect(() => {
    Promise.all([
      api.get('/exams?limit=100'),
      api.get('/users?limit=100'),
      api.get('/results?limit=100'),
      api.get('/results/analytics'),
    ]).then(([e, u, r, a]) => {
      setData({ exams: e.data.total, students: u.data.total, results: r.data.total });
      setAnalytics(a.data);
    }).catch(console.error);
  }, []);

  if (!data) return <Spinner />;

  const passRate = analytics.length
    ? Math.round(analytics.reduce((s, a) => s + (a.passed / a.totalAttempts) * 100, 0) / analytics.length)
    : 0;

  const cards = [
    { label:'Total Exams',   value: data.exams,    icon:'bi-journal-text',   bg:'linear-gradient(135deg,#6366f1,#8b5cf6)' },
    { label:'Students',      value: data.students, icon:'bi-people-fill',    bg:'linear-gradient(135deg,#f59e0b,#ef4444)' },
    { label:'Submissions',   value: data.results,  icon:'bi-check2-circle',  bg:'linear-gradient(135deg,#10b981,#059669)' },
    { label:'Avg Pass Rate', value: passRate+'%',  icon:'bi-graph-up-arrow', bg:'linear-gradient(135deg,#06b6d4,#0284c7)' },
  ];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-bold mb-0">Dashboard</h5>
        <Link to="/admin/exams/new" className="btn btn-primary btn-sm">
          <i className="bi bi-plus-lg me-1"></i>New Exam
        </Link>
      </div>

      <div className="row g-3 mb-4">
        {cards.map((c) => (
          <div key={c.label} className="col-6 col-md-3">
            <div className="stat-card" style={{background: c.bg}}>
              <i className={`bi ${c.icon} fs-2 opacity-75`}></i>
              <div className="fs-1 fw-bold mt-1">{c.value}</div>
              <div className="small opacity-75">{c.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header bg-white fw-semibold py-3">
          <i className="bi bi-bar-chart me-2 text-primary"></i>Exam Analytics
        </div>
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr><th>Exam</th><th>Attempts</th><th>Avg Score</th><th>Highest</th><th>Lowest</th><th>Pass Rate</th></tr>
            </thead>
            <tbody>
              {analytics.length === 0
                ? <tr><td colSpan={6} className="text-center text-muted py-4">No data yet</td></tr>
                : analytics.map((a) => (
                  <tr key={a._id}>
                    <td className="fw-medium">{a.exam?.title}</td>
                    <td>{a.totalAttempts}</td>
                    <td>{Math.round(a.avgScore)}%</td>
                    <td><span className="text-success fw-medium">{Math.round(a.maxScore)}%</span></td>
                    <td><span className="text-danger fw-medium">{Math.round(a.minScore)}%</span></td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div className="progress flex-grow-1" style={{height:6}}>
                          <div className="progress-bar bg-success" style={{width:`${(a.passed/a.totalAttempts)*100}%`}}/>
                        </div>
                        <small>{Math.round((a.passed/a.totalAttempts)*100)}%</small>
                      </div>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
