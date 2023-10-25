import { constants } from "../appsettings";
import { updateCount } from "./deck-controls";

export function moveCard(
    cardElement: HTMLElement,
    target: HTMLElement,
    offsetIncrement: number,
    offsetUnit: string = "px",
    index: number
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
        constants.DEFAULT_DECK_OFFSET_INCREMENT,
        constants.DEFAULT_DECK_OFFSET_UNIT,
        Math.abs(startingDeckCount - deckCount)
    );
    deckCount = updateCount(deckCount, counter as HTMLElement);
    return deckCount;
}
