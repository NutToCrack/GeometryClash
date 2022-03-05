const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

ctx.fillStyle = 'green';
ctx.fillRect(10, 10, 100, 100);

document.onkeydown = event => {
    if (event.key == 'Enter') {
        ctx.fillStyle = 'blue';
        ctx.fillRect(10, 10, 200, 100);

    }
}