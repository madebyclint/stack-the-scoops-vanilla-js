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
const deckReference = buildDeckReference(cards);
const deck = buildDeck(deckReference);
const deckShuffled = shuffleArray(deck);
let deckCount = deckShuffled.length;

const renderedDeck = renderDeck(deckShuffled, deckReference);

document.querySelector<HTMLElement>("#app")!.innerHTML = `
  <div class="placeholder-container">
    <div id="draw-pile" class="card-placeholder">Draw pile</div>
    <div id="discard-pile" class="card-placeholder">Discard pile</div>
  </div>
  <div id="counter" class="pile-counter"><span id="count" class="count">${deckCount}</span> cards left</div>
`;

const drawPile = document.getElementById("draw-pile");
renderedDeck.forEach((card) => {
    drawPile?.appendChild(card);
});

function discardCaller(e: Event) {
    deckCount = discard(e, deckShuffled.length, deckCount);
    if (deckCount === 0) {
        alert("no more cards");
        drawPile?.removeEventListener("click", discardCaller);
    }
}

drawPile?.addEventListener("click", discardCaller);
