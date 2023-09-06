import React, { useState, useEffect } from 'react';
import axios from 'axios';


import './Quiz.css'; // Import your CSS file

interface QuizProps {}

const Quiz: React.FC<QuizProps> = () => {
  const [questions, setQuestions] = useState<
    Array<{
      questionText: string;
      choices: string[];
      selectedChoice: string | null;
      correctAnswer: string;
    }>
  >([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(1800); // 30 minutes in seconds
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [visitedQuestions, setVisitedQuestions] = useState<boolean[]>(
    new Array(15).fill(false) // Assuming there are 15 questions
  );

  useEffect(() => {
    // Function to fetch questions from the API
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(
          'https://opentdb.com/api.php?amount=15'
        );
        const apiQuestions = response.data.results;
        // Process the API data into the format you need
        const formattedQuestions = apiQuestions.map((apiQuestion: any) => ({
          questionText: apiQuestion.question,
          choices: [...apiQuestion.incorrect_answers, apiQuestion.correct_answer],
          selectedChoice: null, // Initially, no choice is selected
          correctAnswer: apiQuestion.correct_answer,
        }));
        setQuestions(formattedQuestions);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, []);

  const handleSelectAnswer = (choiceIndex: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex].selectedChoice =
      updatedQuestions[currentQuestionIndex].choices[choiceIndex];
    setQuestions(updatedQuestions);
    setVisitedQuestions((prevVisitedQuestions) => {
      const updatedVisitedQuestions = [...prevVisitedQuestions];
      updatedVisitedQuestions[currentQuestionIndex] = true;
      return updatedVisitedQuestions;
    });
  };

  const handleGoToQuestion = (questionIndex: number) => {
    setCurrentQuestionIndex(questionIndex);
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleFinishQuiz = () => {
    // Calculate score and compare selected choices with correct answers here
    let score = 0;
    questions.forEach((question) => {
      if (question.selectedChoice === question.correctAnswer) {
        score++;
      }
    });

    // Display score or perform other end-of-quiz actions here
    alert(`Quiz completed! Your score is ${score}/${questions.length}`);
    setQuizCompleted(true);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime === 0) {
          clearInterval(timer);
          handleFinishQuiz(); // Automatically finish the quiz when the timer reaches zero
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div>
      <h1>Quiz App</h1>
      <div className="timer">
        <p>
          Time Remaining: {Math.floor(timeRemaining / 60)}:
          {(timeRemaining % 60).toString().padStart(2, '0')}
        </p>
      </div>
      {questions.length > 0 && !quizCompleted ? (
        <div className="question-container">
          <h2>Question {currentQuestionIndex + 1}:</h2>
          <p>{questions[currentQuestionIndex].questionText}</p>
          <ul>
            {questions[currentQuestionIndex].choices.map((choice, index) => (
              <li key={index}>
                <label>
                  <input
                    type="radio"
                    name={`question-${currentQuestionIndex}`}
                    value={choice}
                    checked={
                      choice === questions[currentQuestionIndex].selectedChoice
                    }
                    onChange={() => handleSelectAnswer(index)}
                  />
                  {choice}
                </label>
              </li>
            ))}
          </ul>
          <div>
            {currentQuestionIndex > 0 && (
              <button onClick={handlePreviousQuestion}>Previous</button>
            )}
            {currentQuestionIndex < questions.length - 1 && (
              <button onClick={handleNextQuestion}>Next</button>
            )}
            {currentQuestionIndex === questions.length - 1 && (
              <button onClick={handleFinishQuiz}>Finish</button>
            )}
          </div>
        </div>
      ) : (
        <p>Loading questions...</p>
      )}
      <div className="question-panel horizontal">
        <h2>Question Overview</h2>
        <ul>
          {questions.map((question, index) => (
            <li
              key={index}
              onClick={() => handleGoToQuestion(index)}
              className={`${
                visitedQuestions[index] ? 'visited' : ''
              } ${
                question.selectedChoice ? 'attempted' : '' // Indicate attempted questions
              } ${
                question.selectedChoice === question.correctAnswer
                  ? 'correct'
                  : ''
              }`}
            >
              Q{index + 1}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Quiz;