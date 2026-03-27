import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import Spinner from '../../components/Spinner';

export default function TakeExam() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [cur, setCur] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [started, setStarted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const startedAt = useRef(null);
  const done = useRef(false);

  useEffect(() => {
    api.get(`/exams/${id}/start`)
      .then(({ data }) => { setExam(data); setTimeLeft(data.duration * 60); })
      .catch(() => { toast.error('Exam not available'); navigate('/student'); })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const submit = useCallback(async (auto = false) => {
    if (done.current) return;
    done.current = true;
    setSubmitting(true);
    try {
      const timeTaken = startedAt.current ? Math.round((Date.now() - startedAt.current) / 1000) : 0;
      const answersArr = exam.questions.map((q) => ({
        questionId: q._id || q.id,
        selectedAnswer: answers[q._id || q.id] !== undefined ? answers[q._id || q.id] : -1,
      }));
      await api.post('/results/submit', { examId: id, answers: answersArr, timeTaken });
      if (auto) toast.info('Time up! Auto-submitted.');
      else toast.success('Submitted successfully!');
      navigate(`/student/results/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
      done.current = false;
    } finally { setSubmitting(false); }
  }, [exam, answers, id, navigate]);

  useEffect(() => {
    if (!started) return;
    const t = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { clearInterval(t); submit(true); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [started, submit]);

  useEffect(() => {
    if (!started) return;
    const onVis = () => { if (document.hidden) toast.warn('⚠ Do not switch tabs!', { toastId: 'tab' }); };
    const onBU = (e) => { e.preventDefault(); e.returnValue = ''; };
    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('beforeunload', onBU);
    return () => { document.removeEventListener('visibilitychange', onVis); window.removeEventListener('beforeunload', onBU); };
  }, [started]);

  const fmt = (s) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
  const timerCls = timeLeft > 300 ? 'timer-normal' : timeLeft > 60 ? 'timer-warning' : 'timer-danger';

  if (loading) return <div className="min-vh-100 d-flex align-items-center justify-content-center"><Spinner /></div>;

  if (!started) return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{background:'#f0f2f5'}}>
      <div className="card p-4 text-center" style={{maxWidth:480,width:'100%'}}>
        <i className="bi bi-journal-text text-primary fs-1 mb-3"></i>
        <h4 className="fw-bold">{exam?.title}</h4>
        <p className="text-muted">{exam?.description}</p>
        <div className="row g-2 mb-4">
          {[['Questions', exam?.questions?.length],['Duration', exam?.duration+' min'],['Total Marks', exam?.totalMarks]].map(([l,v]) => (
            <div key={l} className="col-4">
              <div className="bg-light rounded p-2"><div className="fw-bold">{v}</div><small className="text-muted">{l}</small></div>
            </div>
          ))}
        </div>
        <div className="alert alert-warning text-start small mb-4">
          <strong><i className="bi bi-exclamation-triangle me-1"></i>Instructions:</strong>
          <ul className="mb-0 mt-1 ps-3">
            <li>Do not switch tabs or refresh</li>
            <li>Exam auto-submits when time ends</li>
            <li>Each question has one correct answer</li>
          </ul>
        </div>
        <button className="btn btn-primary btn-lg fw-semibold" onClick={() => { setStarted(true); startedAt.current = Date.now(); }}>
          <i className="bi bi-play-fill me-2"></i>Start Exam
        </button>
      </div>
    </div>
  );

  const q = exam.questions[cur];
  const answered = Object.keys(answers).length;

  return (
    <div className="min-vh-100" style={{background:'#f0f2f5'}}>
      {/* Header */}
      <div className="bg-white shadow-sm py-3 px-4 d-flex justify-content-between align-items-center sticky-top">
        <div>
          <div className="fw-bold">{exam.title}</div>
          <small className="text-muted">{answered}/{exam.questions.length} answered</small>
        </div>
        <div className={`timer-badge ${timerCls}`}><i className="bi bi-clock me-1"></i>{fmt(timeLeft)}</div>
        <button className="btn btn-success btn-sm fw-semibold" onClick={() => submit(false)} disabled={submitting}>
          {submitting && <span className="spinner-border spinner-border-sm me-1"/>}Submit
        </button>
      </div>
      <div className="progress" style={{height:3,borderRadius:0}}>
        <div className="progress-bar bg-primary" style={{width:`${(answered/exam.questions.length)*100}%`}}/>
      </div>

      <div className="container py-4" style={{maxWidth:860}}>
        <div className="row g-3">
          <div className="col-md-8">
            <div className="card">
              <div className="card-body">
                <div className="d-flex justify-content-between mb-3">
                  <span className="badge bg-primary">Q {cur+1} / {exam.questions.length}</span>
                  <span className="badge bg-secondary">{q.marks} mark{q.marks>1?'s':''}</span>
                </div>
                <p className="fw-semibold fs-6 mb-4">{q.questionText}</p>
                {q.options.map((opt, oi) => (
                  <div key={oi} className={`q-option ${answers[q._id||q.id]===oi?'selected':''}`}
                    onClick={() => setAnswers({...answers, [q._id||q.id]: oi})}>
                    <span className="badge bg-light text-dark border">{String.fromCharCode(65+oi)}</span>
                    <span>{opt}</span>
                  </div>
                ))}
              </div>
              <div className="card-footer bg-white d-flex justify-content-between">
                <button className="btn btn-outline-secondary btn-sm" disabled={cur===0} onClick={() => setCur(cur-1)}>
                  <i className="bi bi-chevron-left me-1"></i>Prev
                </button>
                <button className="btn btn-outline-secondary btn-sm" disabled={cur===exam.questions.length-1} onClick={() => setCur(cur+1)}>
                  Next<i className="bi bi-chevron-right ms-1"></i>
                </button>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card">
              <div className="card-header bg-white small fw-semibold">Navigator</div>
              <div className="card-body">
                <div className="d-flex flex-wrap gap-1">
                  {exam.questions.map((_, i) => (
                    <button key={i} style={{width:36,height:36}}
                      className={`btn btn-sm ${i===cur?'btn-primary':answers[exam.questions[i]._id||exam.questions[i].id]!==undefined?'btn-success':'btn-outline-secondary'}`}
                      onClick={() => setCur(i)}>{i+1}</button>
                  ))}
                </div>
                <div className="mt-3 small d-flex gap-3">
                  <span><span className="badge bg-success me-1">■</span>Done</span>
                  <span><span className="badge bg-secondary me-1">■</span>Pending</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
