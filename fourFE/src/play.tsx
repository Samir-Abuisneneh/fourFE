import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";

const GamePage = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [question, setQuestion] = useState({});
  const [selectedDifficulty, setSelectedDifficulty] = useState("EASY");
  const [photos, setPhotos] = useState([]);
  const [uniqueWords, setUniqueWords] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [submittedWords, setSubmittedWords] = useState([]);
  const [lastQuestion, setLastQuestion] = useState(true);
  const [score, setScore] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [lives, setLives] = useState(3);
  const [warningMessage, setWarningMessage] = useState("");

  useEffect(() => {
    if (question.words) {
      const uniqueWordsArray = [
        ...new Set(question.words.map((wordData) => wordData.word)),
      ];
      setUniqueWords(uniqueWordsArray);
    }
  }, [question]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login"); // Assuming '/login' is the login page route
  };

  const handleStartGame = async () => {
    try {
      const storedToken = localStorage.getItem("token");

      const responseGame = await fetch(
        "http://localhost:8080/api/play/new-game",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}`,
          },
          body: JSON.stringify({
            difficulty: selectedDifficulty,
          }),
        }
      );

      if (responseGame.ok) {
        const responseQuestion = await fetch(
          "http://localhost:8080/api/play/new-question",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          }
        );

        if (responseQuestion.ok) {
          const questionData = await responseQuestion.json();
          setQuestion(questionData);
          setPhotos(questionData.photos);
          setGameStarted(true);
        } else {
          console.error("Error fetching new question");
        }
      } else {
        console.error("Error starting new game");
      }
    } catch (error) {
      console.error("Error:", error);
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
      const storedToken = localStorage.getItem("token");

      const response = await fetch("http://localhost:8080/api/play/answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`,
        },
        body: JSON.stringify({
          answer: userInput,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("Response:", responseData);
        handleAnswerResponse(responseData);
      } else {
        console.error("Error submitting answer");
      }
    } catch (error) {
      console.error("Error:", error);
    }

    setSubmittedWords([...submittedWords, userInput]);
    setUserInput("");
  };

  const handleWordButtonClick = async (word) => {
    try {
      const storedToken = localStorage.getItem("token");

      const response = await fetch("http://localhost:8080/api/play/answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`,
        },
        body: JSON.stringify({
          answer: word,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("Response:", responseData);
        handleAnswerResponse(responseData);
      } else {
        console.error("Error submitting answer");
      }
    } catch (error) {
      console.error("Error:", error);
    }

    setSubmittedWords([...submittedWords, word]);
  };

  const handlePlayAgain = () => {
    setGameStarted(false);
    setQuestion({});
    setSelectedDifficulty("EASY");
    setPhotos([]);
    setUniqueWords([]);
    setUserInput("");
    setSubmittedWords([]);
    setLastQuestion(true);
    setScore(0);
    setGameFinished(false);
    setLives(3);
    setWarningMessage("");
  };

  const navigate = useNavigate();

  const handleLeaderboardClick = () => {
    navigate("/leaderboard");
  };

  const uniqueWordsToShow = [...new Set(uniqueWords)];

  const newQuestion = async () => {
    const storedToken = localStorage.getItem("token");
    const responseQuestion = await fetch(
      "http://localhost:8080/api/play/new-question",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      }
    );

    if (responseQuestion.ok) {
      const questionData = await responseQuestion.json();
      setQuestion(questionData);
      setPhotos(questionData.photos);
      setGameStarted(true);
    } else {
      console.error("Error fetching new question");
    }
  };

  const handleAnswerResponse = (responseData) => {
    if (!responseData.lastQuestionWasRight) {
      setLastQuestion(false);
      setLives((prevLives) => prevLives - 1);
      setWarningMessage("Wrong answer! Try again.");
    } else {
      setLastQuestion(true);
      setScore(responseData.score);
      setWarningMessage("");
    }

    if (responseData.wrongAnswers <= 2) {
      console.log("new question");
      newQuestion();
    } else {
      setGameFinished(true);
    }
  };

  const WarningMessage = ({ message }) => (
    <Typography variant="body1" style={{ color: "red", marginTop: "10px" }}>
      {message}
    </Typography>
  );

  return (
    <div
      style={{ textAlign: "center", marginTop: "50px", position: "relative" }}
    >
      <Button
        variant="outlined"
        color="secondary"
        style={{
          position: "fixed",
          left: "20%",
          top: "20%",
          background: "linear-gradient(45deg, #FE6B8B 20%, #FF8E53 50%)",
          color: "white",
        }}
        onClick={handleLogout}
      >
        Logout
      </Button>

      {!gameFinished && (
        <Typography variant="h3" gutterBottom>
          Welcome to the Game!
        </Typography>
      )}

      {gameFinished && (
        <div>
          <Typography
            variant="h4"
            style={{ marginBottom: "20px", color: "green" }}
          >
            Nice Try! Your final score: {score}
          </Typography>
          <Button variant="contained" color="primary" onClick={handlePlayAgain}>
            Play Again
          </Button>

          <Button
            variant="contained"
            color="secondary"
            onClick={handleLeaderboardClick}
            style={{ marginLeft: "10px" }}
          >
            Leaderboard
          </Button>
        </div>
      )}

      {!gameFinished && !gameStarted ? (
        <div>
          <Select
            value={selectedDifficulty}
            onChange={handleDifficultyChange}
            style={{
              marginBottom: "20px",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
            }}
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
          {lives > 0 ? (
            <>
              <Typography variant="h5" style={{ marginBottom: "20px" }}>
                Score: {score}
              </Typography>

              <Typography variant="h5" style={{ marginTop: "20px" }}>
                Choose
              </Typography>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                {photos.map((photo, index) => (
                  <div key={index} style={{ margin: "10px" }}>
                    <img
                      src={photo.url}
                      alt={`Photo ${index}`}
                      style={{ width: "300px", height: "200px" }}
                    />
                  </div>
                ))}
              </div>

              {selectedDifficulty === "EASY" && (
                <div style={{ marginTop: "10px" }}>
                  {uniqueWordsToShow.map((word, wordIndex) => (
                    <Button
                      key={wordIndex}
                      variant="contained"
                      color="primary"
                      style={{ margin: "5px" }}
                      onClick={() => handleWordButtonClick(word)}
                    >
                      {word}
                    </Button>
                  ))}
                </div>
              )}
              {selectedDifficulty === "HARD" && (
                <div style={{ marginTop: "20px" }}>
                  <TextField
                    label="Enter Word"
                    variant="outlined"
                    value={userInput}
                    onChange={handleInputChange}
                    style={{
                      marginRight: "10px",
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                    }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                  >
                    Submit
                  </Button>
                </div>
              )}

              <Typography variant="h6" style={{ marginBottom: "20px" }}>
                Lives: {lives}
              </Typography>

              {warningMessage && <WarningMessage message={warningMessage} />}
            </>
          ) : (
            <div>
              <Typography
                variant="h4"
                style={{ marginBottom: "20px", color: "green" }}
              ></Typography>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GamePage;
