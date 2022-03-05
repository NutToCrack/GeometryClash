const screenSize = {
    width: 500,
    height: 500,
}
const body = document.querySelector('body');

function reduceAngle(angle) {
    const sgn = Math.sign(angle);
    let a = sgn*angle % (2*Math.PI);
    if (a > Math.PI) {
        a -= 2*Math.PI;
    }
    return a*sgn;
}

const gameObject = {
    draw(deltaTime) {
        this.position.x += this.velocity.y * deltaTime * Math.sin(this.position.a);
        this.position.y -= this.velocity.y * deltaTime * Math.cos(this.position.a);
        this.position.a += this.velocity.a * deltaTime;
        this.position.x = Math.min(Math.max(this.position.x, 0), screenSize.width - this.size.width);
        this.position.y = Math.min(Math.max(this.position.y, 0), screenSize.height - this.size.height);
        this.elem.style.left = `${this.position.x}px`;
        this.elem.style.top = `${this.position.y}px`;
        this.elem.style.transform = `rotate(${this.position.a}rad)`;
    },
    commitDeath() {
        body.removeChild(this.elem);
        gameObjects.delete(this);
    }
}

function Enemy() {
    this.position = {x: Math.random()*300, y: Math.random()*300, a: 0};
    this.velocity = {y: 2, a: 0};
    this.collisionRadius = 18;
    this.size = {width: 40, height: 40};
    this.elem = document.createElement('canvas');
    this.elem.setAttribute('width', 40);
    this.elem.setAttribute('height', 40);
    this.elem.getContext('2d').strokeRect(0, 0, 40, 40);
    this.elem.getContext('2d').fillRect(10, 0, 20, 20);
    body.appendChild(this.elem);
    this.render = function(deltaTime) {
        const dx = player.position.x - this.position.x;
        const dy = this.position.y - player.position.y;
        const angleDiff = Math.atan2(dx, dy) - reduceAngle(this.position.a);
        this.velocity.a = angleDiff > 0 ? 0.06: -0.06;
        this.draw(deltaTime);
    }
}
Enemy.prototype = gameObject;

function Bullet(position) {
    this.position = {
        a: position.a,
        x: position.x + player.size.width/2,
        y: position.y + player.size.height/2,
    };
    this.velocity = {y: 20, a: 0};
    this.collisionRadius = 4;
    this.size = {width: 20, height: 20};
    this.elem = document.createElement('canvas');
    this.elem.setAttribute('width', 6);
    this.elem.setAttribute('height', 6);
    this.elem.getContext('2d').strokeRect(0, 0, 6, 6);
    this.elem.getContext('2d').fillRect(8, 0, 6, 2);
    body.appendChild(this.elem);
    this.render = function(deltaTime) {
        this.draw(deltaTime);
        for (go of gameObjects) {
            if (
                    Math.pow(go.position.x + go.size.width/2 - this.position.x - this.size.width/2, 2) + Math.pow(go.position.y + go.size.height/2 - this.position.y - this.size.height/2, 2)
                        <
                    (this.collisionRadius + go.collisionRadius) 
                    && 
                go !== player 
                    && 
                go !== this
            ) {
                go.commitDeath();
                this.commitDeath();
            }
        }
    }
}
Bullet.prototype = gameObject;

const player = Object.assign(Object.create(gameObject), {
    elem: function() {
        const playerElem = document.createElement('canvas');
        playerElem.setAttribute('width', 40);
        playerElem.setAttribute('height', 40);
        playerElem.getContext('2d').fillRect(0, 0, 40, 40);
        body.appendChild(playerElem);
        return playerElem;
    }(),
    position: {x: 0, y: 0, a: 0},
    velocity: {y: 0, a: 0},
    size: {width: 40, height: 40},
    collisionRadius: 18,
    render(deltaTime) {
        this.draw(deltaTime);
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
        up: () => player.velocity.a -= 0.15,
        down: () => player.velocity.a += 0.15,
        pressed: false
    },
    ArrowLeft: {
        up: () => player.velocity.a += 0.15,
        down: () => player.velocity.a -= 0.15,
        pressed: false
    },
    ArrowUp: {
        up: () => player.velocity.y -= 15,
        down: () => player.velocity.y += 15,
        pressed: false
    },
    ArrowDown: {
        up: () => player.velocity.y += 15,
        down: () => player.velocity.y -= 15,
        pressed: false
    },
    ' ': {
        up: () => null,
        down: () => gameObjects.add(new Bullet(player.position)),
        pressed: false
    }
}

document.addEventListener('keydown', function(event) {
    keyHandlers.keyDown(event.key);
})

document.addEventListener('keyup', function(event) {
    keyHandlers.keyUp(event.key);
})

const gameObjects = new Set();
const canvasManager = {
    lastRefresh: Date.now(),
    refresh() {
        const deltaTime = (Date.now() - this.lastRefresh) / 50;
        this.lastRefresh = Date.now();
        gameObjects.forEach(go => go.render(deltaTime));
    },
}

gameObjects.add(player);

for (let i = 0; i < 20; ++i) {
    gameObjects.add(new Enemy());
}

setInterval(() => canvasManager.refresh(), 33);
