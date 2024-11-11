let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let matchedCards = 0;
let totalPairs = 18; // 18 pairs (36 cards)
let timer;
let timeElapsed = 0;
let moves = 0; // Track moves
let isPaused = false;

const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R'];
const shuffledCards = [...letters, ...letters]; // Duplicate for pairs

// Shuffle the cards using Fisher-Yates algorithm
function shuffleCards() {
    for (let i = shuffledCards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledCards[i], shuffledCards[j]] = [shuffledCards[j], shuffledCards[i]]; // Swap
    }
}

// Create the cards dynamically and add them to the game board
function createCards() {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = ''; // Clear any existing cards
    shuffledCards.forEach((letter, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.id = letter;
        card.innerHTML = `
            <div class="card-front">?</div>
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
    moves++; // Increment move counter

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
    matchedCards += 2; // Increment matched cards
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

// Display the win message
function displayWinMessage() {
    // Celebration Animation
    triggerCelebration();

    // Display win message
    document.getElementById('win-message').classList.remove('hidden');
}

// Start the timer
function startTimer() {
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
function startGame() {
    document.getElementById('welcome-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    shuffleCards();
    createCards();
    startTimer();
}

// Reset the game
function resetGame() {
    matchedCards = 0;
    moves = 0;
    timeElapsed = 0;
    document.getElementById('moves').textContent = `Moves: ${moves}`;
    document.getElementById('timer').textContent = `Time: ${timeElapsed}s`;
    shuffleCards();
    createCards();
    document.getElementById('win-message').classList.add('hidden');
    stopTimer();
    startTimer();
    document.getElementById('celebration').classList.add('hidden');
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
    // Play the celebration animations
    document.getElementById('celebration').classList.remove('hidden');

    // Create confetti animation or any other effect you want
    setTimeout(() => {
        document.getElementById('celebration').classList.add('hidden');
    }, 5000);
}

// Handle Play Again Button
document.getElementById('play-again').addEventListener('click', resetGame);
