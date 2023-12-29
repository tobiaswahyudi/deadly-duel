/**************************************
* peer.js
*
* Just holds settings and utilities for PeerJS usage.
**************************************/

const peerJsConnectionSettings = {
  serialization: "json",
}

// Set a peerjs data callback that optionally only runs once.
function nextData(cb, once = false) {
	gameState.peerjs.conn.on('data', cb);
	gameState.peerjs.conn._events.data.once = once;
}