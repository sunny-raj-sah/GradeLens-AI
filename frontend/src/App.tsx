
import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

import ProtectedRoute from './components/common/ProtectedRoute'
import AppLayout from './components/layout/AppLayout'


import Dashboard from './pages/dashboard/Dashboard'
import Classrooms from './pages/classrooms/Classrooms'
import Students from './pages/students/Students'
import Homework from './pages/homework/Homework'
import Submissions from './pages/submissions/Submissions'
import QuizResults from './pages/quizzes/QuizResults'
import StudentDetails from './pages/students/StudentDetails'
import Teachers from './pages/teachers/Teachers'
import Analytics from './pages/analytics/Analytics'
import AIAssistant from './pages/ai-assistant/AIAssistant'

import Landing from './pages/Landing'

export default function App() {
  return (
    <Routes>
        <Route path="/" element={<Landing />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/classrooms" element={<Classrooms />} />
          <Route path="/students" element={<Students />} />
          <Route path="/homework" element={<Homework />} />
          <Route path="/submissions" element={<Submissions />} />
          <Route path="/quiz-results" element={<QuizResults />} />
          <Route
            path="/students/:studentId"
            element={<StudentDetails />}
          />
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/ai-assistant" element={<AIAssistant />} />
        </Route>
      </Route>

      {/* <Route path="/" element={<Navigate to="/dashboard" replace />} /> */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
