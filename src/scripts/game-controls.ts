import { CardReference, updateCount } from "./deck-controls";
import { findEligibleAction, moveCard } from "./move-controls";
import { createPlayer } from "./render-controls";

export function dealCards(
    gameBoard: HTMLElement,
    playersArea: HTMLElement,
    renderedDeck: HTMLElement[],
) {
    const playerCount = 2;
    const startingHandSize = 7;
    for (let playerIndex = 0; playerIndex < playerCount; playerIndex++) {
        if (gameBoard.classList.contains("distributed")) {
            gameBoard.appendChild(createPlayer(playerIndex + 1, playerCount));
            playersArea.remove();
        } else {
            playersArea.appendChild(createPlayer(playerIndex + 1, playerCount));
        }
        const player = document.querySelector(
            "#player" + (playerIndex + 1),
        )! as HTMLElement;
        for (let handIndex = 0; handIndex < startingHandSize; handIndex++) {
            moveCard(renderedDeck.pop()!, player, handIndex, 0, 0);
            updateCount(renderedDeck.length);
        }
    }
}

export function drawCard(
    cardTarget: HTMLElement,
    cardData: CardReference,
    initialSetup: boolean = false,
) {
    const actions = findEligibleAction(cardTarget, cardData, initialSetup);
    console.log("findEligibleActions", actions);
}
