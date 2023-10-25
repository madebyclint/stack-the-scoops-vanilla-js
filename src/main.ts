import "./style.css";
import data from "./cards.json";
import {
    Card,
    buildDeck,
    buildDeckReference,
    shuffleArray,
    updateCount,
} from "./utilities/deck-controls";
import { renderDeck } from "./utilities/render-controls";
import { moveCard } from "./utilities/move-controls";
import { constants } from "./appsettings";

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

const discardPile = document.getElementById("discard-pile");
drawPile?.addEventListener("click", discard);

function discard(e: Event) {
    const target = e.target as Element;
    const parent = target.closest(".card");
    const counter = document.getElementById("count");
    moveCard(
        parent as HTMLElement,
        discardPile as HTMLElement,
        constants.DEFAULT_DECK_OFFSET_INCREMENT,
        constants.DEFAULT_DECK_OFFSET_UNIT,
        Math.abs(deckShuffled.length - deckCount)
    );
    deckCount = updateCount(deckCount, counter as HTMLElement);
    if (deckCount === 0) {
        alert("no more cards");
        drawPile?.removeEventListener("click", discard);
    }
}
