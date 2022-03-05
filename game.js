import player from "./player";

const gameObjects = [];
const canvasSize = {
    width: 500,
    height: 500
}
const canvasManager = {
    lastRefresh: Date.now(),
    refresh() {
        const deltaTime = (Date.now() - this.lastRefresh) / 50;
        this.lastRefresh = Date.now();
        gameObjects.forEach(go => go.draw(deltaTime));
    },
}

gameObjects.push(player);

setInterval(() => canvasManager.refresh(), 33);