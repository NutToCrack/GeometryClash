const gameObjects = [];
const canvasSize = {
    width: 500,
    height: 500
}
const canvasManager = {
    lastRefresh: Date.now(),
    currentCanvas: document.getElementById('canvas1'),
    bufferedCanvas: document.getElementById('canvas2'),
    repaint() {
        const ctx = this.bufferedCanvas.getContext('2d');
        const deltaTime = Date.now() - this.lastRefresh;
        this.lastRefresh = Date.now();
        ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
        gameObjects.forEach(go => go.draw(ctx, deltaTime));
        this.currentCanvas.style.visibility = 'hidden';
        this.bufferedCanvas.style.visibility = 'visible';
        [this.bufferedCanvas, this.currentCanvas] = [this.currentCanvas, this.bufferedCanvas];
    },
}

const start = Date.now();

gameObjects.push({draw(ctx) {
    ctx.fillRect((Date.now() - start), 0, 100, 100);
}});

setInterval(() => canvasManager.repaint(), 33);