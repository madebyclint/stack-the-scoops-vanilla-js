export type CardColor = "pink" | "green";

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
    colors: CardColor[];
    value: number;
    category: CardType;
    qtyPerColor: number;
    cardFunction: CardFunction;
    source: CardSource;
    image: CardImagePath;
};

export function buildDeck(cards: Card[]) {
    return cards.reduce((acc, card) => {
        for (let i = 0; i < card.qtyPerColor; i++) {
            card.colors.forEach((color: CardColor) => {
                acc.push(
                    [
                        color,
                        card.category,
                        card.value,
                        card.name.replaceAll(" ", ""),
                    ]
                        .join("-")
                        .toLowerCase()
                );
            });
        }
        return acc;
    }, [] as string[]);
}
