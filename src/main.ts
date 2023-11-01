import "./style.scss";
import data from "./cards.json";
import {
    Card,
    buildDeck,
    buildDeckReference,
    shuffleArray,
    updateCount,
} from "./utilities/deck-controls";
import { renderDeck, createPlayer } from "./utilities/render-controls";
import { discard, moveCard } from "./utilities/move-controls";

/* TODO: Is there a way to strong type the json here without
   color being incompatible */
const cards: Card[] = data.cards as any;

/* 1. Build the full deck reference object that includes
      all the keys for each card and the meta data */
const deckReference = buildDeckReference(cards);

/* 2. Build the virtual deck - JS only */
const deck = buildDeck(deckReference);
/* 3. Shuffle the deck */
const deckShuffled = shuffleArray(deck);

/* 4. Build the rendered deck from the shuffled virtual deck */
const renderedDeck = renderDeck(deckShuffled, deckReference);
let deckCount = renderedDeck.length;

const App = function _App() {
    return `
        <div id="gameboard" class="gameboard fullsize side-by-side">
            <div class="play-area">
                <div id="draw-pile" class="card-placeholder">Draw pile</div>
                <div id="discard-pile" class="card-placeholder">Discard pile</div>
                <div id="play-piles" class="play-piles">
                    <div id="pile1">
                        <div id="pile1-bonus" class="card-placeholder">1-bonus</div>
                        <div id="pile1-topping" class="card-placeholder">1-topping</div>
                        <div id="pile1-scoops" class="card-placeholder">1-scoops</div>
                        <div id="pile1-base" class="card-placeholder">1-base</div>
                    </div>
                    <div id="pile2">
                        <div id="pile2-bonus" class="card-placeholder">2-bonus</div>
                        <div id="pile2-topping" class="card-placeholder">2-topping</div>
                        <div id="pile2-scoops" class="card-placeholder">2-scoops</div>
                        <div id="pile2-base" class="card-placeholder">2-base</div>
                    </div>
                    <div id="pile3">
                        <div id="pile3-bonus" class="card-placeholder">3-bonus</div>
                        <div id="pile3-topping" class="card-placeholder">3-topping</div>
                        <div id="pile3-scoops" class="card-placeholder">3-scoops</div>
                        <div id="pile3-base" class="card-placeholder">3-base</div>
                    </div>
                </div>
            </div>
            <div id="counter" class="pile-counter">
                <span id="count" class="count">${deckCount}</span> cards left
            </div>
            <div id="players-area"></div>
        </div>
    `;
};

/* NEED HTML HERE - everything after requires the DOM to be built */
const appElement = document.querySelector<HTMLElement>("#app")!;
appElement.innerHTML = App();

const gameboardElement = appElement.querySelector<HTMLElement>("#gameboard")!;
const playersArea =
    gameboardElement.querySelector<HTMLElement>("#players-area")!;

/* 5. Create the draw pile from the rendered deck */
const drawPile = document.getElementById("draw-pile");
renderedDeck.forEach((card) => {
    drawPile?.appendChild(card);
});

/* 6. Deal cards */
const playerCount = 2;
const startingHandSize = 7;
for (let playerIndex = 0; playerIndex < playerCount; playerIndex++) {
    if (gameboardElement.classList.contains("distributed")) {
        gameboardElement.appendChild(
            createPlayer(playerIndex + 1, playerCount),
        );
        playersArea.remove();
    } else {
        playersArea.appendChild(createPlayer(playerIndex + 1, playerCount));
    }
    const player = document.getElementById("player" + (playerIndex + 1))!;
    for (let handIndex = 0; handIndex < startingHandSize; handIndex++) {
        moveCard(renderedDeck.pop()!, player, handIndex, 0, 10);
        deckCount = updateCount(
            renderedDeck.length,
            document.getElementById("count")!,
        );
    }
}

/* 7. Prep active player */
let activePlayer = document.getElementById("player1");
let activePlayerCards = activePlayer?.querySelectorAll(".card");
activePlayerCards?.forEach((card: HTMLElement, index: number) => {
    card.classList.remove("face-down");
    card.style.left = index * 120 + "px";
});
activePlayer?.addEventListener("click", (e) => {
    const selectedCard = e.target as HTMLElement;
    console.log("activePlayer", selectedCard);
    selectedCard.classList.toggle("selected");
});

/* 7. Create starter stacks */
const firstCard = renderedDeck.pop();
console.log("firstCard", firstCard, deckReference[firstCard!.id]);

/* Sample draw function - this won't be used this way in the game,
   but just an example of how to do it */
const cardsDealt = deckShuffled.length - deckCount;
function discardCaller(e: Event) {
    deckCount = discard(e, deckShuffled.length, deckCount, cardsDealt);
    if (deckCount === 0) {
        alert("no more cards");
        drawPile?.removeEventListener("click", discardCaller);
    }
}

drawPile?.addEventListener("click", discardCaller);
/* End sample draw function */
