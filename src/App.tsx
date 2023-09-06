// App.tsx
import React from 'react';
import {BrowserRouter, Route, Router, Routes } from 'react-router-dom';

import StartPage from './StartPage';
import Quiz from './Quiz';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/quiz" element={<Quiz />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
