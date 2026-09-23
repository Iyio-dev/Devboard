import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Login from './components/Login'
import SignUp from './components/SignUp'
import CreateProject from './pages/CreateProject'
import ProjectDetails from './components/ProjectCard'
import Profile from './pages/Profile'
import ProtectedRoute from './components/ProtectedRoute'
import NotFound from './pages/NotFound'

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/sign-in' element={<Login />} />
      <Route path='/sign-up' element={<SignUp />} />

      {/* Protected routes: redirect to sign-in when not logged in */}
      <Route path='/dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path='/create-project' element={<ProtectedRoute><CreateProject /></ProtectedRoute>} />
      <Route path='/projects/:id' element={<ProtectedRoute><ProjectDetails /></ProtectedRoute>} />
      <Route path='/profile' element={<ProtectedRoute><Profile /></ProtectedRoute>} />

      <Route path='/404' element={<NotFound />} />
      <Route path='*' element={<Navigate to='/404' replace />} />
    </Routes>
  )
}

export default App
