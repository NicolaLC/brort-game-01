import {opponentCards, playerCards, playerDeck, playerTurn} from "./logic";

const opponentSide = document.getElementById("opponent-side");
const opponentDeckCells = opponentSide.querySelectorAll(".deck-grid-cell");

const playerSide = document.getElementById("player-side");
const playerCardsCells = playerSide.querySelectorAll(".deck-grid-cell");
const playerDeckContainer = playerSide.querySelector(".player-deck");

const log = document.querySelector(".log");

let modal;

const render = () => {
	renderOpponent();
	renderPlayer();

	log.innerHTML = playerTurn ? `Your turn! <span>Press <b>[SPACE]</b> to draw, <b>[ESC]</b> to exit.</span>` : "Opponent Turn!";
}

const clear = () => {
	opponentDeckCells.forEach(element => {
		element.innerHTML = "";
	});

	playerCardsCells.forEach(element => {
		element.innerHTML = "";
	});

	playerDeckContainer.innerHTML = "";
	if (modal != null) {
		modal.close();
	}

	log.innerHTML= "";
}

const renderOpponent = () => {
	opponentCards.forEach((card, index) => {
		opponentDeckCells[index].innerHTML = `<div class="card">${card}</div>`;
	});
}

const renderPlayer = () => {
	playerCards.forEach((card, index) => {
		playerCardsCells[index].innerHTML = `<div class="card">${card}</div>`;
	});

	let result = "";
	playerDeck.forEach(card => {
		const bUsed = playerCards.indexOf(card) > -1;
		result += `<div class="card ${bUsed ? "used" : ""}">${card}</div>`;
	});

	playerDeckContainer.innerHTML = result;
}

const showModal = (title, content, proceedLabel, cancelLabel, onProceed, onCancel) => {
	const html = `
			<div class="dialog-title">
				${title}
			</div>
			<div class="dialog-content">
				${content}
			</div>
			<div class="dialog-actions">
			</div>
		`;

	if (modal == null) {
		const newModal = document.createElement("dialog");
		newModal.classList.add("modal");
		newModal.innerHTML = html;

		modal = document.body.appendChild(newModal);
	} else {
		modal.innerHTML = html;
	}

	const actions = modal.querySelector(".dialog-actions");

	if (cancelLabel) {
		const cancelButton = document.createElement("button");
		cancelButton.innerHTML = cancelLabel;
		cancelButton.addEventListener("click", () => {
			modal.close();
			if (onCancel)
			{
				onCancel();
			}
		});
		actions.appendChild(cancelButton);
	}


	const proceedButton = document.createElement("button");
	proceedButton.innerHTML = proceedLabel;
	proceedButton.addEventListener("click", () => {
		modal.close();
		if (onProceed)
		{
			onProceed();
		}
	});

	actions.appendChild(proceedButton);
	modal.showModal();
}

export {render, clear, showModal};