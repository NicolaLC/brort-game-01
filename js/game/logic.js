import {DECK_CARDS, EGameResult} from "../constants";
import {clear, render, showModal} from "./graphics";

const consoleContainer = document.getElementById('console');

let playerDeck = [];
let playerCards = [];

let opponentDeck = [];
let opponentCards = [];

let playerWins = 0;
let opponentWins = 0;

let currentLevel = 1;
const maxLevel = 21;

let playerTurn = true;

const writeToConsole = (message) => {
	consoleContainer.innerHTML += `${message ? message : ""}</br>`;
	render();
}

const clearConsole = () => {
	consoleContainer.innerHTML = "";
	clear();
}

const intro = () => {
	clearConsole();
	startGame();
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
	playerCards.push(getRandomCardFromDeck(deck, playerCards));

	return deck;
}

const getRandomCard = (deck, cards) => {
	if(deck.length === 0) {
		return DECK_CARDS.random();
	}

	let availableCards = cards.filter(c => deck.indexOf(c) < 0);

	if(availableCards.length === 0) {
		availableCards = DECK_CARDS;
	}

	return availableCards.random();
}

const getRandomCardFromDeck = (deck, cards) => {
	if(deck.length === 0) {
		return DECK_CARDS.random();
	}

	let availableCards = deck.filter(c => cards.indexOf(c) < 0);

	if(availableCards.length === 0) {
		availableCards = DECK_CARDS;
	}

	return availableCards.random();
}

const waitForPlayerActions = () => {
	playerTurn = true;

	const onKeyHandler = (e) => {
		if (e.keyCode === 32) {
			e.preventDefault();
			e.stopImmediatePropagation();
			document.removeEventListener('keydown', onKeyHandler);
			clearConsole();
			playerTurn = false;
			drawAnotherCard();
		}

		if (e.keyCode === 27) {
			e.preventDefault();
			e.stopImmediatePropagation();
			document.removeEventListener('keydown', onKeyHandler);
			clearConsole();
			playerTurn = false;
			stopDrawing();
		}
	}

	document.addEventListener('keydown', onKeyHandler);
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
}

const startGame = () => {
	playerDeck = getStarterDeck();

	opponentDeck = getRandomDeck();
	opponentCards = [opponentDeck.random()];

	waitForPlayerActions();
	drawGameBoard();
}

const drawAnotherCard = () => {
	if (playerCards.length === playerDeck.length || playerCards.length >= 5) {
		stopDrawing();
		return;
	}

	playerCards.push(getRandomCardFromDeck(playerDeck, playerCards));

	if (playerCards.length === 1) {
		playerCards.push(getRandomCardFromDeck(playerDeck, playerCards));
	}

	drawGameBoard();

	setTimeout(() => {
		opponentCards.push(DECK_CARDS.random());
		waitForPlayerActions();
		drawGameBoard();
	}, 2000);
}

const clearCards = () => {
	playerCards = [];
	opponentCards = [];
}

const stopDrawing = () => {
	while (opponentCards.length < playerCards.length) {
		opponentCards.push(DECK_CARDS.random());
	}

	drawGameBoard(false);

	setTimeout(() => {
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

		let modalContent = "";
		switch (gameResult) {
			case EGameResult.Win:
				playerWins++;
				modalContent = "You Win!";
				break;
			case EGameResult.Lose:
				opponentWins++;
				modalContent = "You Lose!";
				break;
			case EGameResult.Tie:
				modalContent = "Tie!";
				break;
		}

		showModal("Turn ended.", modalContent, "[<b>SPACEBAR</b>] continue.", "", () => {
			if (playerWins < 2 && opponentWins < 2) {
				clearConsole();
				drawAnotherCard();
			} else {
				turnEnded();
			}
		});
	}, 2000);
}

const turnEnded = () => {
	if (playerWins === 2) {
		newLevel();
	} else {
		window.location.reload();
	}
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

	showModal(
		"Choose a new card.",
		`Choose a card to add to your deck:`,
		`[2] <b>${cards[1]}</b>`, `[1] <b>${cards[0]}</b>`,
		() => {
			playerDeck.push(cards[1]);
			clearConsole();
			drawAnotherCard();
		},
		() => {
			playerDeck.push(cards[0]);
			clearConsole();
			drawAnotherCard();
		}
	);

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

export {intro, playerCards, opponentCards, playerDeck, playerTurn};
