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

export function playCard(
    selectedCard: HTMLElement,
    cardData: CardReference,
    abortController: AbortController,
) {
    abortController.abort();
    console.log("selectedPlayer", selectedCard);
    // selectedCard.classList.toggle("selected");
    if (selectedCard.classList.contains("selected")) {
        selectedCard.classList.remove("selected");
        // combine this with findEligibleAction() so there is no duplicated selectors and logic
        const eligibleSpots = document.querySelectorAll(".eligible-to-play");
        eligibleSpots.forEach((spot) => {
            spot.classList.remove("eligible-to-play");
        });
    } else {
        selectedCard.classList.add("selected");
        drawCard(selectedCard, cardData, false);
    }
}
