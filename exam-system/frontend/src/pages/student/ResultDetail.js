import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../utils/api';
import Spinner from '../../components/Spinner';

export default function ResultDetail() {
  const { examId } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/results/my/${examId}`).then(({ data }) => setResult(data)).catch(console.error).finally(() => setLoading(false));
  }, [examId]);

  if (loading) return <Spinner />;
  if (!result) return <div className="text-center py-5 text-muted">Result not found</div>;

  const { exam, answers, score, totalMarks, percentage, passed, timeTaken } = result;

  return (
    <div>
      <div className="d-flex align-items-center gap-2 mb-4">
        <Link to="/student/results" className="btn btn-sm btn-outline-secondary"><i className="bi bi-arrow-left"></i></Link>
        <h5 className="fw-bold mb-0">{exam?.title} — Result</h5>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-md-3 text-center mb-3 mb-md-0">
              <div className="result-circle" style={{background:passed?'#dcfce7':'#fee2e2',color:passed?'#15803d':'#b91c1c'}}>
                {percentage}%
              </div>
              <span className={`badge mt-2 fs-6 ${passed?'badge-pass':'badge-fail'}`}>{passed?'PASSED':'FAILED'}</span>
            </div>
            <div className="col-md-9">
              <div className="row g-2">
                {[
                  ['Score', `${score} / ${totalMarks}`],
                  ['Correct', answers.filter((a)=>a.isCorrect).length],
                  ['Wrong', answers.filter((a)=>!a.isCorrect&&a.selectedAnswer!==-1).length],
                  ['Skipped', answers.filter((a)=>a.selectedAnswer===-1).length],
                  ['Time Taken', timeTaken ? `${Math.floor(timeTaken/60)}m ${timeTaken%60}s` : 'N/A'],
                  ['Passing Marks', exam?.passingMarks],
                ].map(([l,v]) => (
                  <div key={l} className="col-6 col-md-4">
                    <div className="bg-light rounded p-2 text-center">
                      <div className="fw-bold">{v}</div><small className="text-muted">{l}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <h6 className="fw-bold mb-3">Question Review</h6>
      {exam?.questions?.map((q, i) => {
        const ans = answers.find((a) => String(a.questionId) === String(q._id || q.id));
        const sel = ans?.selectedAnswer;
        const correct = ans?.isCorrect;
        const skipped = sel === -1 || sel === undefined;
        return (
          <div key={q._id || q.id} className={`card mb-3 border-${correct?'success':skipped?'secondary':'danger'}`}>
            <div className="card-header bg-white d-flex justify-content-between">
              <span className="fw-medium">Q{i+1}. {q.questionText}</span>
              <span className={`badge ${correct?'bg-success':skipped?'bg-secondary':'bg-danger'}`}>
                {correct?`+${q.marks}`:skipped?'Skipped':'0'}
              </span>
            </div>
            <div className="card-body py-2">
              {q.options.map((opt, oi) => {
                let cls = '';
                if (oi === q.correctAnswer) cls = 'correct';
                else if (oi === sel && !correct) cls = 'wrong';
                return (
                  <div key={oi} className={`q-option ${cls}`} style={{cursor:'default'}}>
                    <span className="badge bg-light text-dark border">{String.fromCharCode(65+oi)}</span>
                    <span>{opt}</span>
                    {oi === q.correctAnswer && <i className="bi bi-check-circle-fill text-success ms-auto"></i>}
                    {oi === sel && !correct && <i className="bi bi-x-circle-fill text-danger ms-auto"></i>}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
