const screenSize = {
    width: 500,
    height: 500,
}
const body = document.querySelector('body');
const healthBar = {
    elem: document.querySelector('#health-bar > div'),
    _health: 100,
    get health() {
        return this._health;
    },
    set health(val) {
        if (val <= 0) gameOver();
        this._health = val;
        this.elem.style.width = `${Math.floor(val)}px`;
    }
}
let enemies = 20;

async function bossPhase() {
    console.log('bossSpawns');
    const boss = Object.assign(Object.create(gameObject), {
        elem: function() {
            const bossElem = document.createElement('img');
            bossElem.setAttribute('width', 300);
            bossElem.setAttribute('height', 300);
            bossElem.setAttribute('src', '1.png');
            bossElem.style.zIndex = 11;
            bossElem.onclick = function() {
                body.removeChild(bossElem);
            }
            body.appendChild(bossElem);
            return bossElem;
        }(),
        position: {x: 0, y: 0, a: 0},
        velocity: {y: 0, a: 0.3},
        size: {width: 300, height: 300},
        collisionRadius: 150,
        render(deltaTime) {
            if (
                Math.pow(player.position.x + player.size.width/2 - this.position.x - this.size.width/2, 2) + Math.pow(player.position.y + player.size.height/2 - this.position.y - this.size.height/2, 2)
                    <
                Math.pow(this.collisionRadius + player.collisionRadius, 2)
            ) gameOver(); 
            this.draw(deltaTime);
        }
    })
    gameObjects.add(boss);
}

let gameIsOver = false;
async function gameOver() {
    if (!gameIsOver) {
        gameIsOver = true;
        console.log('game ober');
        const gameOverElem = document.createElement('img');
        gameOverElem.setAttribute('src', '4.png');
        gameOverElem.setAttribute('width', '500');
        gameOverElem.setAttribute('height', '500');
        const sndBackgound = document.createElement('img');
        sndBackgound.setAttribute('src', 'funkygameover.png');
        sndBackgound.setAttribute('width', '500');
        sndBackgound.setAttribute('height', '60');
        sndBackgound.className = 'overtext';
        gameOverElem.className = 'over';
        body.appendChild(sndBackgound);
        body.appendChild(gameOverElem);
    }
}

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
        this.dead = true;
        if (this.isEnemy) {
            if (--enemies === 0) bossPhase();
        };
    }
}

function Enemy() {
    this.isEnemy = true;
    this.position = {x: Math.random()*300, y: Math.random()*300, a: 0};
    this.velocity = {y: 2, a: 0};
    this.collisionRadius = 18;
    this.size = {width: 40, height: 40};
    this.elem = document.createElement('img');
    this.elem.setAttribute('src', '2.png');
    this.elem.setAttribute('height', 40);
    this.elem.setAttribute('width', 40);
    body.appendChild(this.elem);
    this.render = function(deltaTime) {
        const dx = player.position.x - this.position.x;
        const dy = this.position.y - player.position.y;
        const angleDiff = Math.atan2(dx, dy) - reduceAngle(this.position.a);
        this.velocity.a = angleDiff > 0 ? 0.06: -0.06;
        if (
            Math.pow(player.position.x + player.size.width/2 - this.position.x - this.size.width/2, 2) + Math.pow(player.position.y + player.size.height/2 - this.position.y - this.size.height/2, 2)
                <
            Math.pow(this.collisionRadius + player.collisionRadius, 2)
        ) {
            healthBar.health -= deltaTime*2; 
        }
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
    // console.log(this.position);
    this.velocity = {y: 20, a: 0};
    this.collisionRadius = 4;
    this.size = {width: 16, height: 16};
    this.elem = document.createElement('img');
    this.elem.setAttribute('width', 16);
    this.elem.setAttribute('height', 16);
    this.elem.setAttribute('src', 'pocisk.png');
    body.appendChild(this.elem);
    this.render = function(deltaTime) {
        this.draw(deltaTime);
        for (go of gameObjects) {
            if (
                !go.dead
                    &&
                    Math.pow(go.position.x + go.size.width/2 - this.position.x - this.size.width/2, 2) + Math.pow(go.position.y + go.size.height/2 - this.position.y - this.size.height/2, 2)
                        <
                    Math.pow(this.collisionRadius + go.collisionRadius, 2)
                    && 
                go !== player 
                    && 
                go !== this
            ) {
                go.commitDeath();
                this.commitDeath();
                break;
            }
        }
    }
    if (this.position.x < 21 || this.position.x > (screenSize.width - 21) || this.position.y < 21 || this.position.y > (screenSize.height - 21)) {
        this.commitDeath();
    }
}
Bullet.prototype = gameObject;

const player = Object.assign(Object.create(gameObject), {
    elem: function() {
        const playerElem = document.createElement('img');
        playerElem.setAttribute('width', 40);
        playerElem.setAttribute('height', 40);
        playerElem.setAttribute('src', '3.png');
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
