import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './context/AuthContext';

import Login        from './pages/Login';
import Register     from './pages/Register';
import Layout       from './components/Layout';

import AdminDashboard from './pages/admin/Dashboard';
import ManageExams    from './pages/admin/ManageExams';
import ExamForm       from './pages/admin/ExamForm';
import AdminResults   from './pages/admin/Results';
import ManageUsers    from './pages/admin/ManageUsers';

import StudentDashboard from './pages/student/Dashboard';
import TakeExam         from './pages/student/TakeExam';
import StudentResults   from './pages/student/Results';
import ResultDetail     from './pages/student/ResultDetail';

const Guard = ({ children, role }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
};

const Root = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === 'admin' ? '/admin' : '/student'} replace />;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        <Routes>
          <Route path="/"         element={<Root />} />
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/admin" element={<Guard role="admin"><Layout /></Guard>}>
            <Route index          element={<AdminDashboard />} />
            <Route path="exams"   element={<ManageExams />} />
            <Route path="exams/new"      element={<ExamForm />} />
            <Route path="exams/:id/edit" element={<ExamForm />} />
            <Route path="results" element={<AdminResults />} />
            <Route path="users"   element={<ManageUsers />} />
          </Route>

          <Route path="/student" element={<Guard role="student"><Layout /></Guard>}>
            <Route index           element={<StudentDashboard />} />
            <Route path="results"  element={<StudentResults />} />
            <Route path="results/:examId" element={<ResultDetail />} />
          </Route>

          <Route path="/exam/:id" element={<Guard role="student"><TakeExam /></Guard>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
