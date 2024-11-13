let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let matchedCards = 0;
let totalPairs = 18; // Default to 18 pairs (36 cards) for "Hard" difficulty
let timer;
let timeElapsed = 0;
let moves = 0; // Track moves
let isPaused = false;
let bestTimeRecord = null;

const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R'];
let shuffledCards = [];
const gameBoard = document.getElementById('game-board');

// Shuffle the cards using Fisher-Yates algorithm
function shuffleCards() {
    for (let i = shuffledCards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledCards[i], shuffledCards[j]] = [shuffledCards[j], shuffledCards[i]];
    }
}

// Create cards dynamically and add them to the game board
function createCards() {
    gameBoard.innerHTML = '';
    shuffledCards.forEach((letter) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.id = letter;
        card.innerHTML = `
            <div class="card-front">$</div>
            <div class="card-back">${letter}</div>
        `;
        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
    });
}

// Handle the card flip
function flipCard() {
    if (lockBoard || this === firstCard || isPaused) return;

    this.classList.add('flipped');
    moves++;

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    checkForMatch();
}

// Check if the two flipped cards match
function checkForMatch() {
    const isMatch = firstCard.dataset.id === secondCard.dataset.id;
    isMatch ? disableCards() : unflipCards();
}

// Disable matched cards
function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    matchedCards += 2;
    resetBoard();

    if (checkForWin()) {
        setTimeout(displayWinMessage, 500);
    }
}

// Unflip the cards if they don't match
function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetBoard();
    }, 1000);
}

// Reset the board state
function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

// Check if all cards are matched
function checkForWin() {
    return matchedCards === totalPairs * 2;
}

// Display the win message with time record
function displayWinMessage() {
    clearInterval(timer);
    const winMessage = document.getElementById('win-message');
    winMessage.classList.remove('hidden');
    const timeRecord = document.getElementById('time-record');
    timeRecord.textContent = `Time Taken: ${timeElapsed}s`;

    if (!bestTimeRecord || timeElapsed < bestTimeRecord) {
        bestTimeRecord = timeElapsed;
        document.getElementById('best-time').textContent = `Best Time: ${bestTimeRecord}s`;
    }
}

// Start the timer
function startTimer() {
    document.getElementById('restart-button').classList.remove('hidden');
    timer = setInterval(() => {
        timeElapsed++;
        document.getElementById('timer').textContent = `Time: ${timeElapsed}s`;
    }, 1000);
}

// Stop the timer
function stopTimer() {
    clearInterval(timer);
}

// Start the game
function startGame(difficulty = "hard") {
    matchedCards = 0;
    moves = 0;
    timeElapsed = 0;
    document.getElementById('moves').textContent = `Moves: ${moves}`;
    document.getElementById('timer').textContent = `Time: ${timeElapsed}s`;
    document.getElementById('win-message').classList.add('hidden');

    totalPairs = difficulty === "easy" ? 6 : difficulty === "medium" ? 12 : 18;
    shuffledCards = [...letters.slice(0, totalPairs), ...letters.slice(0, totalPairs)];
    shuffleCards();
    createCards();

    document.getElementById('welcome-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');

    stopTimer();
    startTimer();
}

// Reset the game
function resetGame() {
    startGame();
}

// Pause the game
function pauseGame() {
    isPaused = true;
    stopTimer();
}

// Resume the game
function resumeGame() {
    isPaused = false;
    startTimer();
}

// Trigger celebration animation
function triggerCelebration() {
    document.getElementById('celebration').classList.remove('hidden');
    setTimeout(() => {
        document.getElementById('celebration').classList.add('hidden');
    }, 5000);
}

// Difficulty level selection
function setDifficulty(level) {
    alert(`Difficulty set to ${level.toUpperCase()}`);
    startGame(level);
}

// Event listeners for difficulty and reset
document.getElementById('easy-level').addEventListener('click', () => setDifficulty("easy"));
document.getElementById('medium-level').addEventListener('click', () => setDifficulty("medium"));
document.getElementById('hard-level').addEventListener('click', () => setDifficulty("hard"));
document.getElementById('play-again').addEventListener('click', resetGame);
document.getElementById('restart-button').addEventListener('click', resetGame);
