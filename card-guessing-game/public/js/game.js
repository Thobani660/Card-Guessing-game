let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;

function flipCard(card) {
    if (lockBoard || card === firstCard) return;
    card.classList.add('flipped');

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = card;
        return;
    }

    secondCard = card;
    checkForMatch();
}

function checkForMatch() {
    const isMatch = firstCard.dataset.id === secondCard.dataset.id;
    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    resetBoard();
    if (checkForWin()) displayWinMessage();
}

function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetBoard();
    }, 1500);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

function resetGame() {
    document.querySelectorAll('.card').forEach(card => card.classList.remove('flipped'));
    resetBoard();
    document.getElementById('win-message').classList.add('hidden');
}

function checkForWin() {
    return document.querySelectorAll('.card.flipped').length === 36;
}

function displayWinMessage() {
    document.getElementById('win-message').classList.remove('hidden');
}
