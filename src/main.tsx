
import { createRoot } from 'react-dom/client';
import React, { StrictMode } from 'react';
import './index.css';
import AppRouter from './AppRouter';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>
);
