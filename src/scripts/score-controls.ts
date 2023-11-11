export function calculateScore(
    targetPlaceholder: HTMLElement,
    playedCard: HTMLElement,
) {
    console.log("target", targetPlaceholder);
    const completeSet = {
        topping: false,
        scoop: false,
        base: false,
        bonus: false,
    };
    const pile = targetPlaceholder.closest(".play-pile") as HTMLElement;
    const pileCards = pile.querySelectorAll(".card") as NodeListOf<HTMLElement>;
    let score = 0;
    let multiplier = 1; // we do 1 since 1 * anything is itself
    pileCards.forEach((card) => {
        console.log(
            "card",
            card,
            card.dataset.value,
            card.dataset.cardFunction,
        );
        switch (card.dataset.cardFunction) {
            case "add":
                score += parseFloat(card.dataset.value!);
                break;
            case "multiply":
                multiplier = parseFloat(card.dataset.value!);
                console.log("multiplying", card.dataset.value);
                break;
            default:
                score;
        }
        const category = card.dataset.category as keyof typeof completeSet;
        completeSet[category] = true;
    });
    score *= multiplier;
    if (completeSet.topping && completeSet.scoop && completeSet.base) {
        alert(`You completed a set with a score of ${score}!`);
    }
    return score;
}
