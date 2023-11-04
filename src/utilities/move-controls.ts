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
    deckCount = updateCount(deckCount, counter);
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
    console.log("card", card);
    console.log("cardData", cardData);
    card.classList.remove("face-down");
    card.style.left = "30px";
    card.style.top = "30px";
    card.style.zIndex = "100";
    const pilesContainer = document.querySelector("#play-piles") as HTMLElement;
    const piles = pilesContainer!.querySelectorAll(".play-pile");
    const abortController = new AbortController();
    let playedCard = false;
    piles.forEach((pile, pileIndex) => {
        if (initialSetup && playedCard) return;
        // check pile for any played cards already
        const pileChildren = pile.querySelectorAll(".card");
        if (initialSetup && pileChildren.length > 0) return;

        const categoryToCheck = pile.querySelector(
            `#${pile.id}-${cardData.category}`,
        ) as HTMLElement;
        const children = categoryToCheck!.children;

        console.log(
            "categoryToCheck",
            categoryToCheck,
            children,
            children.length,
            pileChildren.length,
            pileIndex,
        );

        if (children.length === 0) {
            categoryToCheck!.classList.add("eligible-to-play");
        }

        if (categoryToCheck.classList.contains("eligible-to-play")) {
            if (initialSetup) {
                moveToCategory(card, categoryToCheck, abortController);
                playedCard = true;
            } else {
                categoryToCheck!.addEventListener(
                    "click",
                    (e: Event) => {
                        const target = e.target as HTMLElement;
                        moveToCategory(card, target, abortController);
                    },
                    { signal: abortController.signal },
                );
            }
        }
    });

    let eligiblePlaysLeft =
        pilesContainer.querySelectorAll(".eligible-to-play");
    console.log("eligible-to-play", eligiblePlaysLeft);
    if (!initialSetup && eligiblePlaysLeft.length === 0) {
        discard(card, 0, 0, 0);
        alert("nothing left to play");
    }
}

export function moveToCategory(
    cardToMove: HTMLElement,
    target: HTMLElement,
    abortController: AbortController,
) {
    abortController.abort();
    // console.log("abort signal", abortController.signal.aborted);
    // console.log("abort reason", abortController.signal.reason);
    // categoryToCheck!.removeEventListener(
    //     "click",
    //     moveToCategory,
    // );
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
}
