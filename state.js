/**************************************
* Global State
*
* Trying to maintain a unidirectional data loop:
* State -> View -> State-Updaters (Controllers) -> State
**************************************/
const gameState = {
        // main menu
        screen: 'game',
        menu: {
                state: "menu-select",
                rulesOpen: false,
        },
        // options
        options: {
                magicBattle: false,
                visibleHp: false,
        },
        // peerjs
        peerjs: {
                peer: null,
                connId: null,
                conn: null,
                lastMessageTimestamp: null,
        },
        // running game
        game: {
                state: 'make-move',
                duelNumber: 1,
                roundNumber: 1,
                me: {
                        name: null,
                        hp: 10,
                        energy: 5,
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
                selectedCard: null,
        }
}
