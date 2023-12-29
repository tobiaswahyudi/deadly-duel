/**************************************
* -------- Deadly Duel--------
*       December 23, 2023
* 
* Designed by Maximillian Aurelius
* Written by B. Tobias Wahyudi
**************************************/

/*********************************************
* Game Control 
*********************************************/

// Starts a duel. Because of rematches, one game can have multiple duels.
function startDuel() {
	const resetPlayer = {
		hp: 10,
		energy: 10,
		move: null,
		wantRematch: 0
	};

	gameState.game.me = {...gameState.game.me, ...resetPlayer};
	gameState.game.opponent = {...gameState.game.opponent, ...resetPlayer};

	// Even if the game was over before, force the game to start
	gameState.game.state = 'make-move';
	startMove();
}

function sendPlayerData(action) {
	const data = {
		action: action,
		player: gameState.game.me
	}

	gameState.peerjs.conn.send(data);
}

// Send Name
function sendName() {
	// TODO: Really should do this with <form>
	const name = getInputValue('my-name-input');

	gameState.game.me.name = name || "blank";

	sendPlayerData("name");

	if(gameState.game.opponent.name) {
		startDuel();
	} else {
		gameState.game.state = 'waiting-name';
		updateDisplay();
	}
}

// After receiving opponent name
function receiveName() {
	if(gameState.game.me.name) {
		startMove();
	} else {
		updateDisplay();
	}
}

// Start duel round
function startMove() {
	// Prevent race
	if(gameState.game.state != 'game-over') {
		gameState.game.state = 'make-move';
	}
	updateDisplay();
}

// Send move decision to other player
function sendMove(move) {
	gameState.game.me.move = move;

	sendPlayerData("move");

	if(gameState.game.opponent.move != null) {
		// This races with sendPlayerData to set gameState.game.me.move to null.
		setTimeout(computeMove, 10);
	} else {
		gameState.game.state = 'waiting-move';
		updateDisplay();
	}
}

// After receiving opponent move
function receiveMove() {
	if(gameState.game.me.move != null) {
		computeMove();
	} else {
		updateDisplay();
	}
}

// After receiving opponent's game over declaration
function gameOver() {
	gameState.game.state = 'game-over';

	if(gameState.game.opponent.hp == 0) gameState.game.me.winCount++;
	if(gameState.game.me.hp == 0) gameState.game.opponent.winCount++;

	updateDisplay();
}

// After receiving rematch request
function receiveRematch() {
	if(gameState.game.me.wantRematch && gameState.game.opponent.wantRematch) {
		startDuel();
	}
}

function sendRematch() {
	gameState.game.me.wantRematch = true;
	sendPlayerData("rematch");
	updateDisplay();
	
	if(gameState.game.me.wantRematch && gameState.game.opponent.wantRematch) {
		startDuel();
	}
}

function receiveData(playerData) {
	const action = playerData.action;

	gameState.game.opponent = playerData.player;
	console.log(playerData);

	switch(action) {
		case "name":{
			receiveName();
			break;
		}
		case "move":{
			receiveMove();
			break;
		}
		case "rematch": {
			receiveRematch();
		}
	}
}

function moveForPlayer(player, theirMove, otherMove) {
	const dmgReceived = outcomeDamage(theirMove, otherMove);

	player.hp -= dmgReceived;
	player.hp = Math.max(player.hp, 0);
	player.energy += Math.floor(player.hp/2) - theirMove;
	player.energy = Math.min(player.energy, 10);
}

// Once both players have decided, process the move outcome
function computeMove() {
	const myMove = gameState.game.me.move;
	const oppMove = gameState.game.opponent.move;

	moveForPlayer(gameState.game.me, myMove, oppMove);
	moveForPlayer(gameState.game.opponent, oppMove, myMove);

	if(gameState.game.me.hp == 0 || gameState.game.opponent.hp == 0) {
		// No further communication, unless rematch is sent
		gameOver();
		return;
	}

	gameState.game.me.move = null;
	gameState.game.opponent.move = null;

	gameState.game.state = 'move-outcome';
	gameState.game.animationStartTimestamp = new Date().getTime();
	
	document.getElementById('outcome-label').innerText = outcomeLabel(myMove, oppMove);
	updateDisplay();
}

function gameOutcomeNext() {
	startMove();
}

/*********************************************
* Menu Selection / Pre-Connect Functions
*********************************************/
function menuSelectHost() {
	gameState.menu.state = "menu-host";
	updateDisplay();
}

function menuSelectConnect() {
	gameState.menu.state = "menu-connect";
	updateDisplay();
}

function menuConnectingBack() {
	gameState.menu.state = 'menu-select';
	// reset listeners
	gameState.peerjs.peer = new Peer();
	updateDisplay();
}

function menuConnectingHost() {
	const selfId = getInputValue('connection-phrase-host');
	if(selfId.length < 16) {
		document.getElementById('phrase-error').innerText = 'please forge a phrase at least 16 characters in length';
		return;
	} else {
		document.getElementById('phrase-error').innerText = '';
	}

	gameState.peerjs.selfId = selfId;
	gameState.peerjs.peer = new Peer(selfId);
	
	gameState.peerjs.peer.on('error', console.error);
	console.log("My peer id is ", gameState.peerjs.peer.id);

	gameState.peerjs.peer.on('connection', (conn) => {
		gameState.peerjs.conn = conn;
		startGame();
	});

	gameState.menu.state = 'menu-host-waiting';
	updateDisplay();
}

function menuConnectingConnect() {

	document.getElementById("duel-connect").disabled = true;

	const oppId = getInputValue('connection-phrase-connect');
	gameState.peerjs.conn = gameState.peerjs.peer.connect(oppId, peerJsConnectionSettings);
	gameState.peerjs.peer.on('error', console.error);
	console.log("My peer id is ", gameState.peerjs.peer.id);
	console.log(gameState.peerjs.conn);


	gameState.peerjs.conn.on('open', startGame);
}

// Start the game; Set up first listeners.
// A game starts when the player connects to the opponent and ends when they close the tab.
function startGame() {
	console.log("Connected to peer ", gameState.peerjs.conn.peer);
	gameState.peerjs.lastMessageTimestamp = new Date().getTime();
	gameState.screen = 'game';
	nextData(receiveData);
	updateDisplay();
}

