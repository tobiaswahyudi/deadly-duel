/**************************************
* Global State
*
* Trying to maintain a unidirectional data loop:
* State -> View -> State-Updaters (Controllers) -> State
**************************************/
const gameState = {
        // main menu
        screen: 'menu',
        menu: {
                state: "menu-select",
        },
        // options
        options: {
                magicBattle: false,
                visibleHp: false,
        },
        // peerjs
        peerjs: {
                peer: new Peer(),
                connId: null,
                conn: null,
                lastMessageTimestamp: null,
        },
        // running game
        game: {
                state: 'enter-name',
                me: {
                        name: null,
                        hp: 10,
                        energy: 10,
                        move: null,
                        wantRematch: null,
                        winCount: 0,
                },
                opponent: {
                        name: null,
                        hp: 10,
                        energy: 10,
                        move: null,
                        wantRematch: null,
                        winCount: 0,
                },
                animationStartTimestamp: null,
        }
}
