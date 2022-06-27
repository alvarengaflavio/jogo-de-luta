const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

ctx.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const background = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    imageSrc: './assets/images/background.png',
});

const shop = new Sprite({
    position: {
        x: 600,
        y: 128,
    },
    imageSrc: './assets/images/shop.png',
    scale: 2.75,
    framesMax: 6,
});

const player = new Fighter({
    position: { x: 200, y: 0 },
    velocity: { x: 0, y: 0 },
    offset: {
        x: 0,
        y: 0,
    },
});

const enemy = new Fighter({
    position: {
        x: canvas.width - 200,
        y: 0,
    },
    velocity: { x: 0, y: 0 },
    color: 'blue',
    offset: {
        x: -50,
        y: 0,
    },
});

const keys = {
    a: {
        pressed: false,
    },
    d: {
        pressed: false,
    },
    w: {
        pressed: false,
    },
    ArrowRight: {
        pressed: false,
    },
    ArrowLeft: {
        pressed: false,
    },
    ArrowUp: {
        pressed: false,
    },
};

decreaseTimer();

function animate() {
    window.requestAnimationFrame(animate);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    background.update();
    shop.update();
    player.update();
    enemy.update();

    player.velocity.x = 0;
    enemy.velocity.x = 0;

    // Movimento do Jogador
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5;
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5;
    }

    // Movimento do Enemy
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5;
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5;
    }

    // Detectar Colisão
    if (
        rectangularCollision({ rectangle1: player, rectangle2: enemy }) &&
        player.isAttacking
    ) {
        player.isAttacking = false;
        enemy.health -= 20;
        document.querySelector('#enemyHealth').style.width = enemy.health + '%';
    }

    if (
        rectangularCollision({ rectangle1: enemy, rectangle2: player }) &&
        enemy.isAttacking
    ) {
        enemy.isAttacking = false;
        player.health -= 20;
        document.querySelector('#playerHealth').style.width =
            player.health + '%';
    }

    // FINALIZAR JOGO BASEADO NA VIDA
    if (player.health <= 0 || enemy.health <= 0) {
        determineWinner({ player, enemy, timerId });
    }
}

animate();

window.addEventListener('keydown', event => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = true;
            player.lastKey = 'd';
            break;

        case 'a':
            keys.a.pressed = true;
            player.lastKey = 'a';
            break;
        case 'w':
            keys.w.pressed = true;
            player.velocity.y = -20;
            break;

        case ' ':
            player.attack();
            break;

        case 'ArrowRight':
            keys.ArrowRight.pressed = true;
            enemy.lastKey = 'ArrowRight';
            break;

        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true;
            enemy.lastKey = 'ArrowLeft';
            break;
        case 'ArrowUp':
            keys.ArrowUp.pressed = true;
            enemy.velocity.y = -20;
            break;
        case 'ArrowDown':
            enemy.attack();
            break;

        default:
            break;
    }
    // console.log(event.key);
});

window.addEventListener('keyup', event => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false;
            break;

        case 'a':
            keys.a.pressed = false;
            break;

        case 'w':
            keys.w.pressed = false;
            break;

        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
            break;

        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
            break;

        case 'ArrowUp':
            keys.ArrowUp.pressed = false;
            break;

        default:
            break;
    }
    // console.log(event.key);
});
