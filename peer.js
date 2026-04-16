/**************************************
 * peer.js
 *
 * Just holds settings and utilities for PeerJS usage.
 **************************************/

const isDev = window.location.hostname === "localhost";

const randomPeerId = () =>
  "user-id-" +
  Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, "0");

const peerJsConnectionSettings = {
  serialization: "json",
};

// Set a peerjs data callback that optionally only runs once.
function nextData(cb, once = false) {
  gameState.peerjs.conn.on("data", cb);
  gameState.peerjs.conn._events.data.once = once;
}

async function initializePeer(id) {
	const myId = id || randomPeerId();
	
	// 1. Get Dynamic TURN Credentials from your server
	console.log('Getting ice config for ', myId);
	try {
		const response = await fetch(`https://peerjs.wahyudi.ca/ice-config?id=${myId}`);
		const iceConfig = await response.json();
		console.log('Ice config: ', iceConfig);

		// 2. Start PeerJS
		const peer = new Peer(myId, {
		  host: 'peerjs.wahyudi.ca',
		  port: 9000,
		  path: '/peerjs',
		  secure: true,
		  config: iceConfig // Inject the servers and HMAC credentials here
		});
	  
		peer.on('open', (id) => console.log('Connected with ID:', id));
	
		return peer;
	} catch (error) {
		console.error('Error getting ice config: ', error);
		return null;
	}
  
  }