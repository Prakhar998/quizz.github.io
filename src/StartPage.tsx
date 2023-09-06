import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface StartPageProps {
  onStartQuiz: (email: string) => void;
}

const StartPage: React.FC<StartPageProps> = ({ onStartQuiz }) => {
  const [email, setEmail] = useState('');

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleStartQuiz = () => {
    if (email.trim() !== '') {
      onStartQuiz(email);
    }
  };

  return (
    <div>
      <h1>Welcome to the Quiz App!</h1>
      <p>Please enter your email address to start the quiz:</p>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={handleEmailChange}
      />
      <button onClick={handleStartQuiz} className="btn btn-primary">
        Start quiz
      </button>
      <Link to="/quiz">Skip to quiz</Link>
    </div>
  );
};

export default StartPage;
