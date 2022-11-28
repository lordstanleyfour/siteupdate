import { Sitting, Running, Jumping, Falling, Rolling, Diving, Hit } from "./playerStates.js";
import { CollisionAnimation } from "./CollisionAnimation.js";
import { FloatingMessage } from "./floatingMessages.js";

const audioCtx = new AudioContext(); //the cd player
const burn = document.getElementById('burn'); //the data on the cd (the song)
const burnNode = audioCtx.createMediaElementSource(burn); //put the song on the actual cd
burnNode.connect(audioCtx.destination); //wire from the cd to speaker

export class Player {
    constructor(game){
        this.game = game
        this.width = 100;
        this.height = 91.3;
        this.x = 0;
        this.y = this.game.height - this.height - this.game.groundMargin;
        this.vy = 0;
        this.weight = 1;
        this.image = document.getElementById('player');
        this.frameX = 0;
        this.frameY = 0;
        this.maxFrame;
        this.powerSpend = 0.0125; //increment decrease
        this.powerSpendTimer = 0;
        this.powerSpendInterval = 50; //in ms
        this.buffer = 35;
        this.fps = 20;
        this.frameInterval = 1000/this.fps
        this.frameTimer = 0;
        this.speed = 0;
        this.maxSpeed = 10;
        this.states =[new Sitting(this.game), new Running(this.game), new Jumping(this.game), new Falling(this.game), new Rolling(this.game), new Diving(this.game), new Hit(game)];
        this.currentState = null;
    }    
    update(input, deltaTime){
        //explosion buffer
        if (this.currentState === this.states[5]){
            this.bufferLeft = -this.buffer; //0
            this.bufferRight = this.buffer; //this.bufferLeft + 6
            this.bufferTop = -this.buffer; //20
            this.bufferBottom = this.buffer; //this.bufferTop + 0
        } else {
            this.bufferLeft = 0; //0
            this.bufferRight = 0; //this.bufferLeft + 6
            this.bufferTop = 0; //20
            this.bufferBottom = 0; //this.bufferTop + 0
        }

        this.checkCollision();
        this.currentState.handleInput(input);

        // horizontal movement
        this.x += this.speed;
        if (this.currentState !== this.states[6]){
            if (input.includes('ArrowRight')) this.speed = this.maxSpeed;
            else if (input.includes('ArrowLeft')) this.speed = -this.maxSpeed;
            else this.speed = 0;
        }

        //horizontal boundaries
        if (this.x < 0) this.x = 0;
        if (this.x > this.game.width - this.width) this.x = this.game.width - this.width;

        // vertical movement
        this.y += this.vy;
        if (!this.onGround()) this.vy += this.weight;
        else this.vy = 0;

        // vertical boundaries
        if (this.y > this.game.height - this.height - this.game.groundMargin) this.y = this.game.height - this.height - this.game.groundMargin;

        // sprite animation
        if (this.frameTimer > this.frameInterval){
            this.frameTimer = 0;
            if (this.frameX < this.maxFrame) this.frameX++;
            else this.frameX = 0;
        } else {
            this.frameTimer += deltaTime;
        }

        //regenerate power
        if (this.game.power < 2){
            if (this.currentState === this.states[0]){
                this.game.power += this.powerSpend * 0.08;
            } else {
            this.game.power += this.powerSpend * 0.025;
            }
        }

        //powerSpend
        if (this.currentState === this.states[4]){
            if (audioCtx.state === 'suspended') audioCtx.resume();
            burn.play();
            if (this.powerSpendTimer > this.powerSpendInterval){
                this.game.power -= this.powerSpend;
                this.powerSpendTimer = 0;
            } else this.powerSpendTimer += deltaTime;
        }

    }
    draw(context){
        if (this.game.debug) context.strokeRect(this.x + this.bufferLeft, this.y + this.bufferTop, this.width + this.bufferRight - this.bufferLeft, this.height + this.bufferBottom - this.bufferTop);
        context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
    }
    onGround(){
        return this.y >= this.game.height - this.height - this.game.groundMargin;
    }
    setState(state, speed){
        this.currentState = this.states[state];
        this.game.speed = this.game.baseSpeed * speed;
        this.currentState.enter();
    }
    checkCollision(){
        //pop randomiser
        var popSelect = Math.floor(Math.random() * 7);
        var burstSelect = Math.floor(Math.random() * 4);


        this.game.enemies.forEach(enemy => {
            if (
                enemy.x < this.x + this.width + this.bufferRight &&
                enemy.x + enemy.width > this.x + this.bufferLeft &&
                enemy.y < this.y + this.height + this.bufferBottom &&
                enemy.y + enemy.height > this.y + this.bufferTop
            ) {
                enemy.markedForDeletion = true;
                this.game.collisions.push(new CollisionAnimation(this.game, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5));
                if (this.currentState === this.states[4]){
                    this.game.score++
                    this.game.enemiesDefeated++;
                    this.game.power += 0.03;
                    this.game.floatingMessages.push(new FloatingMessage('+1', enemy.x, enemy.y, 150, 50, 1));
                    this.game.popsArray[popSelect].play();
                } else if (this.currentState === this.states[5]){
                    this.game.score += 3;
                    this.game.enemiesDefeated++;
                    this.game.diveKills++;
                    this.game.power += 0.12;
                    this.game.floatingMessages.push(new FloatingMessage('+3', enemy.x, enemy.y, 150, 50, 1.25));
                    this.game.burstArray[burstSelect].play();

                } else {
                    this.setState(6, 0);
                    this.game.lives--;
                    this.game.score -=5;
                    this.game.ouchArray[this.game.ouchArrayCounter].play();
                    this.game.ouchArrayCounter++;
                    this.game.floatingMessages.push(new FloatingMessage('-5', enemy.x, enemy.y, 150, 50, 1.5));
                    if (this.game.lives <= 0) {
                        this.game.score = this.game.score + this.game.addedScoreLives + this.game.addedScorePower;
                        this.game.gameOver = true;
                    }
                }                
            }
        })
    }
}