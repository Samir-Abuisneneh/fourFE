import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';

const GamePage = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [question, setQuestion] = useState({});
  const [selectedDifficulty, setSelectedDifficulty] = useState('EASY');
  const [photos, setPhotos] = useState([]);
  const [uniqueWords, setUniqueWords] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [submittedWords, setSubmittedWords] = useState([]);
  const [lastQuestion, setLastQuestion] = useState(true);
  const [score, setScore] = useState(0); // State to hold the score

  const [gameFinished, setGameFinished] = useState(false);


  useEffect(() => {
    // Extract unique words when question changes
    if (question.words) {
      const uniqueWordsArray = [...new Set(question.words.map((wordData) => wordData.word))];
      setUniqueWords(uniqueWordsArray);
    }
  }, [question]);

  const handleStartGame = async () => {
    try {
      const storedToken = localStorage.getItem('token');

      const responseGame = await fetch('http://localhost:8080/api/play/new-game', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${storedToken}`,
        },
        body: JSON.stringify({
          difficulty: selectedDifficulty,
        }),
      });

      if (responseGame.ok) {
        const responseQuestion = await fetch('http://localhost:8080/api/play/new-question', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        if (responseQuestion.ok) {
          const questionData = await responseQuestion.json();
          setQuestion(questionData);
          setPhotos(questionData.photos);
          setGameStarted(true);
        } else {
          console.error('Error fetching new question');
        }
      } else {
        console.error('Error starting new game');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDifficultyChange = (event) => {
    setSelectedDifficulty(event.target.value);
  };

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      const storedToken = localStorage.getItem('token');

      const response = await fetch('http://localhost:8080/api/play/answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${storedToken}`,
        },
        body: JSON.stringify({
          answer: userInput, // Send the user input as the answer
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('Response:', responseData); // Log the response
        handleAnswerResponse(responseData); // Handle the response for the answer
      } else {
        console.error('Error submitting answer');
      }
    } catch (error) {
      console.error('Error:', error);
    }

    setSubmittedWords([...submittedWords, userInput]);
    setUserInput('');
  };

  const handleWordButtonClick = async (word) => {
    try {
      const storedToken = localStorage.getItem('token');

      const response = await fetch('http://localhost:8080/api/play/answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${storedToken}`,
        },
        body: JSON.stringify({
          answer: word, // Send the selected word as the answer
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('Response:', responseData); // Log the response
        handleAnswerResponse(responseData); // Handle the response for the chosen word
      } else {
        console.error('Error submitting answer');
      }
    } catch (error) {
      console.error('Error:', error);
    }

    setSubmittedWords([...submittedWords, word]);
  };

  const uniqueWordsToShow = [...new Set(uniqueWords)];

  const newQuestion = async () => {
    const storedToken = localStorage.getItem('token');
    const responseQuestion = await fetch('http://localhost:8080/api/play/new-question', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${storedToken}`,
      },
    });

    if (responseQuestion.ok) {
      const questionData = await responseQuestion.json();
      setQuestion(questionData);
      setPhotos(questionData.photos);
      setGameStarted(true);
    } else {
      console.error('Error fetching new question');
    }
  }


  const handleAnswerResponse = (responseData) => {
    if (!responseData.lastQuestionWasRight) {
      setLastQuestion(false);
    } else {
      setLastQuestion(true);
      setScore(responseData.score); // Set the score from the response data
    }

    if(responseData.wrongAnswers <= 2) {
      console.log("new question")
      newQuestion();
    }
    else {
      setGameFinished(true);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <Typography variant="h3" gutterBottom>
        Welcome to the Game!
      </Typography>

      <Typography variant="h5" style={{ marginBottom: '20px' }}>
        Score: {score} {/* Display the score */}
      </Typography>

      {gameFinished && <div>Finished L</div>}

      {!gameFinished && (!gameStarted? (
        <div>
          <Select
            value={selectedDifficulty}
            onChange={handleDifficultyChange}
            style={{ marginBottom: '20px' }}
          >
            <MenuItem value="EASY">Easy</MenuItem>
            <MenuItem value="HARD">Hard</MenuItem>
          </Select>

          <Button variant="contained" color="primary" onClick={handleStartGame}>
            Start Game
          </Button>
        </div>
      ) : (
        <div>
          <Typography variant="h5" style={{ marginTop: '20px' }}>
            Choose
          </Typography>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
            {photos.map((photo, index) => (
              <div key={index} style={{ margin: '10px' }}>
                <img src={photo.url} alt={`Photo ${index}`} style={{ width: '300px', height: '200px' }} />
              </div>
            ))}
          </div>
          {selectedDifficulty === 'EASY' && (
            <div style={{ marginTop: '10px' }}>
              {uniqueWordsToShow.map((word, wordIndex) => (
                <Button
                  key={wordIndex}
                  variant="contained"
                  color="primary"
                  style={{ margin: '5px' }}
                  onClick={() => handleWordButtonClick(word)} // Send the chosen word as the answer
                >
                  {word}
                </Button>
              ))}
            </div>
          )}
          {selectedDifficulty === 'HARD' && (
            <div style={{ marginTop: '20px' }}>
              <TextField
                label="Enter Word"
                variant="outlined"
                value={userInput}
                onChange={handleInputChange}
                style={{ marginRight: '10px' }}
              />
              <Button variant="contained" color="primary" onClick={handleSubmit}>
                Submit
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default GamePage;
