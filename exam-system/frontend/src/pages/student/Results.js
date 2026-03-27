import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import Spinner from '../../components/Spinner';

export default function StudentResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/results/my').then(({ data }) => setResults(data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <div>
      <h5 className="fw-bold mb-4">My Results</h5>
      {results.length === 0
        ? <div className="text-center text-muted py-5"><i className="bi bi-trophy fs-1 d-block mb-2"></i>No results yet. Take an exam!</div>
        : <div className="row g-3">
          {results.map((r) => (
            <div key={r.id || r._id} className="col-md-6">
              <div className="card h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h6 className="fw-bold mb-0">{r.exam?.title}</h6>
                    <span className={`badge ${r.passed?'badge-pass':'badge-fail'}`}>{r.passed?'PASS':'FAIL'}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-1">
                    <small className="text-muted">Score</small>
                    <small className="fw-medium">{r.score} / {r.totalMarks}</small>
                  </div>
                  <div className="progress mb-2" style={{height:8}}>
                    <div className={`progress-bar ${r.passed?'bg-success':'bg-danger'}`} style={{width:`${r.percentage}%`}}/>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold fs-5">{r.percentage}%</span>
                    <Link to={`/student/results/${r.exam?.id || r.examId}`} className="btn btn-sm btn-outline-primary">
                      <i className="bi bi-eye me-1"></i>Details
                    </Link>
                  </div>
                  <small className="text-muted d-block mt-2">
                    <i className="bi bi-calendar me-1"></i>{new Date(r.submittedAt).toLocaleDateString()}
                  </small>
                </div>
              </div>
            </div>
          ))}
        </div>
      }
    </div>
  );
}
