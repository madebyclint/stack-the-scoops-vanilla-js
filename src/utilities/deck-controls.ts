export type CardColor = "pink" | "green";

export type CardType = "Base" | "Scoop" | "Topping" | "Bonus";

export enum CardFunction {
    Add,
    Multiply,
}

export enum CardSource {
    Original,
    Expansion_1_Oops,
}

export type CardImagePath = {
    [key in CardColor]: string;
};

export interface CardBase {
    name: string;
    value: number;
    category: CardType;
    source: CardSource;
}

export interface Card extends CardBase {
    colors: CardColor[];
    qtyPerColor: number;
    cardFunction: CardFunction;
    image: CardImagePath;
}

export interface CardReference extends CardBase {
    color: CardColor;
    image: string;
    qty: number;
}

export type CardIndex = {
    [key: string]: CardReference;
};

export function buildDeckReference(cards: Card[]) {
    return cards.reduce((acc, card) => {
        card.colors.forEach((color: CardColor) => {
            acc[
                [
                    color,
                    card.category,
                    card.value,
                    card.name.replaceAll(" ", ""),
                ]
                    .join("-")
                    .toLowerCase()
            ] = {
                name: card.name,
                value: card.value,
                category: card.category,
                color,
                image: card.image[color],
                source: card.source,
                qty: card.qtyPerColor,
            };
        });
        return acc;
    }, {} as CardIndex);
}

export function buildDeck(deckReference: CardIndex) {
    const cardKeys = Object.keys(deckReference);
    return cardKeys.reduce((acc, key) => {
        for (let i = 0; i < deckReference[key].qty; i++) {
            acc.push(key);
        }
        return acc;
    }, [] as string[]);
}

// Fisher Yates shuffle
export function shuffleArray(toShuffle: string[] = []) {
    for (let i = toShuffle.length - 1; i > 0; i -= 1) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        [toShuffle[i], toShuffle[randomIndex]] = [
            toShuffle[randomIndex],
            toShuffle[i],
        ];
    }
    return toShuffle;
}
