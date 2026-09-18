import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Login from './components/Login'
import CreateProject from './pages/CreateProject'
import ProjectCard from './components/ProjectCard'

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />}/>
      <Route path='/sign-in' element={<Login />}/>
      <Route path='/dashboard' element={<Dashboard />}/> 
      <Route path='/create-project' element={<CreateProject />}/>
      <Route path='/projects/:id' element={<ProjectCard />}/>
      <Route path='*' element={<div>404 Not Found</div>}/>
    </Routes>
  )
}

export default App
