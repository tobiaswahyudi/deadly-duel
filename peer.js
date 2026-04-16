/**************************************
 * peer.js
 *
 * Just holds settings and utilities for PeerJS usage.
 **************************************/

const isDev = window.location.hostname === "localhost";

// const peerJsConfig = {
//   //   config: {
//   //     iceServers: [{ urls: "stun:40.233.120.211:3478" }],
//   //   },
//   host: "40.233.120.211",
//   port: 3478,
//   path: "/duel",
//   key: "peeeerjs",
//   debug: 3,
// };

const randomPeerId = () =>
  "user-id-" +
  Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, "0");

const peerJsConfig = {
  host: "peerjs.wahyudi.ca",
  port: 9000,
  path: "/",
  secure: !isDev,
  debug: 3,
  config: {
    iceServers: [{ url: "stun:peerjs.wahyudi.ca:3478" }],
  },
};

const peerJsConnectionSettings = {
  serialization: "json",
};

// Set a peerjs data callback that optionally only runs once.
function nextData(cb, once = false) {
  gameState.peerjs.conn.on("data", cb);
  gameState.peerjs.conn._events.data.once = once;
}
