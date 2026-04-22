/**************************************
* view.js
*
* View updater & View-controller
**************************************/

/**************************************
* Utilities
**************************************/

// Given a list of DOM elements, find the one with matching id.
function findWithId(collection, id) {
	return collection.find(child => child.id == id);
}

// Set the innerText for the DOM element whose id is specified.
function setTextForId(id, text, raw=false) {
  if(raw) {
    document.getElementById(id).innerHTML = text;
    return;
  }
  document.getElementById(id).innerText = text;
}

// Gets the value from the input element whose id is specified.
function getInputValue(id) {
  return document.getElementById(id).value;
}

/**************************************
* Page Updaters
**************************************/

// Game page
function updateGameScreen(gamePage) {
  const sections = [...gamePage.getElementsByTagName('section')];
  sections.forEach(sec => sec.style.display = 'none');
  const currentSection = findWithId(sections, gameState.game.state);
  currentSection.style.display = 'unset';
  
  if(gameState.game.state == 'game-over') {
    const gameOverLabel = (() => {
      if(gameState.game.opponent.hp == 0) {
        if(gameState.game.me.hp == 0) {
          // Tied
          return `The duel ended in a tie. You are both dead losers.
          
          The score is ${gameState.game.me.winCount} (you) vs ${gameState.game.opponent.winCount} (them)`;
        } else {
          // Win
          return `The duel ended in your victory! Your pathetic opponent is defeated.
          
          The score is ${gameState.game.me.winCount} (you) vs ${gameState.game.opponent.winCount} (them)`;
        }
      } else {
        // Lost
        return `The duel ended in your defeat. Even your corpse looks sad.
        
        The score is ${gameState.game.me.winCount} (you) vs ${gameState.game.opponent.winCount} (them)`;
      }
    })();
    // setTextForId('match-round-counter', `Duel ${gameState.game.duelNumber} Results:`);
    setTextForId('duel-outcome', gameOverLabel);

    document.getElementById("send-rematch").disabled = gameState.game.me.wantRematch;
  } else {
    // const moveOptions = [...document.getElementById('move-cards').children]
    // moveOptions.forEach((opt, idx) => {
    //   opt.disabled = (idx > gameState.game.me.energy);
    // });

    // setTextForId('match-round-counter', `Duel ${gameState.game.duelNumber} - Round ${gameState.game.roundNumber}`);

    const selected = gameState.game.selectedCard;
    if(selected != null) {
      document.getElementById('move-confirm').style.display = 'block';
      const move = ACTION_HANDLEBARS[actionType(selected)]
      const moveDisplayString = `[${move} ${selected}]`
      setTextForId('move-display', formatTooltipLabel(moveDisplayString, 0), true);

      const cardDiv = document.createElement('div');
      cardDiv.classList.add('move-spacer');

      const tooltips = tooltipLabel(selected);

      const tooltipList = document.getElementById('move-tooltip');
      [...tooltipList.children].forEach(c => c.remove());

      // Energy
      const listItem = document.createElement('li');
      const cur = gameState.game.me.energy;
      const recovered = getEnergyRecovered();
      const endEnergy = Math.min(cur - selected + recovered, MAX_ENERGY);
      const energyString = `Energy = ${cur} current - ${move} ${selected} + recover ${recovered} energy this turn &#x2192; ${endEnergy == MAX_ENERGY ? endEnergy + ' (max)' : endEnergy}`
      listItem.innerHTML = formatTooltipLabel(energyString, 0);
      tooltipList.appendChild(listItem);

      tooltips.forEach(s => {
        const listItem = document.createElement('li');
        listItem.innerHTML = s;
        tooltipList.appendChild(listItem);
      })
    } else {
      setTextForId('move-display', 'Make an action:')
      document.getElementById('move-confirm').style.display = 'none';
    }
  }
  setTextForId('my-name-display', gameState.game.me.name);
  if(gameState.game.me.name) setTextForId('my-name', gameState.game.me.name);
  if(gameState.game.opponent.name) setTextForId('opp-name', gameState.game.opponent.name);	
  setTextForId('my-move-display', `${formatTooltipLabel(ACTION_HANDLEBARS[actionType(gameState.game.me.move)], 0)} (${gameState.game.me.move})`, true);

  document.getElementById('my-hp').style.width = `${gameState.game.me.hp}0%`;
  setTextForId('my-hp-label', `${gameState.game.me.hp}/10`);
  document.getElementById('my-energy').style.width = `${gameState.game.me.energy}0%`;
  setTextForId('my-energy-label', `${gameState.game.me.energy}/10`);

  document.getElementById('opp-hp').style.width = `${gameState.game.opponent.hp}0%`;
  setTextForId('opp-hp-label', `${gameState.game.opponent.hp}/10`);
  document.getElementById('opp-energy').style.width = `${gameState.game.opponent.energy}0%`;
  setTextForId('opp-energy-label', `${gameState.game.opponent.energy}/10`);
}

// Menu Screen
function updateMenuScreen(menuPage) {
  const sections = [...menuPage.getElementsByTagName('section')];
  sections.forEach(sec => sec.style.display = 'none');
  const currentSection = findWithId(sections, gameState.menu.state);
  currentSection.style.display = 'unset';

  if(gameState.menu.state == 'menu-host-waiting') {

    const id = gameState.peerjs?.peer?.id?.split('-')?.[2] || '⏱️';

    setTextForId('connection-phrase-display', id);
  }

  document.getElementById('rules').style.display = gameState.menu.rulesOpen ? 'block' : 'none';
  setTextForId('show-rules-button', gameState.menu.rulesOpen ? 'hide rules' : 'show rules');
}

/**************************************
* Global View Updater
**************************************/

function updateDisplay() {
	const pages = [...document.getElementsByTagName('page')];
	pages.forEach(page => page.style.display = 'none');
	const currentPage = findWithId(pages, gameState.screen);
	currentPage.style.display = 'unset';

	if(gameState.screen == 'game') {
		updateGameScreen(currentPage);
	} else if(gameState.screen == 'menu') {
		updateMenuScreen(currentPage);
	} else if(gameState.screen == 'game-over') {
		
	}
}