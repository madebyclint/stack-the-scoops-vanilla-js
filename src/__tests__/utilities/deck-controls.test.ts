import data from "../../cards.json";
import {
    Card,
    buildDeckReference,
    buildDeck,
    shuffleArray,
} from "../../utilities/deck-controls";

describe("deck-controls", () => {
    const cards: Card[] = data.cards as any;
    const deckReference = buildDeckReference(cards);
    const deck = buildDeck(deckReference);
    const sampleDeck = [deck[0], deck[1], deck[2]];
    const deckShuffled = shuffleArray(deck);
    const sampleShuffledDeck = [
        deckShuffled[0],
        deckShuffled[1],
        deckShuffled[2],
    ];

    test("buildDeckReference has 40 keys", () => {
        const keys = Object.keys(deckReference);
        expect(keys).toHaveLength(40);
    });

    test("buildDeck has 120 cards", () => {
        expect(deck).toHaveLength(120);
    });

    test("deckShuffled does not match order of deck", () => {
        const sampleDeckString = sampleDeck.join("-");
        const sampleShuffledDeckString = sampleShuffledDeck.join("-");
        expect(sampleDeckString).toBe(sampleDeckString);
        expect(sampleShuffledDeckString).toBe(sampleShuffledDeckString);
        expect(sampleDeck).not.toBe(sampleShuffledDeckString);
    });
});
