import { constants } from "../appsettings";
import { updateCount } from "./deck-controls";

export function moveCard(
    cardElement: HTMLElement,
    target: HTMLElement,
    index: number,
    offsetIncrement: number = constants.DEFAULT_DECK_OFFSET_INCREMENT,
    offsetUnit: string = constants.DEFAULT_DECK_OFFSET_UNIT
) {
    cardElement.style.left = index * offsetIncrement + offsetUnit;
    cardElement.style.top = index * offsetIncrement + offsetUnit;
    target.appendChild(cardElement);
}

export function discard(
    e: Event,
    startingDeckCount: number,
    deckCount: number
) {
    const target = e.target as Element;
    const parent = target.closest(".card");
    const counter = document.getElementById("count");
    const discardPile = document.getElementById("discard-pile");
    moveCard(
        parent as HTMLElement,
        discardPile as HTMLElement,
        Math.abs(startingDeckCount - deckCount)
    );
    deckCount = updateCount(deckCount, counter as HTMLElement);
    return deckCount;
}

export function dealCard(card: HTMLElement, targetPlayer: HTMLElement) {
    moveCard(card, targetPlayer, 1);
}
