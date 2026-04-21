// Update card positioning
const cards = [...document.getElementById('move-cards').children];

window.addEventListener('mousemove',(ev) => {
    const mouseX = ev.clientX;
    const mouseY = ev.clientY;
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const rectX = rect.x + rect.width * 0.5;
        const rectY = rect.y + rect.height * 0.5;

        const dx = mouseX - rectX;
        const dy = mouseY - rectY;

        const angle = Math.atan(Math.hypot(dx, dy) / 30) * 2 / Math.PI;

        card.style.transform = `rotate3d(${-dy}, ${dx}, 0, ${angle * 32}deg)`

        const downFacingness = Math.atan(Math.max(0, dy) / 90) * 2 / Math.PI;
        console.log(downFacingness)
        const lightness = 50 - 5 * downFacingness;
        // card.style.background = `linear-gradient(0deg, hsl(43 74% 50% / 1), hsl(43 74% ${lightness}% / 1))`
        card.style.background = `hsl(43 74% ${lightness}%`
    })
})