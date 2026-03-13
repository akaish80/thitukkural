/* eslint-disable  */

import React, { useState } from 'react';
import { Container } from '../../../Common/common.styles';
import './practice.letter.scss';

const PracticeLetter = () => {
  const [currentLetter] = useState('அ');
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [score, setScore] = useState(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setUserInput(input);

    if (input === currentLetter) {
      setFeedback('சரியானது! (Correct!)');
      setScore(score + 1);
      setAttempts(attempts + 1);
      // Clear input after a delay
      setTimeout(() => {
        setUserInput('');
        setFeedback('');
      }, 1500);
    } else if (input.length >= currentLetter.length) {
      setFeedback('தவறானது! மீண்டும் முயற்சி செய்யுங்கள் (Incorrect! Try again)');
      setAttempts(attempts + 1);
    }
  };

  const resetPractice = () => {
    setUserInput('');
    setFeedback('');
    setAttempts(0);
    setScore(0);
  };

  const getSuccessRate = () => {
    if (attempts === 0) return 0;
    return Math.round((score / attempts) * 100);
  };

  return (
    <Container>
      <div className="practice-letter-container">
        <div className="header-section">
          <h2>தமிழ் எழுத்து பயிற்சி (Tamil Letter Practice)</h2>
          <h3>Letter: {currentLetter}</h3>
        </div>

        <div className="practice-section">
          <div className="letter-display">
            <div className="large-letter">{currentLetter}</div>
            <div className="letter-info">
              <p>Letter Name: அ (A)</p>
              <p>Type: Vowel (உயிர் எழுத்து)</p>
              <p>Sound: /a/ as in "father"</p>
            </div>
          </div>

          <div className="input-section">
            <label htmlFor="letter-input">Type the letter அ:</label>
            <input
              id="letter-input"
              type="text"
              value={userInput}
              onChange={handleInputChange}
              placeholder="Type here..."
              className="letter-input"
              autoComplete="off"
            />

            {feedback && (
              <div className={`feedback ${feedback.includes('சரியானது') ? 'success' : 'error'}`}>
                {feedback}
              </div>
            )}
          </div>

          <div className="stats-section">
            <div className="stat-item">
              <span className="stat-label">Attempts:</span>
              <span className="stat-value">{attempts}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Correct:</span>
              <span className="stat-value">{score}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Success Rate:</span>
              <span className="stat-value">{getSuccessRate()}%</span>
            </div>
          </div>

          <div className="actions-section">
            <button onClick={resetPractice} className="reset-button">
              Reset Practice
            </button>
          </div>
        </div>

        <div className="tips-section">
          <h4>Practice Tips:</h4>
          <ul>
            <li>Focus on the shape of the letter அ</li>
            <li>Notice it consists of a curved line and a straight line</li>
            <li>Practice writing it slowly at first</li>
            <li>This is the first letter of the Tamil alphabet</li>
          </ul>
        </div>
      </div>
    </Container>
  );
};

export default PracticeLetter;
