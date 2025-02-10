// Variables
const colors = ["red", "green", "blue", "yellow"];
let sequence = [];
let playerSequence = [];
let score = 0;
let highScores = JSON.parse(localStorage.getItem("highScores")) || {}; // Obtener o inicializar highScores

const colorButtons = document.querySelectorAll(".color-button");
const startButton = document.getElementById("start-button");
const scoreDisplay = document.getElementById("score");
const highScoresTable = document.querySelector("#high-scores table tbody");

// Funciones

function startGame() {
  sequence = [];
  playerSequence = [];
  score = 0;
  scoreDisplay.textContent = "Puntuación: " + score;
  startButton.disabled = true; // Deshabilitar el botón de inicio durante el juego
  generateSequence();
  showSequence();
}

function generateSequence() {
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  sequence.push(randomColor);
}

function showSequence() {
  let i = 0;
  const interval = setInterval(() => {
    const color = sequence[i];
    const button = document.getElementById(color);
    activateButton(button);
    i++;
    if (i >= sequence.length) {
      clearInterval(interval);
    }
  }, 500); // Mostrar cada color durante 500ms
}

function activateButton(button) {
  button.classList.add("active");
  setTimeout(() => {
    button.classList.remove("active");
  }, 300); // Desactivar la clase "active" después de 300ms
}

function handlePlayerInput(event) {
  const color = event.target.id;
  playerSequence.push(color);
  const playerIndex = playerSequence.length - 1;

  if (playerSequence[playerIndex] !== sequence[playerIndex]) {
    endGame();
    return;
  }

  if (playerSequence.length === sequence.length) {
    playerSequence = [];
    score++;
    scoreDisplay.textContent = "Puntuación: " + score;
    generateSequence();
    showSequence();
  }
}

function endGame() {
    gameOverMessage.style.display = "block"; // Mostrar el mensaje de Game Over
    gameOverMessage.querySelector("#final-score").textContent = score; // Mostrar el puntaje final
    setTimeout(() => {
      gameOverMessage.style.display = "none";
      updateHighScores(); // Llamar a updateHighScores después de que se oculta el mensaje
      startGame(); // Reiniciar el juego automáticamente
    }, 3000); // Ocultar el mensaje después de 3 segundos y reiniciar el juego

    startButton.disabled = false; // Habilitar el botón de inicio
  
}

function updateHighScores() {
  const playerName = prompt("Ingresa tu nombre:");
  if (playerName) {
    highScores[playerName] = score;
    localStorage.setItem("highScores", JSON.stringify(highScores));
    renderHighScores();
  }
}

function renderHighScores() {
  highScoresTable.innerHTML = ""; // Limpiar la tabla
  const sortedScores = Object.entries(highScores).sort(([, a], [, b]) => b - a); // Ordenar por puntaje
  sortedScores.forEach(([name, score]) => {
    const row = highScoresTable.insertRow();
    const nameCell = row.insertCell();
    const scoreCell = row.insertCell();
    nameCell.textContent = name;
    scoreCell.textContent = score;
  });
}

// Eventos
startButton.addEventListener("click", startGame);
colorButtons.forEach((button) => {
  button.addEventListener("click", handlePlayerInput);
});

// Inicialización
renderHighScores(); // Mostrar los puntajes al cargar la página