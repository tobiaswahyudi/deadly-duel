/**************************************
* hit-calculation.js
*
* Configuration and utilities for scoring and labeling hit outcomes.

Now expanded to be like... all the rules r here idk
**************************************/

/**************************************
* Outcome Labels
**************************************/

const ACTION_TYPES = {
	ACTION_BLOCK: 0,
	ACTION_QUICK: 1,
	ACTION_HEAVY: 2
};

const ACTION_LABELS = [
	"Block",
	"Quick attack",
	"Heavy attack"
];

const ACTION_HANDLEBARS = [
	"{block}",
	"{quick}",
	"{heavy}",
]

const OUTCOME_LABELS = {
	[ACTION_TYPES.ACTION_BLOCK]: {
		RPS_WIN: "They ready a big swing, but you block in time. No damage is dealt.",
		RPS_LOSE: "You prepare to block but they attack quickly, slashing you for {oppDmg} hp.",
		ENERGY_TIED: "You both block. Nothing happens.",
	},
	[ACTION_TYPES.ACTION_QUICK]: {
		RPS_WIN: "You attack quickly past their defenses, slashing for {myDmg} hp.",
		RPS_LOSE: "You rush directly into their heavy swing. You are slashed for {oppDmg} hp.",
		ENERGY_WIN: "You both rush in, countering each other's attack. No damage is dealt.",
		ENERGY_LOSE: "You both rush in, countering each other's attack. No damage is dealt.",
		ENERGY_TIED: "You both rush in, countering each other's attack. No damage is dealt."
	},
	[ACTION_TYPES.ACTION_HEAVY]: {
		RPS_WIN: "Your strong blow breaks through their quick attack. You land a big hit for {myDmg} hp.",
		RPS_LOSE: "You ready a big swing, but too slow. They block your attack, and no damage is dealt.",
		ENERGY_WIN: "You both swing, but you deflect their attack. You land a big hit for {myDmg} hp.",
		ENERGY_LOSE: "You charge mightily, but their stance is too solid. You are terribly hit for for {oppDmg} hp.",
		ENERGY_TIED: "Both charging furiously, you deflect each other's attacks. No damage is dealt.", 
	}
};

// This is dependent on the hit matrix -- idk how to unify these into a SSoT
const MOVE_TOOLTIP = {
	[ACTION_TYPES.ACTION_BLOCK]: [
		`Enemy {block}s: 0 damage`,
		`Enemy {quick}s for <span class="t">X</span>: you take <span class="t">2&#x00D7;X</span> damage`,
		`Enemy {heavy}s: 0 damage`,
	],
	[ACTION_TYPES.ACTION_QUICK]: [
		`Enemy {block}s: you deal <span class="d">2&#x00D7;{move}</span> damage`,
		`Enemy {quick}s: 0 damage`,
		`Enemy {heavy}s for <span class="t">X</span>: you take <span class="t">X</span> damage`,
	],
	[ACTION_TYPES.ACTION_HEAVY]: [
		`Enemy {block}s: 0 damage`,
		`Enemy {quick}s: you deal <span class="d">{move}</span> damage`,
		`Enemy {heavy}s for <span class="d">X < {move}</span>: you deal <span class="d">{move} - X</span> damage`,
		`Enemy {heavy}s for {move}: 0 damage`,
		`Enemy {heavy}s for <span class="t">X > {move}</span>: you take <span class="t">X - {move}</span> damage`,
	]
};

const TOOLTIP_COLORS = {
	[ACTION_TYPES.ACTION_BLOCK]: '#b9ebda',
	[ACTION_TYPES.ACTION_QUICK]: '#bbdfff',
	[ACTION_TYPES.ACTION_HEAVY]: '#e6c4f7',
};

/**************************************
* Damage Calculation
**************************************/

const HIT_MATRIX = [
	[0, 2, 4, 6, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 4, 5, 6, 7, 8],
	[0, 0, 0, 0, 4, 5, 6, 7, 8],
	[0, 0, 0, 0, 4, 5, 6, 7, 8],
	[0, 0, 0, 0, 0, 1, 2, 3, 4],
	[0, 0, 0, 0, 0, 0, 1, 2, 3],
	[0, 0, 0, 0, 0, 0, 0, 1, 2],
	[0, 0, 0, 0, 0, 0, 0, 0, 1],
	[0, 0, 0, 0, 0, 0, 0, 0, 0]
]

function outcomeDamage(defender, attacker) {
	return HIT_MATRIX[defender][attacker];
}

/**************************************
* Utility Functions
**************************************/

function actionType(move) {
	if(move == 0) return ACTION_TYPES.ACTION_BLOCK;
	if(move < 4) return ACTION_TYPES.ACTION_QUICK;
	return ACTION_TYPES.ACTION_HEAVY;
}

function formatOutcomeLabel(label, myDmg, oppDmg) {
	return label.replaceAll("{myDmg}", myDmg).replaceAll("{oppDmg}", oppDmg);
}

function checkRpsLose(a, b) {
	return (actionType(a) + 1) % 3 == actionType(b);
}

function outcomeLabel(myMove, oppMove) {
	const actionIndex = actionType(myMove);

	const labelFormatString = (() => {
		if(checkRpsLose(myMove, oppMove)) {
			return OUTCOME_LABELS[actionIndex].RPS_LOSE;
		} else if(checkRpsLose(oppMove, myMove)) {
			return OUTCOME_LABELS[actionIndex].RPS_WIN;
		} else if(oppMove > myMove) {
			return OUTCOME_LABELS[actionIndex].ENERGY_LOSE;
		} else if(oppMove < myMove) {
			return OUTCOME_LABELS[actionIndex].ENERGY_WIN;
		} else {
			return OUTCOME_LABELS[actionIndex].ENERGY_TIED;
		}
	})();

	return formatOutcomeLabel(labelFormatString, outcomeDamage(oppMove, myMove), outcomeDamage(myMove, oppMove));
}

function formatTooltipLabel(label, move) {
	return label
		.replaceAll("{block}", `<img class="inline-move" src="${ASSETS.IMG.DEFEND.SPRITE}"> <span style="filter: brightness(0.75); color: ${TOOLTIP_COLORS[ACTION_TYPES.ACTION_BLOCK]}">${ACTION_LABELS[ACTION_TYPES.ACTION_BLOCK]}</span>`)
		.replaceAll("{quick}", `<img class="inline-move" src="${ASSETS.IMG.QUICK.SPRITE}"> <span style="filter: brightness(0.75); color: ${TOOLTIP_COLORS[ACTION_TYPES.ACTION_QUICK]}">${ACTION_LABELS[ACTION_TYPES.ACTION_QUICK]}</span>`)
		.replaceAll("{heavy}", `<img class="inline-move" src="${ASSETS.IMG.HEAVY.SPRITE}"> <span style="filter: brightness(0.75); color: ${TOOLTIP_COLORS[ACTION_TYPES.ACTION_HEAVY]}">${ACTION_LABELS[ACTION_TYPES.ACTION_HEAVY]}</span>`)
		.replaceAll("{move}", move);
}

function tooltipLabel(move) {
	const actionIndex = actionType(move);

	const strings = MOVE_TOOLTIP[actionIndex].map(s => formatTooltipLabel(s, move));

	if(move == 4) strings.splice(2, 1);
	if(move == 8) strings.splice(4, 1);
	

	return strings;
}

/**************************************
* ENERGY
**************************************/
function getEnergyRecovered() {
	return Math.floor(gameState.game.roundNumber/2);
}

const MAX_ENERGY = 10;