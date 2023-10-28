import { CardColor, CardIndex, CardReference, CardType } from "./deck-controls";
import { constants } from "../appsettings";

export function renderCard(card: CardReference) {
    const cardShell = document.createElement("div");
    cardShell.className = "card";

    const title = document.createElement("p");
    title.innerText = card.name;
    title.className = "title";
    cardShell.appendChild(title);

    const category = document.createElement("p");
    category.innerText = card.category as CardType;
    category.className = "category";
    cardShell.appendChild(category);

    const val = document.createElement("p");
    val.innerText = card.value.toString();
    val.className = "value";
    cardShell.appendChild(val);

    const color = document.createElement("p");
    color.innerText = card.color as CardColor;
    color.className = "color";
    cardShell.appendChild(color);

    return cardShell;
}

export function renderDeck(deckArray: string[], deckIndex: CardIndex) {
    return deckArray.map((cardId, index) => {
        const renderedCard = renderCard(deckIndex[cardId]);
        renderedCard.style.left =
            index * constants.DEFAULT_DECK_OFFSET_INCREMENT +
            constants.DEFAULT_DECK_OFFSET_UNIT;
        // renderedCard.style.top =
        //     index * constants.DEFAULT_DECK_OFFSET_INCREMENT +
        //     constants.DEFAULT_DECK_OFFSET_UNIT;
        renderedCard.style.top = "0px";
        // renderedCard.style.borderColor = index % 2 === 0 ? "#222" : "inherit";
        renderedCard.style.backgroundPosition =
            deckIndex[cardId].spritePosition;
        return renderedCard;
    });
}
