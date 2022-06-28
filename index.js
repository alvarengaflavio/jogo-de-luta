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
    imageSrc: './assets/images/samuraiMack/Idle.png',
    framesMax: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 157,
    },
    sprites: {
        idle: {
            imageSrc: './assets/images/samuraiMack/Idle.png',
            framesMax: 8,
        },
        run: {
            imageSrc: './assets/images/samuraiMack/Run.png',
            framesMax: 8,
        },
        jump: {
            imageSrc: './assets/images/samuraiMack/Jump.png',
            framesMax: 2,
        },
        fall: {
            imageSrc: './assets/images/samuraiMack/Fall.png',
            framesMax: 2,
        },
        attack1: {
            imageSrc: './assets/images/samuraiMack/Attack1.png',
            framesMax: 6,
        },
        takehit: {
            imageSrc:
                './assets/images/samuraiMack/Take hit - white silhouette.png',
            framesMax: 4,
        },
        death: {
            imageSrc: './assets/images/samuraiMack/Death.png',
            framesMax: 6,
        },
    },
    attackBox: {
        offset: {
            x: 100,
            y: 50,
        },
        width: 150,
        height: 50,
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
    imageSrc: './assets/images/kenji/Idle.png',
    framesMax: 4,
    scale: 2.5,
    offset: {
        x: 215,
        y: 167,
    },
    sprites: {
        idle: {
            imageSrc: './assets/images/kenji/Idle.png',
            framesMax: 4,
        },
        run: {
            imageSrc: './assets/images/kenji/Run.png',
            framesMax: 8,
        },
        jump: {
            imageSrc: './assets/images/kenji/Jump.png',
            framesMax: 2,
        },
        fall: {
            imageSrc: './assets/images/kenji/Fall.png',
            framesMax: 2,
        },
        attack1: {
            imageSrc: './assets/images/kenji/Attack1.png',
            framesMax: 4,
        },
        takehit: {
            imageSrc: './assets/images/kenji/Take hit.png',
            framesMax: 3,
        },
        death: {
            imageSrc: './assets/images/kenji/Death.png',
            framesMax: 7,
        },
    },
    attackBox: {
        offset: {
            x: -170,
            y: 50,
        },
        width: 170,
        height: 50,
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
        player.switchSprite('run');
        player.velocity.x = -5;
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.switchSprite('run');
        player.velocity.x = 5;
    } else {
        player.switchSprite('idle');
    }
    // PULANDO
    if (player.velocity.y < 0) {
        player.switchSprite('jump');
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall');
    }

    // Movimento do Enemy
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.switchSprite('run');
        enemy.velocity.x = -5;
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.switchSprite('run');
        enemy.velocity.x = 5;
    } else {
        enemy.switchSprite('idle');
    }
    // PULANDO
    if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump');
    } else if (player.velocity.y > 0) {
        enemy.switchSprite('fall');
    }

    // Detectar Colisão
    if (
        rectangularCollision({ rectangle1: player, rectangle2: enemy }) &&
        player.isAttacking &&
        player.framesCurrent === 4
    ) {
        enemy.takeHit();
        player.isAttacking = false;

        document.querySelector('#enemyHealth').style.width = enemy.health + '%';
    }

    if (
        rectangularCollision({ rectangle1: enemy, rectangle2: player }) &&
        enemy.isAttacking &&
        enemy.framesCurrent === 2
    ) {
        player.takeHit();
        enemy.isAttacking = false;
        document.querySelector('#playerHealth').style.width =
            player.health + '%';
    }
    // SE JOGADOR ERRAR
    if (player.isAttacking && player.framesCurrent === 4) {
        player.isAttacking = false;
    }
    // SE INIMIGO ERRAR
    if (enemy.isAttacking && enemy.framesCurrent === 2) {
        enemy.isAttacking = false;
    }

    // FINALIZAR JOGO BASEADO NA VIDA
    if (player.health <= 0 || enemy.health <= 0) {
        determineWinner({ player, enemy, timerId });
    }
}

animate();

window.addEventListener('keydown', event => {
    if (!player.dead) {
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
        }
    }

    if (!enemy.dead) {
        switch (event.key) {
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
