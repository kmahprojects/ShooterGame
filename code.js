const canvas = document.querySelector('canvas');
const c = canvas.getContext("2d");

//game will be used to start game on clicking start button
let game;
//setting canvas width and height in here
canvas.width = 1024;
canvas.height = 640;



//scoreElem and healthElem are for updating in-game display of score and health
const scoreElem = document.getElementById("scoreElem");
const healthElem = document.getElementById("healthElem");
//this makes it so the score and health do not appear until the game starts
const onScreenText = document.getElementsByClassName("onScreenText")[0];
onScreenText.style.display = "none";

//the start button
const startButton = document.getElementsByClassName("startButton")[0];
//help info screen
const help = new Image();
help.src = './img/Instructions.png'
//two buttons, one to open the help info screen, one to close it

const helpButton = document.getElementsByClassName("infoButton")[0];
const closeHelpButton = document.getElementsByClassName("closeInfoButton")[0];
function infoScreen() {
    c.drawImage(help, (canvas.width/2 - help.width/2), (canvas.height/2 - help.height/2));
    helpButton.style.display = "none";
    startButton.style.display = "none";
    closeHelpButton.style.display = 'block';
}

function closeInfoScreen() {
    c.clearRect(0,0, canvas.width, canvas.height);
    c.drawImage(startScreenImage, 0, 0);
    helpButton.style.display = "block";
    startButton.style.display = "block";
    closeHelpButton.style.display = 'none';
}
//restart button

const mainMenuButton = document.getElementsByClassName("mainMenuButton")[0];
function mainMenu() {
    location.reload();
}

//the background image
const backgroundImage = new Image();
backgroundImage.src = './img/background.png'
const startScreenImage = new Image();
startScreenImage.src = './img/StartScreen.png'
window.onload = function() {c.drawImage(startScreenImage, 0, 0);} 

//used to change the background's height over time
var imageHeight = 0;
//used to create a scrolling background 
function scrollBackground() {
    c.drawImage(backgroundImage, 0, imageHeight);
    c.drawImage(backgroundImage, 0, imageHeight - canvas.height);
    imageHeight += 5;
    if (imageHeight >= canvas.height) {
        imageHeight = 0;
    }
    
}

//game over image
const gameOverImage = new Image();
gameOverImage.src = './img/GameOver.png'

//victory image
const victoryImage = new Image();
victoryImage.src = './img/VictoryScreen.png'

//keys default setting is false to stop movement
const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    space: {
        pressed: false
    }
};
//checks when key is pressed
addEventListener('keydown', function (event) {
    if (winCondition > 0) {
        return;
    }
    if (gameOver > 0) { 
        return;
    }
    if (event.key === 'a') {
        keys.a.pressed = true;
    }
    if (event.key === 'd') {
        keys.d.pressed = true;
    }
    if (event.key === ' ') {
        keys.space.pressed = true;
    }
});

//checks when key is lifted
addEventListener('keyup', function (event) {
    if (event.key === 'a') {
        keys.a.pressed = false;
    }
    if (event.key === 'd') {
        keys.d.pressed = false;
    }
    if (event.key === ' ') {
        keys.space.pressed = false;
    }
});


//player image
class Player {
    constructor() {

        this.velocity = {
            x: 0,
            y: 0
        }

        this.rotation = 0;
        this.opacity = 1;

        const image = new Image();
        image.src = './img/dragon.png'
        image.onload = () => {
            const scale = 0.5;
            this.image = image;
            this.width = image.width * scale;
            this.height = image.height * scale;
            this.position = {
                x: canvas.width / 2 - this.width / 2,
                y: canvas.height - this.height - 30
            }
        }
    }
    draw() {
        c.save();
        c.globalAlpha = this.opacity;
        c.translate(player.position.x + player.width / 2, player.position.y + player.height / 2);
        c.rotate(this.rotation);
        c.translate(-player.position.x - player.width / 2, -player.position.y - player.height / 2);
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
        c.restore();
    }
    //checking player position inside update
    update() {
        if (this.image) {
            if (keys.a.pressed && player.position.x > 0) {
                player.velocity.x = - 25;
            } else if (keys.d.pressed && player.position.x + player.width < canvas.width) {
                player.velocity.x = 25;
            } else {
                player.velocity.x = 0;
            }
            if (player.position.x <= 0) {
                player.position.x = 0;
            } else if (player.position.x + player.width >= canvas.width) {
                player.position.x = canvas.width - player.width;
            }
            if (keys.a.pressed) {
                player.rotation = -0.15;
            } else if (keys.d.pressed) {
                player.rotation = 0.15;
            } else {
                player.rotation = 0;
            }
            
            this.position.x += this.velocity.x;
            this.draw();
        }
    }

};

//player projectiles
class AcidBall {
    constructor({ position }) {
        this.position = position;

        const image = new Image();
        image.src = './img/acidball.png'
        image.onload = () => {
            const scale = 0.5;
            this.image = image;
            this.width = image.width * scale;
            this.height = image.height * scale;
            this.position = {
                x: player.position.x + player.width/2 - this.width/2,
                y: player.position.y
            };
            this.velocity = {
                x: 0,
                y: -30
            }
        }
    }
    draw() {
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    }
    update() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.draw()
    }
};


//the base princess used as the normal enemy
class Princess {
    constructor({ position }) {
        this.position = position;

        const image = new Image();
        image.src = './img/NormalPrincess.png'
        image.onload = () => {
            const scale = 0.5;
            this.image = image;
            this.width = image.width * scale;
            this.height = image.height * scale;
            this.position = {
                x: Math.random() * (canvas.width - this.width),
                y: 0
            }
            this.velocity = {
                x: 0,
                y: 10
            }
        }
    }
    draw() {
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    }
    update() {
        if (this.image) {

            this.position.x += this.velocity.x
            this.position.y += this.velocity.y
            this.draw()
        }
    }
};

//FastPrincess are princesses that move to the player much faster than normal
class FastPrincess {
    constructor( {position} ) {
        this.position = position;

        const image = new Image();
        image.src = './img/FastPrincess.png'
        image.onload = () => {
            const scale = 0.5;
            this.image = image;
            this.width = image.width * scale;
            this.height = image.height * scale;
            this.position = {
                x: Math.random() * (canvas.width - this.width),
                y: 0
            }
            this.velocity = {
                x: 0,
                y: 20
            }
    
        }
    }
    draw() {
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    }
    update() {
        if (this.image) {

            this.position.x += this.velocity.x
            this.position.y += this.velocity.y
            this.draw()
        }
    }
};

//MagePrincesses move side to side and shoot at people
class MagePrincess {
    constructor( {position} ) {
        this.position = position;

        const image = new Image();
        image.src = './img/MagePrincess.png'
        image.onload = () => {
            const scale = 0.5;
            this.image = image;
            this.width = image.width * scale;
            this.height = image.height * scale;
            this.position = {
                x: Math.random() * (canvas.width - this.width / 2),
                y: 0
            }
            this.velocity = {
                x: 0,
                y: 10
            }
        }
    }
    draw() {
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    }
    update() {
        if (this.image) {

            this.position.x += this.velocity.x
            this.position.y += this.velocity.y
            if(this.position.y < 250) {
                this.velocity.x = 0;
                this.velocity.y = 10;
            }
            if(this.position.y > 250 && this.velocity.x == 0) {
                this.velocity.x = 10;
                this.velocity.y = 0;
            }
            if (this.position.x + this.width >= canvas.width) {
                this.velocity.x = -10;
                this.velocity.y = 0;
            }

            if (this.position.x <= 0) {
                this.velocity.x = 10;
                this.velocity.y = 0;
            }
            this.draw()
        }
    }
    shoot(array) {
        array.push(new MagicMissile ({
            position: {
                x: this.position.x + this.width/2,
                y: this.position.y + this.height/2
            }
        
        }));
    }
};

//enemyprojectiles, acidball.png is a placeholder at the moment
class MagicMissile {
    constructor({ position }) {
        this.position = position;

        const image = new Image();
        image.src = './img/Magicmissile.png'
        image.onload = () => {
            const scale = 0.5;
            this.image = image;
            this.width = image.width * scale;
            this.height = image.height * scale;
            this.position = {
                x: this.position.x - this.width/2,
                y: this.position.y
            };
            this.velocity = {
                x: 0,
                y: 20
            }
        }
    }
    draw() {
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    }
    update() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.draw()
    }
};

class FinalBossPrincess {
        constructor( {position} ) {
        this.position = position;
        this.opacity = 1;
        const image = new Image();
        image.src = './img/FinalBossPrincess.png'
        image.onload = () => {
            const scale = 0.5;
            this.image = image;
            this.width = image.width * scale;
            this.height = image.height * scale;
            this.position = {
                x: canvas.width/2 - this.width/2,
                y: 0
            }
            this.velocity = {
                x: 0,
                y: 5
            }
        }
    }
    draw() {
        c.save();
        c.globalAlpha = this.opacity;
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
        c.restore();
    }
    update() {
        if (this.image) {

            this.position.x += this.velocity.x
            this.position.y += this.velocity.y
            if(this.position.y < 50) {
                this.velocity.x = 0;
                this.velocity.y = 5;
            }
            if(this.position.y > 50 && this.velocity.x == 0) {
                this.velocity.x = 0;
                this.velocity.y = 0;
            }

            this.draw()
        }
    }
};

class FinalBossMissile {
    constructor ({position}) {
        this.position = position;

        const image = new Image();
        image.src = './img/FinalBossMagicMissile.png'
        image.onload = () => {
            const scale = 0.5;
            this.image = image;
            this.width = image.width * scale;
            this.height = image.height * scale;
            this.angle = Math.atan2(
                FinalBossBattle.position.y + FinalBossBattle.height/2 - player.position.y + player.height/2,
                FinalBossBattle.position.x  + FinalBossBattle.width/2 - player.position.x - player.width/2
            );
            this.position = {
                x: FinalBossBattle.position.x + FinalBossBattle.width/2 - this.width/2,
                y: FinalBossBattle.position.y + FinalBossBattle.height/1.3
            };
            this.velocity = {
                x: -30*Math.cos(this.angle),
                y: 30*Math.sin(-this.angle)
            }
        }
    }
    draw() {
        c.save();
        c.translate(this.position.x + this.width / 2, this.position.y + this.height / 2);
        c.rotate(Math.cos(this.angle));
        c.translate(-this.position.x - this.width / 2, -this.position.y - this.height / 2);
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
        c.restore();
    }
    update() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.draw()
    }
}


//

//explosion effect created when something dies
//opacity decreases with each update function, making explosions fade out 
//Math.random - 0.5 times 2 used to make things go all directions
//negative values go up, positive go down, so -0.5 will create some going up and some going down
class explosionEffect {
    constructor({ position, radius, color }) {
        this.position = position;
        this.velocity = {
        x: (Math.random() - 0.5)*2,
        y: (Math.random() - 0.5)*2
        }
        this.radius = radius;
        this.color = color;
        this.opacity = 2;
    }
    draw() {
        c.save();
        c.globalAlpha = this.opacity
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = this.color;
        c.fill();
        c.closePath();
        c.restore();
    }
    update() {
        this.opacity -= 0.1;
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.draw();
    }
};


//creating arrays to put the images in
const player = new Player();
const projectiles = [];
const NormalPrincesses = [];
const FastPrincesses = [];
const MagePrincesses = [];
const MagePrincessesMissiles = [];
const FinalBossBattle = new FinalBossPrincess({position:{}});
const FinalBossMissiles = [];
const explosion = [];

//tests for collision between two objects
function collisionDetection(a, b) {
    if (a.position.x <= b.position.x + b.width &&
        a.position.x + a.width >= b.position.x &&
        a.position.y <= b.position.y + b.height &&
        a.position.y + a.height >= b.position.y) {
            return true;
        } else {
            return false;
        }
}

//this function puts projectiles into an array for the player to shoot
function playerShooting() {
    projectiles.push(new AcidBall({position:{}}));
};

function bossShooting() {
    FinalBossMissiles.push(new FinalBossMissile({position:{}}));
}

//this function creates normal princesses
function SpawnNormalPrincess() {
    NormalPrincesses.push(new Princess({position:{}}));
};

//this function spawns fast princesses that move faster
function SpawnFastPrincess() {
    FastPrincesses.push(new FastPrincess({position:{}}));
}

//this function spawns mage princesses that shoot back
function SpawnMagePrincess() {
    MagePrincesses.push(new MagePrincess({position:{}}));
}
//this function creates an acid explosion, call upon when a projectile kills an enemy 
function acidExplosion (Enemy) {
    for (let i = 0; i < 40; i++) {
        explosion.push(new explosionEffect({
            position: {
                x: Enemy.position.x + Enemy.width/2,
                y: Enemy.position.y + Enemy.height/2
                },
                radius: Math.random() * 7,
                color: 'rgb(129, 198, 0)'
            }))
        }
}
//creates explosion when player is hit by something
function playerHit (Hitter, color) {
    for (let i = 0; i < 30; i++) {  
    explosion.push(new explosionEffect({
        position: {
            x: Hitter.position.x + Hitter.width/2,
            y: Hitter.position.y + Hitter.height/2
            },
            radius: Math.random() * 5,
            color: color
        }))
        }  
    }

function bossDeath() {
    for (let i = 0; i < 40; i++) {
        explosion.push(new explosionEffect({
            position: {
                x: FinalBossBattle.position.x + FinalBossBattle.width/2,
                y: FinalBossBattle.position.y + FinalBossBattle.height/2
                },
                radius: Math.random() * 10,
                color: 'rgb(129, 198, 0)'
            }))
        }
}

//creation of various variables to constantly check in-game
let fireRate = 0; //used to check player firing rate
let NormalEnemySpawnRate = 0; //used to set NormalPrincess spawn rate
let FastEnemySpawnRate = 0; //used to set FastPrincess spawn rate
let MageEnemySpawnRate = 0; //used to set MagePrincess spawn rate
let MageEnemyFireRate = 0; //used to set MagePrincess firing rate
let FinalBossFireRate = 0;
let score = 0; //score
let health = 10; //how many hits you can take
let gameOver = 0; //used to check if the player is killed or not
let winCondition = 0; //used to check if player has killed the final boss
let FinalBossHealth = 25; //final boss health


//main game function
function animate() {
    scrollBackground();
    //if opacity is below value, remove the circles drawn
    explosion.forEach((explosionEffect, i) => {
        if (explosionEffect.opacity <= 0.5) {
            explosion.splice(i, 1);
        } else {
            explosionEffect.update();} 
    })
    //if acidball is outside of the area of play, remove it 
    projectiles.forEach((AcidBall, index) => {
        if (AcidBall.position.y + AcidBall.height <= 0) {
            projectiles.splice(index, 1);
        } else {
            AcidBall.update();
        }
        if (collisionDetection(AcidBall, FinalBossBattle) == true && FinalBossBattle.opacity != 0 && score >= 1000) {
            projectiles.splice(index, 1);
            FinalBossHealth--;
            
        }
    })
    FinalBossMissiles.forEach((FinalBossMissile, index) => {
        if (collisionDetection(player, FinalBossMissile) == true && player.opacity != 0 && FinalBossBattle.opacity != 0) {
            playerHit(FinalBossMissile, 'rgb(216,72,255)');
            FinalBossMissiles.splice(index, 1);
            health -= 1;
            healthElem.innerHTML = health;
        }
        if (FinalBossMissile.position.y + FinalBossMissile.height <= 0) {
            projectiles.splice(index, i);
        } else {
            FinalBossMissile.update();
        }
    })
    
    
    
    //if holding space and firing rate is above certain value, shoots
    //if not, increases fire rate
    if (keys.space.pressed && fireRate >= 4) {
        playerShooting();
        fireRate = 0;
    } else {
        fireRate++;
    }

    player.update();

    if (score >= 1000) {
        FinalBossBattle.update();
        if(FinalBossFireRate == 20 && FinalBossHealth > 0) {
            bossShooting();
        }
        if (FinalBossFireRate == 25 && FinalBossHealth > 0) {
            bossShooting();
        }
        if(FinalBossFireRate >= 30 && FinalBossHealth > 0) {
            bossShooting();
            FinalBossFireRate = 0;
            }   
            else if (FinalBossHealth > 0){
            FinalBossFireRate++;
        }
    }

    
    //if player is not dead and missile hits player, remove the projectile
    //also removes projectile if missile is past the canvas height
    MagePrincessesMissiles.forEach((MagicMissile, index) => {
        if (collisionDetection(player, MagicMissile) == true && player.opacity != 0) {
            playerHit(MagicMissile, 'rgb(57,189,255)');
            MagePrincessesMissiles.splice(index, 1);
            health -= 1;
            healthElem.innerHTML = health;
        }
        if (MagicMissile.position.y + MagicMissile.height >= canvas.height) {
            MagePrincessesMissiles.splice(index, 1);
        } else {
            MagicMissile.update();
        }
    });
    //controls spawn rate of normal enemies
    if (NormalEnemySpawnRate >= 10 && score < 1000) {
        SpawnNormalPrincess();
        NormalEnemySpawnRate = 0;
    } else {
        NormalEnemySpawnRate++;
    }
    //NormalPrincesses draws all normal enemies
    NormalPrincesses.forEach((Princess, index) => {
        //if they hit the player, make a black explosion and remove the princess, and player loses 1 health
        if (collisionDetection(player, Princess) == true && player.opacity != 0) {
            playerHit(Princess, 'rgb(248,208,224)');
            NormalPrincesses.splice(index, 1);
            health -= 1;
            healthElem.innerHTML = health;
            }
        //if princess moves below the bottom, remove it from the array
        if (Princess.position.y + Princess.height >= canvas.height) {
            NormalPrincesses.splice(index, 1);
        }
        //if the acidball hits the princess, remove it from the array, create en explosion, increase score
        else {
            projectiles.forEach((AcidBall, j) => {
                if (collisionDetection(AcidBall, Princess) == true) {
                        NormalPrincesses.splice(index, 1);
                        projectiles.splice(j, 1);
                        acidExplosion(Princess);
                        score += 10;
                        scoreElem.innerHTML = score;
                }
            })
            //update Princess
            Princess.update();
        }
    })

    //controls spawning rate of Fast Princesses
    if (FastEnemySpawnRate >= 20 && score < 1000) {
        SpawnFastPrincess();
        FastEnemySpawnRate = 0;
    } else {
        FastEnemySpawnRate++;
    }
    FastPrincesses.forEach((FastPrincess, index) => {
        if (collisionDetection(player, FastPrincess) == true && player.opacity != 0) {
            playerHit(FastPrincess, 'rgb(255, 152, 0)');
            FastPrincesses.splice(index, 1);
            health -= 1;
            healthElem.innerHTML = health;
            }

        if (FastPrincess.position.y + FastPrincess.height >= canvas.height) {
            FastPrincesses.splice(index, 1);
        }
        else {
            projectiles.forEach((AcidBall, j) => {
                if (collisionDetection(AcidBall, FastPrincess)) {
                        
                        FastPrincesses.splice(index, 1);
                        projectiles.splice(j, 1);
                        acidExplosion(FastPrincess);
                        score += 15;
                        scoreElem.innerHTML = score;
                }
            })
            FastPrincess.update();
        }
    })
    //controls spawn rate of Mage Princesses
    if (MageEnemySpawnRate >= 40 && score < 1000) {
        SpawnMagePrincess();
        MageEnemySpawnRate = 0;
    } else {
        MageEnemySpawnRate++;
    }

     MagePrincesses.forEach((MagePrincess, index) => {
        if (MagePrincesses.length > 0 && MageEnemyFireRate >= 25) {
            MagePrincesses[Math.floor( Math.random() * MagePrincesses.length)].shoot(MagePrincessesMissiles);
            MageEnemyFireRate = 0;
        } else {
            MageEnemyFireRate ++;
        }

        if (collisionDetection(player, MagePrincess) == true && player.opacity != 0) {
            playerHit(MagePrincess, 'black');
            MagePrincesses.splice(index, 1);
            health -= 1;
            healthElem.innerHTML = health;
            }

        if (MagePrincess.position.y + MagePrincess.height <= 0) {
            MagePrincesses.splice(index, 1);
        }
        else {
            projectiles.forEach((AcidBall, j) => {
                if (collisionDetection(AcidBall, MagePrincess)) {
                        
                        MagePrincesses.splice(index, 1);
                        projectiles.splice(j, 1);
                        acidExplosion(MagePrincess);
                        score += 25;
                        scoreElem.innerHTML = score;
                }
            })
            MagePrincess.update();
        }
    })
    
    //If health is 0 or less, increases gameOver value over time, create explosion, makes player invisible
    if (health <= 0) {
        player.opacity = 0;
        gameOver += 1;
        if (gameOver > 0 && gameOver < 2) {
            for(let i = 0; i < 20; i++) {
                explosion.push(new explosionEffect({
                    position: {
                        x: player.position.x + player.width/2,
                        y: player.position.y + player.height/2
                        },
                        radius: Math.random() * 5,
                        color: 'black'
                    }))
                }
        }
    }
    if (FinalBossHealth <= 0) {
        FinalBossBattle.opacity = 0;
        gameOver +=1;
        if (gameOver > 0 && gameOver < 2) {
            bossDeath();
        }
    }
    //stops game after a short delay once player health is 0
    if (gameOver >= 30 && health <= 0) {
        clearInterval(game);
        c.drawImage(gameOverImage, (canvas.width/2 - gameOverImage.width/2), (canvas.height/2 - gameOverImage.height/2));
        mainMenuButton.style.display = 'block';
    } else if (gameOver >= 30 && FinalBossHealth <= 0) {
        clearInterval(game);
        c.drawImage(victoryImage, (canvas.width/2 - victoryImage.width/2), (canvas.height/2 - victoryImage.height/2));
        mainMenuButton.style.display = 'block';
    }
    

};
//starts game, removes start button and displays the score screen
function startGame() {
    onScreenText.style.display = "block";
    startButton.style.display = "none";
    helpButton.style.display = "none";
    game = setInterval(animate, 1000 / 30);
}
