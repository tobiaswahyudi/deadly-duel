/**************************************
* canvas.js
*
* Game display
**************************************/

function initializeCanvas(canvas) {
  const sectionInMenuWidth = document.getElementById('menu-select').getBoundingClientRect().width;
  const sectionInGameWidth = document.getElementById('enter-name').getBoundingClientRect().width;

  // While debugging, sectionInMenuWidth will be 0, so use sectionInGameWidth.
  const width = sectionInMenuWidth || sectionInGameWidth;

  canvas.width = 480;
  canvas.height = 240;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${width/2}px`;

  const context = canvas.getContext('2d');

  const duelistImg = new Image();
  duelistImg.src = "img/duelist.png";

  duelistImg.onload = () => {
    context.translate(240, 0);
    context.drawImage(duelistImg, -230, 0, 240, 240);
    context.scale(-1, 1);
    context.drawImage(duelistImg, -230, 0, 240, 240);
  }
}