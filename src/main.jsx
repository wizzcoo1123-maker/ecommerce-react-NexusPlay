/**
 * @file main.jsx
 * @description Application entry point.
 * Mounts React root, attaches BrowserRouter for HTML5 client-side routing,
 * and loads global stylesheets.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
