import { CardIndex, CardReference, CardType } from "./deck-controls";

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

    return cardShell;
}

export function renderDeck(deckArray: string[], deckIndex: CardIndex) {
    return deckArray.map((cardId, index) => {
        const renderedCard = renderCard(deckIndex[cardId]);
        renderedCard.style.left = index * 0.15 + "px";
        renderedCard.style.top = index * 0.15 + "px";
        renderedCard.style.borderColor = index % 2 === 0 ? "#222" : "inherit";
        return renderedCard;
    });
}
