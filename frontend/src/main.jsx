import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import Register from './pages/Register';
import ClientList from './pages/ClientList';
import AddEditClient from './pages/AddEditClient';
import UpcomingDeadlines from './pages/UpcomingDeadlines';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
      <Navbar />
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<ProtectedRoute><ClientList /></ProtectedRoute>} />
      <Route path="/add" element={<ProtectedRoute><AddEditClient /></ProtectedRoute>} />
      <Route path="/edit/:id" element={<ProtectedRoute><AddEditClient /></ProtectedRoute>} />
      <Route path="/deadlines" element={<ProtectedRoute><UpcomingDeadlines /></ProtectedRoute>} />
    </Routes>
  </BrowserRouter>
);
