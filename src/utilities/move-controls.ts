import { constants } from "../appsettings";
import { updateCount } from "./deck-controls";

export function moveCard(
    cardElement: HTMLElement,
    target: HTMLElement,
    index: number,
    offsetIncrementTop: number = constants.DEFAULT_DECK_OFFSET_INCREMENT,
    offsetIncrementLeft: number = constants.DEFAULT_DECK_OFFSET_INCREMENT,
    offsetUnit: string = constants.DEFAULT_DECK_OFFSET_UNIT,
    startingOffsetTop: number = 0,
    startingOffsetLeft: number = 0,
) {
    const topMovement = index * offsetIncrementTop + startingOffsetTop;
    const leftMovement = index * offsetIncrementLeft + startingOffsetLeft;
    cardElement.style.left = leftMovement + offsetUnit;
    cardElement.style.top = topMovement + offsetUnit;
    target.appendChild(cardElement);
}

export function discard(
    e: Event,
    startingDeckCount: number,
    deckCount: number,
    cardsDealt: number,
) {
    const target = e.target as Element;
    const parent = target.closest(".card") as HTMLElement;
    const counter = document.getElementById("count");
    const discardPile = document.getElementById("discard-pile");
    const index = Math.abs(startingDeckCount - deckCount);
    moveCard(
        parent,
        discardPile!,
        index,
        0,
        constants.DEFAULT_DECK_OFFSET_INCREMENT,
        "px",
        0,
        cardsDealt * constants.DEFAULT_DECK_OFFSET_INCREMENT * -1,
    );
    deckCount = updateCount(deckCount, counter as HTMLElement);
    return deckCount;
}

export function dealCard(card: HTMLElement, targetPlayer: HTMLElement) {
    moveCard(card, targetPlayer, 1);
}
