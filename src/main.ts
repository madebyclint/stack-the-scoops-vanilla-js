import "./style.css";
import data from "./cards.json";
import {
    Card,
    buildDeck,
    buildDeckReference,
    shuffleArray,
} from "./utilities/deck-controls";

/* TODO: Is there a way to strong type the json here without
   color being incompatible */
const cards: Card[] = data.cards as any;

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <div id="draw-pile" class="card card-placeholder">Draw pile</div>
  </div>
`;

const deckReference = buildDeckReference(cards);
console.log("buildDeckReference", deckReference);

const deck = buildDeck(deckReference);
console.log("deck", deck);

const deckShuffled = shuffleArray(deck);
console.log("deckShuffled", deckShuffled);
