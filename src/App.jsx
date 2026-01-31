import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from './Pages/Dashboard';
import ResumeDetail from "./Pages/ResumeDetail";

import './App.css'

import { Login4 } from "./Pages/auth";


function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login4 />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/resume-detail" element={<ResumeDetail />} />
      </Routes>
    </Router>
  )
}

export default App
