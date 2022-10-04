import {DECK_CARDS, EGameResult} from "./constants";

const consoleContainer = document.getElementById('console');

let playerDeck = [];
let playerCards = [];

let opponentDeck = [];
let opponentCards = [];

let playerWins = 0;
let opponentWins = 0;

let currentLevel = 1;
const maxLevel = 21;

const writeToConsole = (message) => {
  consoleContainer.innerHTML += `${message ? message : ""}</br>`;
}

const clearConsole = () => {
  consoleContainer.innerHTML = "";
}

const intro = () => {

  writeToConsole("<b>Welcome player</b>");
  writeToConsole();
  writeToConsole("Press <b>[SPACEBAR]</b> to start a new game...");

  const onKeyHandler = (e) => {
    if (e.keyCode === 32) {
      document.removeEventListener('keydown', onKeyHandler);
      clearConsole();
      startGame();
    }
  }

  document.addEventListener('keydown', onKeyHandler);
}

const getScore = (deck) => {
  let result = 0;

  deck.forEach(card => {
    let cardScore = card.getScore();
    if(cardScore === 11 && result + cardScore > 21) {
      cardScore = 1;
    }

    result += cardScore;
  });

  return result;
}

const getRandomDeck = () => {
  const deck = [];

  while (deck.length < 3) {
    deck.push(getRandomCard(deck, DECK_CARDS));
  }

  return deck;
}

const getStarterDeck = () => {
  const deck = getRandomDeck(playerCards);

  if (getScore(deck) !== 21) {
    return getStarterDeck();
  }

  playerCards.push(deck.random());

  return deck;
}

const getRandomCard = (deck, cards) => {
  if(deck.length === 0) {
    return DECK_CARDS.random();
  }

  let availableCards = deck.filter(c => cards.indexOf(c) < 0);

  if(availableCards.length === 0) {
    availableCards = DECK_CARDS;
  }

  return availableCards.random();
}

const drawGameBoard = (bProceed = true) => {
  clearConsole();

  writeToConsole(`<h1>Level ${currentLevel} of ${maxLevel}</h1>`);
  writeToConsole();

  writeToConsole(`<h2>Player: ${playerWins} Opponent: ${opponentWins}</h2>`);
  writeToConsole();

  writeToConsole(`<b class="player-log">Your deck</b>: ${playerDeck.join(", ")}`);
  writeToConsole();
  writeToConsole(`<b class="player-log">Your cards</b>: ${playerCards.join(", ")}`);
  writeToConsole(`<b class="player-log">Your score</b>: ${getScore(playerCards)}`);

  writeToConsole();
  writeToConsole(`<b class="opponent-log">Opponent cards</b>: ${opponentCards.join(", ")}`);
  writeToConsole(`<b class="opponent-log">Opponent score</b>: ${getScore(opponentCards)}`);

  writeToConsole();

  if (bProceed) {
    writeToConsole("Press <b>[SPACEBAR]</b> to draw, or <b>[ESC]</b> to stop.");

    const onKeyHandler = (e) => {
      if (e.keyCode === 32) {
        document.removeEventListener('keydown', onKeyHandler);
        clearConsole();
        drawAnotherCard();
      }

      if (e.keyCode === 27) {
        document.removeEventListener('keydown', onKeyHandler);
        clearConsole();
        stopDrawing();
      }
    }

    document.addEventListener('keydown', onKeyHandler);
  }
}

const startGame = () => {
  playerDeck = getStarterDeck();

  opponentDeck = getRandomDeck();
  opponentCards = [opponentDeck.random()];

  drawGameBoard();
}

const drawAnotherCard = () => {
  if (playerCards.length === playerDeck.length || playerCards.length >= 5) {
    stopDrawing();
    return;
  }

  playerCards.push(getRandomCard(playerDeck, playerCards));
  opponentCards.push(getRandomCard(opponentDeck, opponentCards));

  drawGameBoard();
}

const clearCards = () => {
  playerCards = [];
  opponentCards = [];
}

const stopDrawing = () => {
  if (opponentCards.length < opponentDeck.length) {
    opponentCards.push(opponentDeck.random());
  }
  drawGameBoard(false);

  let playerScore = getScore(playerCards);
  let opponentScore = getScore(opponentCards);

  clearCards();

  let gameResult = EGameResult.Tie;

  if (playerScore !== opponentScore)
  {
    if (playerScore === 21) {
      gameResult = EGameResult.Win;
    }
    else if (playerScore < 21) {
      if (opponentScore < playerScore) {
        gameResult = EGameResult.Win;
      } else if(opponentScore < 21) {
        gameResult = EGameResult.Lose;
      } else {
        gameResult = EGameResult.Win;
      }
    } else {
      if (opponentScore > playerScore) {
        gameResult = EGameResult.Win;
      } else { // playerScore > opponentScore || opponentScore <= 21
        gameResult = EGameResult.Lose;
      }
    }
  }

  switch (gameResult) {
    case EGameResult.Win:
      playerWins++;
      writeToConsole(`<b>Player Wins</b>`);
      break;
    case EGameResult.Lose:
      opponentWins++;
      writeToConsole(`<b>Opponent Wins</b>`);
      break;
    case EGameResult.Tie:
      writeToConsole(`<b>Tie</b>`);
      break;
  }

  if (playerWins < 2 && opponentWins < 2) {
    writeToConsole("Press <b>[SPACEBAR]</b> to proceed.");

    const onKeyHandler = (e) => {
      if (e.keyCode === 32) {
        document.removeEventListener('keydown', onKeyHandler);
        clearConsole();
        drawAnotherCard();
      }
    }

    document.addEventListener('keydown', onKeyHandler);
  } else {
    showEndGame();
  }
}

const showEndGame = () => {
  if (playerWins === 2) {
    writeToConsole("Congratulations, you win this match!");
    writeToConsole("Press <b>[SPACEBAR]</b> to proceed.");
  } else {
    writeToConsole("Oh no, you lose this match!");
    writeToConsole("Press <b>[SPACEBAR]</b> to restart.");
  }

  const onKeyHandler = (e) => {
    if (e.keyCode === 32) {
      document.removeEventListener('keydown', onKeyHandler);
      if (playerWins === 2) {
        newLevel();
      } else {
        window.location.reload();
      }
    }
  }

  document.addEventListener('keydown', onKeyHandler);
}

const newLevel = () => {
  currentLevel++;

  if (currentLevel > maxLevel) {
    if (confirm("E bravo nabbetto, ce l'hai fatta hai vinto!")) {
      window.location.reload();
    } else {
      window.location.reload();
    }
  } else {
    playerWins = 0;
    opponentWins = 0;
    clearConsole();
    chooseRandomCard();
  }
}

const chooseRandomCard = () => {
  const cards = [DECK_CARDS.random(), DECK_CARDS.random()];

  writeToConsole(`Choose a card to add to your deck: <b>[1] ${cards[0]}</b> <b>[2] ${cards[1]}</b>`);

  const onKeyHandler = (e) => {
    if (e.keyCode === 49) {
      document.removeEventListener('keydown', onKeyHandler);
      playerDeck.push(cards[0]);
      clearConsole();
      drawAnotherCard();
    }

    if (e.keyCode === 50) {
      document.removeEventListener('keydown', onKeyHandler);
      playerDeck.push(cards[1]);
      clearConsole();
      drawAnotherCard();
    }
  }

  document.addEventListener('keydown', onKeyHandler);
}

(
  () => {
    intro();
  }
)();
