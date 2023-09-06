import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface StartPageProps {
  onStartQuiz: (email: string) => void; // Ensure the correct type for onStartQuiz
}

const StartPage: React.FC<StartPageProps> = ({ onStartQuiz }) => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleStartQuiz = () => {
    if (email.trim() !== '') {
      onStartQuiz(email);
      navigate('/quiz');
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
      <Link to="/quiz" className="btn btn-primary">Start quiz</Link>
    </div>
  );
};

export default StartPage;
