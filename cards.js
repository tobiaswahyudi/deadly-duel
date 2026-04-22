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

    cardDiv.innerHTML = `
    <div class="move-card" style="transform: scale(0);">
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
    // constrain so cards are close together
    cardDiv.style.maxWidth = '6rem'
    cardDiv.style.filter = `brightness(1)`;

    return cardDiv;
}

// This violates SRP with updateDisplay but idk whatever
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

const attachCardListeners = () => {
    cards.forEach((card, idx) => {
        if(idx > gameState.game.me.energy) return;
        card.onclick = () => {
            if(gameState.game.selectedCard == idx) return;
            gameState.game.selectedCard = idx;
            updateCards();
            updateDisplay();
        }
        // unconstrain otherwise layout will break
        card.style.maxWidth = 'unset';
    })
}

const sequentialCreateFromNthCard = (idx) => {
    if(idx === 9) {
        attachCardListeners();
        return
    }
    const card = createCard(idx);
    cards.push(card);
    setTimeout(() => {
        const firstChild = card.children[0];
        firstChild.style.transform = `scale(1)`;
        if(idx > gameState.game.me.energy) {
            firstChild.style.opacity = `0.3`;
            card.style.filter = `brightness(0.7)`;
            card.style.transform = `rotate(8deg) scale(0.8)`;
        }
    }, 10)
    setTimeout(() => sequentialCreateFromNthCard(idx + 1), 200);
}

const setupCards = () => {
    // // Create new cards based on matrix
    // for(let i = 0; i <= 8; i++){
    //     cards.push(createCard(i));
    // }

    // cards.forEach((card, idx) => {
    //     card.onclick = () => {
    //         console.log('clicked', idx)
    //         gameState.game.selectedCard = idx;
    //         updateCards();
    //     }
    // })
    sequentialCreateFromNthCard(0)
}