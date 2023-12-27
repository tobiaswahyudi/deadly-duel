/**************************************
* hit-calculation.js
*
* Configuration and utilities for scoring and labeling hit outcomes.
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

const OUTCOME_LABELS = {
	[ACTION_TYPES.ACTION_BLOCK]: {
		RPS_WIN: "They ready a big swing, but you block in time. No damage is dealt.",
		RPS_LOSE: "You prepare to block but they attack quickly, slashing you for {oppDmg} hp.",
		ENERGY_TIED: "You both block. Nothing happens.",
	},
	[ACTION_TYPES.ACTION_QUICK]: {
		RPS_WIN: "You attack quickly past their defenses, slashing for {myDmg} hp.",
		RPS_LOSE: "You rush directly into their heavy swing. You are slashed for {oppDmg} hp.",
		ENERGY_WIN: "They dash for an attack but your counter is quicker, hitting them for {myDmg} hp.",
		ENERGY_LOSE: "You attempt a quick attack, but they are faster. You are injured for {oppDmg} hp.",
		ENERGY_TIED: "You both rush in, countering each other's attack. No damage is dealt."
	},
	[ACTION_TYPES.ACTION_HEAVY]: {
		RPS_WIN: "Your strong blow breaks through their quick attack. You land a big hit for {myDmg} hp.",
		RPS_LOSE: "You ready a big swing, but too slow. They block your attack, and no damage is dealt.",
		ENERGY_WIN: "You both swing, but you deflect their attack. You land a big hit for {myDmg} hp.",
		ENERGY_LOSE: "You charge mightily, but their stance is too solid. You are terribly hit for for {oppDmg} hp.",
		ENERGY_TIED: "Both charging furiously, you manage to hit each other. You are both injured for {oppDmg} hp.", 
	}
};

/**************************************
* Damage Calculation
**************************************/

const HIT_MATRIX = [
	[0, 2, 4, 6, 0, 0, 0, 0, 0],
	[0, 0, 1, 1, 3, 4, 5, 6, 7],
	[0, 0, 0, 1, 2, 3, 4, 5, 6],
	[0, 0, 0, 0, 1, 2, 3, 4, 5],
	[0, 0, 0, 0, 1, 1, 2, 3, 4],
	[0, 0, 0, 0, 0, 1, 1, 2, 3],
	[0, 0, 0, 0, 0, 0, 2, 1, 2],
	[0, 0, 0, 0, 0, 0, 0, 2, 1],
	[0, 0, 0, 0, 0, 0, 0, 0, 3]
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
	return label.replace("{myDmg}", myDmg).replace("{oppDmg}", oppDmg);
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
