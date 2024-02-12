import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  FormControl,
  InputLabel,
  Toolbar,
  Select,
  MenuItem,
  TextField,
  Typography,
  Button
} from "@mui/material";
import { IPhoto, IQuestion } from "./types";
import { NavBarItem } from "./components";

const GamePage = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [question, setQuestion] = useState<IQuestion>({} as IQuestion);
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [photos, setPhotos] = useState<IPhoto[]>([]);
  const [uniqueWords, setUniqueWords] = useState<string[]>([]);
  const [userInput, setUserInput] = useState("");
  const [submittedWords, setSubmittedWords] = useState<string[]>([]);
  const [lastQuestion, setLastQuestion] = useState(true);
  const [score, setScore] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [lives, setLives] = useState(3);
  const [warningMessage, setWarningMessage] = useState("");
  const [userCoins, setUserCoins] = useState(0); // State to hold user's coins


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
    navigate("/login");
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

  const fetchUserCoins = async () => {
    try {
      const storedToken = localStorage.getItem("token");
      const response = await fetch("http://localhost:8080/api/user", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUserCoins(userData.coins);
      } else {
        console.error("Error fetching user's coins");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    // Fetch user's coins when the component mounts
    fetchUserCoins();
  }, []);
  

  const handleDifficultyChange = (event: any) => {
    setSelectedDifficulty(event.target.value);
  };

  const handleInputChange = (event: any) => {
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

  const handleWordButtonClick = async (word: string) => {
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
    setQuestion({} as IQuestion);
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

  const handleAnswerResponse = (responseData: any) => {
    if (!responseData.lastQuestionWasRight) {
      setLastQuestion(false);
      setLives((prevLives) => prevLives - 1);
      setWarningMessage("Wrong answer! Try again.");
    } else {
      setLastQuestion(true);
      setScore(responseData.score);
      setWarningMessage("");
    }
    console.log(responseData)
    if (responseData.wrongAnswers < responseData.maxLives) {
      console.log("new question");
      newQuestion();
    } else {
      setGameFinished(true);
    }
  };


  const handleBuyLives  = async () => {
    const storedToken = localStorage.getItem("token");
    const responseQuestion = await fetch(
      "http://localhost:8080/api/play/add-life",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      }
    );

    if (responseQuestion.ok) {
      setLives(lives + 1 )
    } else {
      console.error("Error Adding Lives ");
    }
  }

  return (
    <>
      <Box>
      <AppBar position="static">
  <Toolbar>
    <Typography align="left" variant="h6" component="div" sx={{ flexGrow: 1 }}>
      Four Game
    </Typography>
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h6" component="div" align="center">
        Coins: {userCoins} {/* Display user's coins */}
      </Typography>
    </Box>
    <Box>
      <NavBarItem color="inherit" href="/">Home</NavBarItem>
      <NavBarItem color="inherit" href="/play">Play </NavBarItem>
      <NavBarItem color="inherit" href="/leaderboard">Leader board</NavBarItem>
      <NavBarItem color="inherit" href="/payment/pay">Buy coins!</NavBarItem>
      <NavBarItem onClick={handleLogout} color="inherit">Logout</NavBarItem>
    </Box>
  </Toolbar>
</AppBar>

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
            <FormControl>
              <InputLabel id="difficulty">Difficulty</InputLabel>
              <Select
                labelId="difficulty"
                label="Difficulty"
                value={selectedDifficulty}
                onChange={handleDifficultyChange}
              >
                <MenuItem value="EASY">Easy</MenuItem>
                <MenuItem value="HARD">Hard</MenuItem>
              </Select>
              <Box height={16} />
              <Button variant="contained" color="primary" onClick={handleStartGame}>
                Start Game
              </Button>
            </FormControl>
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

                {warningMessage &&
                  <Typography variant="body1" style={{ color: "red", marginTop: "10px" }}>
                    {warningMessage}
                  </Typography>
                }
              </>
            ) : (
              <div>
                <Typography
                  variant="h4"
                  style={{ marginBottom: "20px", color: "green" }}
                ></Typography>
              </div>
            )}
            <div style={{ position: "absolute", bottom: 20, right: 20 }}>
              {/* Button to buy lives */}
              <Button
                variant="contained"
                color="primary"
                onClick={handleBuyLives}
                style={{ marginLeft: "10px" }}
              >
                Buy Lives
              </Button>
            </div>
          </div>
        )}
      </Box >
    </>
  );
};

export default GamePage;
