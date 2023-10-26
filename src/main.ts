import "./style.scss";
import data from "./cards.json";
import {
    Card,
    buildDeck,
    buildDeckReference,
    shuffleArray,
} from "./utilities/deck-controls";
import { renderDeck } from "./utilities/render-controls";
import { discard } from "./utilities/move-controls";

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
let deckCount = deckShuffled.length;

/* 4. Build the rendered deck from the shuffled virtual deck */
const renderedDeck = renderDeck(deckShuffled, deckReference);

/* NEED HTML HERE - everything after requires the DOM to be built */
document.querySelector<HTMLElement>("#app")!.innerHTML = `
  <div class="placeholder-container">
    <div id="draw-pile" class="card-placeholder">Draw pile</div>
    <div id="discard-pile" class="card-placeholder">Discard pile</div>
  </div>
  <div id="counter" class="pile-counter"><span id="count" class="count">${deckCount}</span> cards left</div>
  <div id="player-canvas" class="fullsize"><div id="player1" class="player-position player1">player1</div><div id="player2" class="player-position player2">player2</div><div id="player3" class="player-position player3">player3</div><div id="player4" class="player-position player4">player4</div></div>
`;

/* 5. Create the draw pile from the rendered deck */
const drawPile = document.getElementById("draw-pile");
renderedDeck.forEach((card) => {
    drawPile?.appendChild(card);
});

/* 6. Deal cards */
const playerCount = 4;

/* Sample draw function - this won't be used this way in the game,
   but just an example of how to do it */
function discardCaller(e: Event) {
    deckCount = discard(e, deckShuffled.length, deckCount);
    if (deckCount === 0) {
        alert("no more cards");
        drawPile?.removeEventListener("click", discardCaller);
    }
}

drawPile?.addEventListener("click", discardCaller);
/* End sample draw function */
