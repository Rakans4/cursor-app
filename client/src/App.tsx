import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { TaskManager } from './components/TaskManager';
import { Login } from './components/Login';
import { SignUp } from './components/SignUp';
import { ProtectedRoute } from './components/ProtectedRoute';

const App: React.FC = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<ProtectedRoute><TaskManager /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </>
  );
};

export default App;
