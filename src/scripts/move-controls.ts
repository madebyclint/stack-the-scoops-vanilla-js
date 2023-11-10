import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

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
    target: HTMLElement,
    startingDeckCount: number,
    deckCount: number,
    cardsDealt: number,
) {
    const parent = target.closest(".card") as HTMLElement;
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
    deckCount = updateCount(deckCount);
    return deckCount;
}

export function dealCard(card: HTMLElement, targetPlayer: HTMLElement) {
    moveCard(card, targetPlayer, 1);
}

export function findEligibleAction(
    card: HTMLElement,
    cardData: CardReference,
    initialSetup: boolean,
) {
    card.classList.remove("face-down");
    const pilesContainer = document.querySelector("#play-piles") as HTMLElement;
    const piles = pilesContainer!.querySelectorAll(".play-pile");
    const abortController = new AbortController();
    let playedCard = false;
    let eligiblePlays = 0;
    let eligibleSpots = [];
    piles.forEach((pile) => {
        if (initialSetup && playedCard) return;
        // check pile for any played cards already
        const pileChildren = pile.querySelectorAll(".card");
        if (initialSetup && pileChildren.length > 0) return;

        // Check category
        const categoryCardsToCheck = pile.querySelector(
            `#${pile.id}-${cardData.category}`,
        ) as HTMLElement;
        const children = categoryCardsToCheck!.children;

        if (children.length === 0 && !initialSetup) {
            categoryCardsToCheck.dataset.color = cardData.color;
            const thisPile = document.querySelector(`#${pile.id}`);
            const pileChildren = thisPile?.querySelectorAll(
                `.card[data-color='${card.dataset.color}'`,
            );
            if (pileChildren!.length > 0) {
                categoryCardsToCheck!.classList.add("eligible-to-play");
                eligiblePlays++;
                eligibleSpots.push(categoryCardsToCheck);
                categoryCardsToCheck!.addEventListener(
                    "click",
                    (e: Event) => {
                        const target = e.target as HTMLElement;
                        moveToCategory(card, target, abortController);
                    },
                    { signal: abortController.signal },
                );
            }
        }
        // End Check Category

        if (initialSetup) {
            moveToCategory(card, categoryCardsToCheck, abortController);
            playedCard = true;
            return { eligiblePlays };
        }
    });

    if (!initialSetup && eligiblePlays === 0) {
        Toastify({
            // className: "toast",
            text: "Nothing left to play",
            duration: 3000,
            destination: "https://github.com/apvarun/toastify-js",
            newWindow: true,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)",
            },
            onClick: function () {}, // Callback after click
        }).showToast();
    }

    return { eligiblePlays };
}

export function moveToCategory(
    cardToMove: HTMLElement,
    target: HTMLElement,
    abortController: AbortController,
) {
    abortController.abort();
    // console.log("abort signal", abortController.signal.aborted);
    // console.log("abort reason", abortController.signal.reason);
    // categoryCardsToCheck!.removeEventListener(
    //     "click",
    //     moveToCategory,
    // );
    cardToMove.classList.remove("selected");
    const cardRect = cardToMove.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const toMoveX = targetRect.left - cardRect.left;
    const toMoveY = targetRect.top - cardRect.top;
    const animationDurationInSeconds = 0.4;
    cardToMove.style.zIndex = "1000";
    cardToMove.style.transition = `all ${animationDurationInSeconds}s ease-out`;
    cardToMove.style.transform = `translate(${toMoveX}px, ${toMoveY}px)`;
    setTimeout(() => {
        cardToMove.style.zIndex = "unset";
        cardToMove.style.transform = "translate(0, 0)";
        moveCard(cardToMove, target, 0);
    }, animationDurationInSeconds * 1000);
    document.querySelectorAll(".eligible-to-play").forEach((eligibleCard) => {
        eligibleCard.classList.remove("eligible-to-play");
    });
    calculateScore(target);
}

export function calculateScore(targetCard) {
    console.log("target", targetCard);
    const pile = targetCard.closest(".play-pile");
    console.log("pile", pile);
    const pileCards = pile.querySelectorAll(".card");
    pileCards.forEach((card) => {
        console.log("card", card, card.dataset.points);
    });
}
