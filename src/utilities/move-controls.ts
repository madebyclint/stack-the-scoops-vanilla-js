export function moveCard(
    cardElement: HTMLElement,
    target: HTMLElement,
    offsetIncrement: number,
    offsetUnit: string = "px",
    index: number
) {
    cardElement.style.left = index * offsetIncrement + offsetUnit;
    cardElement.style.top = index * offsetIncrement + offsetUnit;
    target.appendChild(cardElement);
}
