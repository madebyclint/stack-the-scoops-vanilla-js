export enum CardColor {
    Pink = "pink",
    Green = "green",
}

export enum CardType {
    Base,
    Scoop,
    Topping,
    Bonus,
}

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

export type Card = {
    name: string;
    colors: CardColor;
    value: Number;
    category: CardType;
    qtyPerColor: Number;
    cardFunction: CardFunction;
    source: CardSource;
    image: CardImagePath;
};

export function buildDeck(cards: Card[]) {
    return cards.reduce((acc, card) => {
        acc.push(card.name);
        return acc;
    }, [] as string[]);
}
