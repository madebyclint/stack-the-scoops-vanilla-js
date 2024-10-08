export type CardColor = "pink" | "green";

export type CardType = "Base" | "Scoop" | "Topping" | "Bonus";

export type CardFunction = "add" | "multiply";

export enum CardSource {
    Original,
    Expansion_1_Oops,
}

export type CardImagePath = {
    [key in CardColor]: string;
};

export type CardSpritePosition = {
    [key in CardColor]: string;
};

export interface CardBase {
    name: string;
    value: number;
    category: CardType;
    source: CardSource;
    spritePosition: string;
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
    cardFunction: CardFunction;
}

export type CardIndex = {
    [key: string]: CardReference;
};

export function buildDeckReference(cards: Card[]) {
    return cards.reduce((acc, card) => {
        card.colors.forEach((color: CardColor) => {
            // https://bobbyhadz.com/blog/typescript-element-implicitly-has-any-type-expression
            const spritePosition = card.spritePosition
                ? card.spritePosition[color as keyof typeof card.spritePosition]
                : "0px -2px";
            acc[
                [
                    color,
                    card.category,
                    card.value,
                    card.cardFunction,
                    card.name.replaceAll(" ", ""),
                ]
                    .join("-")
                    .toLowerCase()
            ] = {
                name: card.name,
                value: card.value,
                category: card.category,
                cardFunction: card.cardFunction,
                color,
                image: card.image[color],
                source: card.source,
                qty: card.qtyPerColor,
                spritePosition: spritePosition.toString(),
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

export function updateCount(count: number) {
    const htmlTarget = document.querySelector("#count") as HTMLElement;
    count -= 1;
    htmlTarget.innerText = count.toString();
    return count;
}
