// Update card positioning
const cardContainer = document.getElementById('move-cards');
const cards = [];

const createCard = (idx) => {
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('move-spacer');

    const typeIdx = actionType(idx);
    const typeString = ACTION_LABELS[typeIdx];

    const typeAsset = [
        ASSETS.IMG.DEFEND,
        ASSETS.IMG.QUICK,
        ASSETS.IMG.HEAVY,
    ][typeIdx]

    const colors = [
        'hsl(159.6, 22%, 87.35%)', // '#b9ebda',
        'hsl(208.24, 38%, 90.67%)', // '#bbdfff',
        'hsl(280, 43%, 89.86%)' // '#e6c4f7'
    ];

    // cardDiv.style.background = colors[typeIdx];
    // cardDiv.onclick = () => sendMove(idx);
        
    cardDiv.innerHTML = `
    <div class="move-card">
        <p class="move-title">
            ${typeString}
        </p>
        <div class="move-main">
            <img src="${typeAsset.CARD}" class="move-img">
            <p class="move-cost">${idx}</p>
        </div>
    </div>
    `
    // <div class="move-text">
    //     <div class="move-desc">
    //         <img src="img/def.png">
    //     </div>
    //     <div class="move-desc">
    //         <img src="img/quick-sprite.png">
    //     </div>
    //     <div class="move-desc">
    //         <img src="img/heavy-sprite.png">
    //     </div>
    // </div>
    // <div>
    //     <p>${}</p>
    // </div>
    // <div>
    //     <p>${}</p>
    // </div>
    // <div>
    //     <p>${}</p>
    // </div>

    cardContainer.appendChild(cardDiv);

    return cardDiv;
}

const updateCards = () => {
    const selected = gameState.game.selectedCard;
    if(selected == null) return;
    cards.forEach((c, idx) => {
        const firstChild = c.children[0];
        if(idx == selected) {
            c.style.flex = `2 1 0`;
            firstChild.style.transform = `scale(${2})`;
        } else {
            c.style.flex = `${7/8} 1 0`;
            firstChild.style.transform = `scale(${7/8})`;
        }
    })
}

const setupCards = () => {
    // Create new cards based on matrix
    for(let i = 0; i <= 8; i++){
        cards.push(createCard(i));
    }

    cards.forEach((card, idx) => {
        card.onclick = () => {
            console.log('clicked', idx)
            gameState.game.selectedCard = idx;
            updateCards();
        }
    })
}