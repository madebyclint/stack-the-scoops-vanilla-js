import "./style.scss";
import data from "./cards.json";
import {
    Card,
    buildDeck,
    buildDeckReference,
    shuffleArray,
    updateCount,
} from "./utilities/deck-controls";
import { renderDeck } from "./utilities/render-controls";
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

/* NEED HTML HERE - everything after requires the DOM to be built */
document.querySelector<HTMLElement>("#app")!.innerHTML = `
  <div id="gameboard" class="gameboard fullsize">
    <div class="drawdiscard-piles">
        <div id="draw-pile" class="card-placeholder">Draw pile</div>
        <div id="discard-pile" class="card-placeholder">Discard pile</div>
    </div>
    <div id="counter" class="pile-counter"><span id="count" class="count">${deckCount}</span> cards left</div>
    <div id="player1" class="player-position player1 players-1">player1</div>
    <div id="player2" class="player-position player2 players-1">player2</div>
    <div id="player3" class="player-position player3 players-1">player3</div>
    <div id="player4" class="player-position player4 players-1">player4</div>
  </div>
`;

/* 5. Create the draw pile from the rendered deck */
const drawPile = document.getElementById("draw-pile");
renderedDeck.forEach((card) => {
    drawPile?.appendChild(card);
});

/* 6. Deal cards */
const playerCount = 4;
for (let i = 0; i < 7; i++) {
    moveCard(
        renderedDeck.pop() as HTMLElement,
        document.getElementById("player1") as HTMLElement,
        i,
        0,
        10,
    );
    deckCount = updateCount(
        renderedDeck.length,
        document.getElementById("count") as HTMLElement,
    );
    moveCard(
        renderedDeck.pop() as HTMLElement,
        document.getElementById("player2") as HTMLElement,
        i,
        10,
        0,
    );
    deckCount = updateCount(
        renderedDeck.length,
        document.getElementById("count") as HTMLElement,
    );
    moveCard(
        renderedDeck.pop() as HTMLElement,
        document.getElementById("player3") as HTMLElement,
        i,
        0,
        10,
    );
    deckCount = updateCount(
        renderedDeck.length,
        document.getElementById("count") as HTMLElement,
    );
    moveCard(
        renderedDeck.pop() as HTMLElement,
        document.getElementById("player4") as HTMLElement,
        i,
        10,
        0,
    );
    deckCount = updateCount(
        renderedDeck.length,
        document.getElementById("count") as HTMLElement,
    );
}

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
