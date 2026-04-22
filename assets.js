const ASSETS = {
  IMG: {
    DUELIST: "img/duelist.png",
    DEFEND: {
      CARD: "img/def.png",
      SPRITE: "img/def.png",
    },
    QUICK: {
      CARD: "img/quick.png",
      SPRITE: "img/quick-sprite.png",
    },
    HEAVY: {
      CARD: "img/heavy.png",
      SPRITE: "img/heavy-sprite.png",
    },
  },
};

const _flatten = (obj) => {
  return Object.values(obj).flatMap((v) =>
    typeof v === "object" ? _flatten(v) : v
  );
};

const ALL_ASSETS = _flatten(ASSETS);
