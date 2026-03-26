import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import Spinner from '../../components/Spinner';

const blankQ = () => ({ questionText:'', options:['','','',''], correctAnswer:0, marks:1 });

export default function ExamForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [info, setInfo] = useState({ title:'', description:'', duration:30, passingMarks:0, isActive:true });
  const [questions, setQuestions] = useState([blankQ()]);

  useEffect(() => {
    if (!isEdit) return;
    api.get(`/exams/${id}`).then(({ data }) => {
      setInfo({ title:data.title, description:data.description||'', duration:data.duration, passingMarks:data.passingMarks, isActive:data.isActive });
      setQuestions(data.questions.map((q) => ({ questionText:q.questionText, options:q.options, correctAnswer:q.correctAnswer, marks:q.marks })));
    }).catch(() => toast.error('Failed to load exam')).finally(() => setLoading(false));
  }, [id, isEdit]);

  const setQ = (i, field, val) => setQuestions((prev) => prev.map((q, idx) => idx === i ? {...q, [field]: val} : q));
  const setOpt = (qi, oi, val) => setQuestions((prev) => prev.map((q, i) => {
    if (i !== qi) return q;
    const opts = [...q.options]; opts[oi] = val; return {...q, options: opts};
  }));

  const save = async (e) => {
    e.preventDefault();
    for (const [i, q] of questions.entries()) {
      if (!q.questionText.trim()) return toast.error(`Q${i+1}: question text is empty`);
      if (q.options.some((o) => !o.trim())) return toast.error(`Q${i+1}: all options required`);
    }
    setSaving(true);
    try {
      if (isEdit) await api.put(`/exams/${id}`, {...info, questions});
      else await api.post('/exams', {...info, questions});
      toast.success(`Exam ${isEdit ? 'updated' : 'created'}!`);
      navigate('/admin/exams');
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="d-flex align-items-center gap-2 mb-4">
        <button className="btn btn-sm btn-outline-secondary" onClick={() => navigate('/admin/exams')}>
          <i className="bi bi-arrow-left"></i>
        </button>
        <h5 className="fw-bold mb-0">{isEdit ? 'Edit Exam' : 'Create New Exam'}</h5>
      </div>

      <form onSubmit={save}>
        <div className="card mb-4">
          <div className="card-header bg-white fw-semibold">Exam Details</div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-8">
                <label className="form-label">Title *</label>
                <input className="form-control" value={info.title} onChange={(e) => setInfo({...info, title:e.target.value})} required />
              </div>
              <div className="col-md-2">
                <label className="form-label">Duration (min)</label>
                <input type="number" className="form-control" min={1} value={info.duration} onChange={(e) => setInfo({...info, duration:+e.target.value})} required />
              </div>
              <div className="col-md-2">
                <label className="form-label">Passing Marks</label>
                <input type="number" className="form-control" min={0} value={info.passingMarks} onChange={(e) => setInfo({...info, passingMarks:+e.target.value})} />
              </div>
              <div className="col-12">
                <label className="form-label">Description</label>
                <textarea className="form-control" rows={2} value={info.description} onChange={(e) => setInfo({...info, description:e.target.value})} />
              </div>
              <div className="col-12">
                <div className="form-check form-switch">
                  <input className="form-check-input" type="checkbox" checked={info.isActive} onChange={(e) => setInfo({...info, isActive:e.target.checked})} />
                  <label className="form-check-label">Active (visible to students)</label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="fw-bold mb-0">Questions ({questions.length})</h6>
          <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => setQuestions([...questions, blankQ()])}>
            <i className="bi bi-plus-lg me-1"></i>Add Question
          </button>
        </div>

        {questions.map((q, qi) => (
          <div key={qi} className="card mb-3">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <span className="fw-medium">Question {qi+1}</span>
              <div className="d-flex align-items-center gap-2">
                <label className="form-label mb-0 small">Marks:</label>
                <input type="number" className="form-control form-control-sm" style={{width:65}} min={1} value={q.marks} onChange={(e) => setQ(qi,'marks',+e.target.value)} />
                <button type="button" className="btn btn-sm btn-outline-danger"
                  onClick={() => { if(questions.length===1) return toast.warn('Need at least 1 question'); setQuestions(questions.filter((_,i)=>i!==qi)); }}>
                  <i className="bi bi-trash"></i>
                </button>
              </div>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Question Text *</label>
                <textarea className="form-control" rows={2} value={q.questionText} onChange={(e) => setQ(qi,'questionText',e.target.value)} required />
              </div>
              <div className="row g-2">
                {q.options.map((opt, oi) => (
                  <div key={oi} className="col-md-6">
                    <div className="input-group">
                      <span className="input-group-text">
                        <input type="radio" name={`correct-${qi}`} checked={q.correctAnswer===oi} onChange={() => setQ(qi,'correctAnswer',oi)} />
                      </span>
                      <input className={`form-control ${q.correctAnswer===oi?'border-success':''}`}
                        placeholder={`Option ${oi+1}`} value={opt} onChange={(e) => setOpt(qi,oi,e.target.value)} required />
                    </div>
                  </div>
                ))}
              </div>
              <small className="text-muted mt-2 d-block"><i className="bi bi-info-circle me-1"></i>Select radio = correct answer</small>
            </div>
          </div>
        ))}

        <div className="d-flex gap-2 justify-content-end">
          <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/admin/exams')}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving && <span className="spinner-border spinner-border-sm me-2"/>}
            {isEdit ? 'Update Exam' : 'Create Exam'}
          </button>
        </div>
      </form>
    </div>
  );
}
