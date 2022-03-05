export default const player = {
    position: {x: 0, y: 0},
    velocity: {x: 0, y: 0},
    draw(ctx, deltaTime) {
        this.x += this.velocity.x * deltaTime
        this.y += this.velocity.y * deltaTime
        ctx.
    }
}