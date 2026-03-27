import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import Spinner from '../../components/Spinner';
import Pagination from '../../components/Pagination';

export default function StudentDashboard() {
  const [exams, setExams] = useState([]);
  const [attempted, setAttempted] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const navigate = useNavigate();

  const load = async (p=1, s=search) => {
    setLoading(true);
    try {
      const [er, rr] = await Promise.all([
        api.get(`/exams?page=${p}&limit=6&search=${encodeURIComponent(s)}`),
        api.get('/results/my'),
      ]);
      setExams(er.data.exams);
      setPages(er.data.pages);
      setAttempted(rr.data.map((r) => r.exam?.id || r.examId));
    } catch { toast.error('Failed to load exams'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(1,''); }, []);

  const go = (examId) => {
    if (attempted.includes(examId)) navigate(`/student/results/${examId}`);
    else navigate(`/exam/${examId}`);
  };

  return (
    <div>
      <h5 className="fw-bold mb-4">Available Exams</h5>

      <div className="card mb-4">
        <div className="card-body py-2">
          <form onSubmit={(e) => { e.preventDefault(); setPage(1); load(1,search); }} className="d-flex gap-2">
            <input className="form-control form-control-sm" placeholder="Search exams..."
              value={search} onChange={(e) => setSearch(e.target.value)} />
            <button className="btn btn-outline-primary btn-sm px-3"><i className="bi bi-search"></i></button>
          </form>
        </div>
      </div>

      {loading ? <Spinner /> : (
        <>
          <div className="row g-3">
            {exams.length === 0
              ? <div className="col-12 text-center text-muted py-5"><i className="bi bi-journal-x fs-1 d-block mb-2"></i>No exams available</div>
              : exams.map((ex) => {
                const done = attempted.includes(ex._id);
                return (
                  <div key={ex.id} className="col-md-6 col-lg-4">
                    <div className="card exam-card h-100">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h6 className="fw-bold mb-0">{ex.title}</h6>
                          {done && <span className="badge bg-success">Done</span>}
                        </div>
                        <p className="text-muted small mb-3">{ex.description || 'No description'}</p>
                        <div className="d-flex gap-3 text-muted small mb-3">
                          <span><i className="bi bi-clock me-1"></i>{ex.duration} min</span>
                          <span><i className="bi bi-question-circle me-1"></i>{ex.questions?.length} Qs</span>
                          <span><i className="bi bi-star me-1"></i>{ex.totalMarks} marks</span>
                        </div>
                        <button className={`btn btn-sm w-100 ${done?'btn-outline-success':'btn-primary'}`} onClick={() => go(ex.id)}>
                          {done ? <><i className="bi bi-eye me-1"></i>View Result</> : <><i className="bi bi-play-fill me-1"></i>Start Exam</>}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            }
          </div>
          <Pagination page={page} pages={pages} onPageChange={(p) => { setPage(p); load(p); }} />
        </>
      )}
    </div>
  );
}
