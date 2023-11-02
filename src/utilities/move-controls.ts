import { constants } from "../appsettings";
import { CardReference, updateCount } from "./deck-controls";

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
    const counter = document.querySelector("#count") as HTMLElement;
    const discardPile = document.querySelector("#discard-pile") as HTMLElement;
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

export function findEligibleAction(card: HTMLElement, cardData: CardReference) {
    console.log("card", card);
    console.log("cardData", cardData);
    card.classList.remove("face-down");
    card.style.left = "30px";
    card.style.top = "30px";
    card.style.zIndex = "100";
    const pilesContainer = document.querySelector("#play-piles") as HTMLElement;
    console.log("piles", pilesContainer);
    const piles = pilesContainer!.querySelectorAll(".play-pile");
    piles.forEach((pile) => {
        console.log("pile", pile);
        const categoryToCheck = pile.querySelector(
            `#${pile.id}-${cardData.category}`,
        );
        const children = categoryToCheck!.children;
        if (children.length === 0) {
            categoryToCheck!.classList.add("eligible-to-play");
        }
        console.log(
            "categoryToCheck",
            categoryToCheck,
            children,
            children.length,
        );
        categoryToCheck!.addEventListener("click", (e) => {
            moveCard(card, e.target as HTMLElement, 0);
        });
    });
}
