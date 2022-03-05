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
    velocity: {x: 1, y: 1},
    draw(deltaTime) {
        this.x += this.velocity.x * deltaTime
        this.y += this.velocity.y * deltaTime
        this.elem.style.left = this.x;
        this.elem.style.top = this.y;
    }
}

export default player;