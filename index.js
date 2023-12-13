const gameStats = {
  playerMove: null,
  computerMove: null,
  score: {
    player: 0,
    computer: 0,
  },
  roundOutcome: null,
  isAutoPlay: false,
  totalMatchesPlayed: 0,
};
const validMoves = ["Rock", "Paper", "Scissor"];

const validMovesButtons = document.querySelectorAll(".valid-moves .move");
const restartButton = document.querySelector(".restart button");

const playerScoreSpan = document.querySelector(".score-board .player-score");
const computerScoreSpan = document.querySelector(
  ".score-board .computer-score"
);

const gameResultDiv = document.querySelector(".game-interface .result");
const playerMoveSpan = document.querySelector(".players-moves .player-move");
const computerMoveSpan = document.querySelector(
  ".players-moves .computer-move"
);
const gameOutcomeDiv = document.querySelector(".game-outcome");
const gameOutcomeContentSpan = document.querySelector(".game-outcome .content");
const autoPlayButton = document.querySelector(".autoplay button");

let autoPlayIntervalId;

const gameInterface = document.querySelector(".game-interface");
const welcomeInterface = document.querySelector(".welcome-interface");
const playAgainInterface = document.querySelector(".gameover-interface");
const startButton = document.querySelector(".welcome-interface .start");
const playAgainButton = document.querySelector(
  ".gameover-interface .play-again"
);

const gameOverInterfaceHeader = document.querySelector(
  ".gameover-interface h2"
);
const statsTable = document.querySelector(".gameover-interface .stats");

window.addEventListener("DOMContentLoaded", initApp);

function initApp() {
  validMovesButtons.forEach((button) => {
    const playerMoveName = button.getAttribute("data-move-name");
    button.addEventListener("click", () => {
      if (autoPlayIntervalId) {
        stopAutoPlay();
      }
      playTheGame(playerMoveName);
    });
  });

  restartButton.addEventListener("click", resetAll);
  autoPlayButton.addEventListener("click", autoPlay);
  startButton.addEventListener("click", start);
  playAgainButton.addEventListener("click", playAgain);
  welcomeInterface.classList.add("grow");
}

function playTheGame(playerMove) {
  console.log("game started");
  gameStats.totalMatchesPlayed++;
  gameStats.computerMove = getRandomMove();
  gameStats.playerMove = playerMove;
  checkWinner();
  showResult();
}

function resetAll() {
  gameResultDiv.classList.add("hidden");
  gameStats.computerMove = null;
  gameStats.playerMove = null;
  gameStats.score.computer = 0;
  gameStats.score.player = 0;
  gameStats.totalMatchesPlayed = 0;
  computerScoreSpan.textContent = "0";
  playerScoreSpan.textContent = "0";
  playerMoveSpan.textContent = "";
  computerMoveSpan.textContent = "";
  autoPlayButton.textContent = "AutoPlay";
  autoPlayButton.classList = "";

  if (autoPlayIntervalId) {
    clearInterval(autoPlayIntervalId);
  }
}

function checkWinner() {
  const { playerMove, computerMove, score } = gameStats;

  if (playerMove == computerMove) {
    gameStats.roundOutcome = "draw";
    return;
  }

  switch (playerMove) {
    case "Rock":
      if (computerMove == "Paper") {
        gameStats.roundOutcome = "loss";
        score.computer++;
      } else if (computerMove == "Scissor") {
        gameStats.roundOutcome = "win";
        score.player++;
      }
      break;
    case "Paper":
      if (computerMove == "Rock") {
        gameStats.roundOutcome = "loss";
        score.player++;
      } else if (computerMove == "Scissor") {
        gameStats.roundOutcome = "loss";
        score.computer++;
      }
      break;
    case "Scissor":
      if (computerMove == "Rock") {
        gameStats.roundOutcome = "loss";
        score.computer++;
      } else if (computerMove == "Paper") {
        gameStats.roundOutcome = "win";
        score.player++;
      }
      break;
    default:
      throw new Error("Invalid Player Move");
  }
}

function showResult() {
  const { score, roundOutcome, computerMove, playerMove } = gameStats;

  if (gameResultDiv.classList.contains("hidden")) {
    gameResultDiv.classList.remove("hidden");
  }
  computerScoreSpan.textContent = score.computer;
  playerScoreSpan.textContent = score.player;
  playerMoveSpan.textContent = playerMove;
  computerMoveSpan.textContent = computerMove;
  gameOutcomeDiv.className = `game-outcome ${roundOutcome}`;
  gameOutcomeContentSpan.textContent = roundOutcome;

  if (gameStats.totalMatchesPlayed == 10) {
    if (gameStats.isAutoPlay) {
      stopAutoPlay();
    }
    gameStats.totalMatchesPlayed = 0;
    gameOver();
  }
}

function getRandomMove() {
  return validMoves[Math.floor(Math.random() * validMoves.length)];
}

function autoPlay() {
  if (gameStats.isAutoPlay) {
    stopAutoPlay();
  } else {
    startAutoPlay();
  }
}

function startAutoPlay() {
  autoPlayIntervalId = setInterval(() => {
    gameStats.totalMatchesPlayed++;
    gameStats.computerMove = getRandomMove();
    gameStats.playerMove = getRandomMove();
    checkWinner();
    showResult();
  }, 500);
  gameStats.isAutoPlay = true;

  autoPlayButton.classList.add("on");
  autoPlayButton.classList.remove("off");
  autoPlayButton.textContent = "On";
}
function stopAutoPlay() {
  clearInterval(autoPlayIntervalId);
  gameStats.isAutoPlay = false;
  autoPlayButton.classList.add("off");
  autoPlayButton.classList.remove("on");
  autoPlayButton.textContent = "Off";
}

function playAgain() {
  playAgainInterface.classList.remove("grow");
  playAgainInterface.classList.remove("hidden");
  playAgainInterface.classList.remove("animate");
  setTimeout(() => {
    welcomeInterface.classList.add("grow");
  }, 450);
}

function start() {
  welcomeInterface.classList.remove("grow");
  gameInterface.classList.remove("hidden");
  setTimeout(() => {
    gameInterface.classList.add("grow");
    gameInterface.classList.add("block");
  }, 450);
}

function gameOver() {
  gameInterface.classList.remove("grow");
  gameInterface.classList.remove("hidden");
  autoPlayIntervalId = null;
  if (gameStats.score.computer == gameStats.score.player) {
    gameOverInterfaceHeader.textContent = "Draw";
    gameOverInterfaceHeader.className = "draw";
    updateStatsTable("draw", "draw");
  } else if (gameStats.score.player > gameStats.score.computer) {
    gameOverInterfaceHeader.textContent = "You Win !";
    gameOverInterfaceHeader.className = "win";
    updateStatsTable("loser", "winner");
  } else {
    gameOverInterfaceHeader.textContent = "You lose.";
    gameOverInterfaceHeader.className = "loss";
    updateStatsTable("winner", "loser");
  }
  setTimeout(() => {
    playAgainInterface.classList.add("grow");

    setTimeout(() => {
      playAgainInterface.classList.add("animate");
    }, 400);
    resetAll();
  }, 450);
}

function updateStatsTable(computerOutcome, playerOutcome) {
  // computer total rounds won;
  statsTable.querySelector("tr:nth-child(2) td:nth-child(2)").textContent =
    gameStats.score.computer;
  // outcome
  statsTable.querySelector("tr:nth-child(2) td:nth-child(3)").textContent =
    computerOutcome;

  // Plyaer total rounds won;
  statsTable.querySelector("tr:nth-child(3) td:nth-child(2)").textContent =
    gameStats.score.player;
  // outcome
  statsTable.querySelector("tr:nth-child(3) td:nth-child(3)").textContent =
    playerOutcome;
}
