import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';

import Login from './components/Login';
import React, { StrictMode } from 'react';

const App: React.FC = () => {
  return (
    <StrictMode>
      <div className="flex flex-col w-full min-h-screen">
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
          </Routes>
        </Router>
      </div>
    </StrictMode>
  );
};

createRoot(document.getElementById('root')!).render(<App />);
