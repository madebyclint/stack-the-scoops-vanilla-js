import "./style.css";
import data from "./cards.json";
import {
    Card,
    buildDeck,
    buildDeckReference,
    shuffleArray,
} from "./utilities/deck-controls";
import { renderDeck } from "./utilities/render-controls";
import { moveCard } from "./utilities/move-controls";

/* TODO: Is there a way to strong type the json here without
   color being incompatible */
const cards: Card[] = data.cards as any;
const deckReference = buildDeckReference(cards);
const deck = buildDeck(deckReference);
const deckShuffled = shuffleArray(deck);
let deckCount = deckShuffled.length;

const renderedDeck = renderDeck(deckShuffled, deckReference);

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
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

const discardPile = document.getElementById("discard-pile");
drawPile?.addEventListener("click", discard);

function updateCount() {
    deckCount -= 1;
    console.log("deckCount", deckCount);
    const counter = document.getElementById("count") as HTMLDivElement;
    counter.innerText = deckCount.toString();
}

function discard(e: Event) {
    const target = e.target as Element;
    const parent = target.closest(".card");
    moveCard(parent as HTMLDivElement, discardPile as HTMLDivElement);
    updateCount();
    if (deckCount === 0) {
        alert("no more cards");
        drawPile?.removeEventListener("click", discard);
    }
    // TODO: Add stop here when out of cards
}
