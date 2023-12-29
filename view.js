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
function setTextForId(id, text) {
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
    setTextForId('duel-outcome', gameOverLabel);

    document.getElementById("send-rematch").disabled = gameState.game.me.wantRematch;
  } else {
    const moveOptions = [...document.getElementById('move-options').children]
    moveOptions.forEach((opt, idx) => {
      opt.disabled = (idx > gameState.game.me.energy);
    });
  }
  setTextForId('my-name', gameState.game.me.name || "???");
  setTextForId('my-name-display', gameState.game.me.name || "???");
  setTextForId('opp-name', gameState.game.opponent.name || "???");	
  setTextForId('my-move-display', gameState.game.me.move);

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
    setTextForId('connection-phrase-display', gameState.peerjs.selfId);
  }
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