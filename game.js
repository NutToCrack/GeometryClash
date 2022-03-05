const screenSize = {
    width: 500,
    height: 500,
}

const gameObject = {
    
}

const player = Object.assign(Object.create(gameObject), {
    elem: function() {
        const playerElem = document.createElement('canvas');
        playerElem.setAttribute('width', 40);
        playerElem.setAttribute('height', 40);
        playerElem.getContext('2d').fillRect(0, 0, 40, 40);
        document.querySelector('body').appendChild(playerElem);
        return playerElem;
    }(),
    position: {x: 0, y: 0, a: 0},
    velocity: {x: 0, y: 0, a: 0},
    size: {width: 40, height: 40},
    draw(deltaTime) {
        this.position.x += this.velocity.y * deltaTime * Math.sin(this.position.a);
        this.position.y -= this.velocity.y * deltaTime * Math.cos(this.position.a);
        this.position.a += this.velocity.a * deltaTime;
        this.position.x = Math.min(Math.max(this.position.x, 0), screenSize.width - this.size.width);
        this.position.y = Math.min(Math.max(this.position.y, 0), screenSize.height - this.size.height);
        this.elem.style.left = `${this.position.x}px`;
        this.elem.style.top = `${this.position.y}px`;
        this.elem.style.transform = `rotate(${this.position.a}rad)`;
    }
})

const keyHandlers = {
    keyDown(code) {
        const key = this[code];
        if (key && !key.pressed) {
            key.pressed = true;
            key.down(); 
        }
    },
    keyUp(code) {
        const key = this[code];
        if (key) {
            key.up();
            key.pressed = false; 
        }
    },
    ArrowRight: {
        up: () => player.velocity.a -= 0.05,
        down: () => player.velocity.a += 0.05,
        pressed: false
    },
    ArrowLeft: {
        up: () => player.velocity.a += 0.05,
        down: () => player.velocity.a -= 0.05,
        pressed: false
    },
    ArrowUp: {
        up: () => player.velocity.y -= 5,
        down: () => player.velocity.y += 5,
        pressed: false
    },
    ArrowDown: {
        up: () => player.velocity.y += 5,
        down: () => player.velocity.y -= 5,
        pressed: false
    },
}

document.addEventListener('keydown', function(event) {
    keyHandlers.keyDown(event.key);
})

document.addEventListener('keyup', function(event) {
    keyHandlers.keyUp(event.key);
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
