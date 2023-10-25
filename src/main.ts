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

const renderedDeck = renderDeck(deckShuffled, deckReference);

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div class="placeholder-container">
    <div id="draw-pile" class="card-placeholder">Draw pile</div>
    <div id="discard-pile" class="card-placeholder">Discard pile</div>
  </div>
`;

const drawPile = document.getElementById("draw-pile");
renderedDeck.forEach((card) => {
    drawPile?.appendChild(card);
});

function discard(e: Event) {
    const target = e.target as Element;
    const parent = target.closest(".card");
    moveCard(parent as HTMLDivElement, discardPile as HTMLDivElement);
    // TODO: Add stop here when out of cards
}

const discardPile = document.getElementById("discard-pile");
drawPile?.addEventListener("click", discard);
