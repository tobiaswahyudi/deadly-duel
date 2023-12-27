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
                myName: null,
                oppName: null,
                myMove: null,
                oppMove: null,
                myHp: 10,
                myEnergy: 10,
                animationStartTimestamp: null,
        }
}
