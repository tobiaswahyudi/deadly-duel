/**************************************
 * canvas.js
 *
 * Game display
 **************************************/

let ctx;
const loadedImages = new Map();

function initializeCanvas(canvas) {
  // Get currently displayed page
  // This will be the menu page in deployment, and during dev could be game page
  const pages = [...document.getElementsByTagName('page')];
  const width = pages.map(page => page.children[0].getBoundingClientRect().width).find(v => !!v) || 1

  // console.log(pages, width, canvas)
  
  canvas.width = 480;
  canvas.height = 240;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${width / 2}px`;

  const context = canvas.getContext("2d");
  ctx = context;

  const duelistImg = new Image();
  duelistImg.src = "img/duelist.png";

  duelistImg.onload = () => {
    context.translate(240, 0);
    context.drawImage(duelistImg, -230, 0, 240, 240);
    context.scale(-1, 1);
    context.drawImage(duelistImg, -230, 0, 240, 240);
  };
}

async function loadImage(src) {
  if (loadedImages.has(src)) {
    return loadedImages.get(src);
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      loadedImages.set(src, img);
      resolve(img);
    };
    img.onerror = reject;
    img.src = src;
  });
}

// Preload multiple images
async function preloadImages() {
  try {
    await Promise.all(ALL_ASSETS.map((path) => loadImage(path)));
    console.log("All images preloaded");
  } catch (error) {
    console.error("Error preloading images:", error);
  }
}

async function preloadFonts() {
  try {
    await Promise.all(
      FONTS.map(([fontName, weights]) =>
        Promise.all(
          weights.map((weight) =>
            document.fonts.load(`${weight} 12px ${fontName}`),
          ),
        ),
      ),
    );
    console.log("All fonts preloaded");
  } catch (error) {
    console.error("Error preloading fonts:", error);
  }
}

// Draw image utility
function drawImage(src, x, y, width = null, height = null, clip = {}) {
  const { x: clipX, y: clipY, width: clipWidth, height: clipHeight } = clip;
  const img = loadedImages.get(src);
  if (!img) {
    console.warn(`Image not loaded: ${src}`);
    return;
  }

  if (Object.keys(clip).length > 0) {
    ctx.drawImage(
      img,
      clipX,
      clipY,
      clipWidth,
      clipHeight,
      x,
      y,
      width,
      height,
    );
  } else if (width && height) {
    ctx.drawImage(img, x, y, width, height);
  } else {
    ctx.drawImage(img, x, y);
  }
}
