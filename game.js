const player = {
    elem: function() {
        const playerElem = document.createElement('canvas');
        playerElem.setAttribute('width', 40);
        playerElem.setAttribute('height', 40);
        playerElem.getContext('2d').fillRect(0, 0, 40, 40);
        document.querySelector('body').appendChild(playerElem);
        return playerElem;
    }(),
    position: {x: 0, y: 0},
    velocity: {x: 0, y: 0},
    draw(deltaTime) {
        this.position.x += this.velocity.x * deltaTime
        this.position.y += this.velocity.y * deltaTime
        
        this.elem.style.left = this.position.x;
        this.elem.style.top = this.position.y;
    }
}

document.addEventListener('keydown', function(event) {
    switch (event.key) {
        case ''
    }
})

const gameObjects = [];
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
