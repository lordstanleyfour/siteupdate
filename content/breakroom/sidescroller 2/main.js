import {Player} from './player.js';
import {InputHandler} from './input.js';
import {Background} from './background.js';
import {FlyingEnemy, ClimbingEnemy, GroundEnemy} from './enemies.js';
import {UI} from './UI.js';

window.addEventListener('load', function(){
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 900;
    canvas.height = 500;

    //audio
    const music = document.getElementById("music");
    const pips = document.getElementById("pips");
    const pop1 = document.getElementById("pop1");
    const pop2 = document.getElementById("pop2");
    const pop3 = document.getElementById("pop3");
    const pop4 = document.getElementById("pop4");
    const pop5 = document.getElementById("pop5");
    const pop6 = document.getElementById("pop6");
    const pop7 = document.getElementById("pop7");
    const burst1 = document.getElementById("burst1");
    const burst2 = document.getElementById("burst2");
    const burst3 = document.getElementById("burst3");
    const burst4 = document.getElementById("burst4");
    const ouch1 = document.getElementById("ouch1");
    const ouch2 = document.getElementById("ouch2");
    const ouch3 = document.getElementById("ouch3");
    const ouch4 = document.getElementById("ouch4");
    const ouch5 = document.getElementById("ouch5");

    class Game{
        constructor(width, height){
            this.width = width;
            this.height = height;
            this.groundMargin = 80;
            this.speed = 6;
            this.baseSpeed = 6;
            this.background = new Background(this);
            this.player = new Player(this);
            this.input = new InputHandler(this);
            this.UI = new UI(this);
            this.enemies = [];
            this.particles = [];
            this.collisions = [];
            this.floatingMessages = [];
            this.maxParticles = 250;
            this.enemyTimer = 0;
            this.enemyInterval = 700;
            this.score = 0;
            this.winningScore = 35;
            this.fontColour = 'black';
            this.time = -3000;
            this.maxTime = 30000;
            this.lives = 5;
            this.power = 1;
            this.gameOver = false;
            this.addedScoreLives = 0;
            this.addedScorePower = 0;
            this.enemiesDefeated = 0;
            this.diveKills = 0;
            this.popsArray = [pop1, pop2, pop3, pop4, pop5, pop6, pop7];
            this.burstArray = [burst1, burst2, burst3, burst4];
            this.ouchArray = [ouch1, ouch2, ouch3, ouch4, ouch5];
            this.ouchArrayCounter = 0;
            this.debug = false;
            this.player.currentState = this.player.states[1]; // default 0
            this.player.currentState.enter();
        }
        update(deltaTime){
            this.time += deltaTime;
            //starting audio
            if (this.time < 0) pips.play();
            if (this.time > 0) music.play();

            //game over calculations
            this.addedScorePower = Math.floor(this.power * 2);
            if (this.time > this.maxTime) {
                this.addedScoreLives = this.lives;
                this.score = this.score + this.addedScoreLives + this.addedScorePower;
                this.gameOver = true;
            }
            
            //background
            this.background.update();
            this.player.update(this.input.keys, deltaTime);

            // handle enemies
            if (this.speed === 0) this.enemyInterval = 1000;
            else if (this.speed === 6) this.enemyInterval = 600;
            else if (this.speed === 12) this.enemyInterval = 450;

            if(this.time > 0 && this.enemyTimer > this.enemyInterval){
                this.addEnemy();
                this.enemyTimer = 0;
            } else {
                this.enemyTimer += deltaTime;
            }
            this.enemies.forEach(enemy => {
                enemy.update(deltaTime);
            });
            this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);

            //handle particles
            this.particles.forEach((particle, index) => {
                particle.update();
            });
            if (this.particles.length > this.maxParticles) {
                this.particles.length = this.maxParticles;
            }
            this.particles = this.particles.filter(particle => !particle.markedForDeletion);

            //handle messages
            this.floatingMessages.forEach(message => {
                message.update();
            });
            this.floatingMessages = this.floatingMessages.filter(message => !message.markedForDeletion);

            //handle collisions
            this.collisions.forEach((collision, index) => {
            collision.update(deltaTime);
            });
            this.collisions = this.collisions.filter(collision => !collision.markedForDeletion);
        }
        draw(context){
            this.background.draw(context);
            this.player.draw(context)
            this.enemies.forEach(enemy => {
                enemy.draw(context);
            });
            this.particles.forEach((particle, index) => {
                particle.draw(context);
            });
            this.collisions.forEach((collision, index) => {
                collision.draw(context);
            });
            this.floatingMessages.forEach(message => {
                message.draw(context);
            });
            this.UI.draw(context);
        }
        addEnemy(){
            if (this.speed > 0 && Math.random() > 0.5) this.enemies.push(new GroundEnemy(this));
            else if (this.speed > 0) this.enemies.push(new ClimbingEnemy(this));
            if (this.enemies.length < 10) this.enemies.push(new FlyingEnemy(this));
        }
    }

    const game = new Game(canvas.width, canvas.height);
    let lastTime = 0;    

    function animate(timeStamp){
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.update(deltaTime);
        game.draw(ctx);
        //console.log('state: ' + game.player.currentState);
        //console.log('powerSpendTimer: ' + game.player.powerSpendTimer);
        if(!game.gameOver) requestAnimationFrame(animate);
    }
    animate(0);
});

//TODO


//TIPS
////attacks use power
////ambushing; sit to regen power until the screen slightly fuller to make rolls count
////get as many enemies as poss with dives to regen power and score more points per kill
////preserve lives as these are worth bonus points at the end
////you don't have to kill everything, you're not a texan