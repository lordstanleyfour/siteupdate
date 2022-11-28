import {Dust, Fire, Splash, Meteor} from './particles.js';

const states = {
    SITTING: 0,
    RUNNING: 1,
    JUMPING: 2,
    FALLING: 3,
    ROLLING: 4,
    DIVING: 5,
    HIT: 6
}

const bang1 = document.getElementById("bang1");
const bang2 = document.getElementById("bang2");
const bang3 = document.getElementById("bang3");
const bang4 = document.getElementById("bang4");
const bangArray = [bang1, bang2, bang3, bang4];

class State {
    constructor(state, game){
        this.state = state;
        this.game = game;
    }
}

export class Sitting extends State {
    constructor(game){
        super('SITTING', game);
    }
    enter(){
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 4;
        this.game.player.frameY = 5;
    }
    handleInput(input){
        if (input.includes('ArrowLeft') || input.includes('ArrowRight')){
            this.game.player.setState(states.RUNNING, 1);
        } else if (input.includes('Enter') && !input.includes('ArrowDown')){
            if (this.game.power > 0.1) this.game.player.setState(states.ROLLING, 2);
        }
    }
}

export class Running extends State {
    constructor(game){
        super('RUNNING', game);
    }
    enter(){
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 8;
        this.game.player.frameY = 3;
    }
    handleInput(input){
        this.game.particles.unshift(new Dust(this.game, this.game.player.x + this.game.player.width * 0.7, this.game.player.y + this.game.player.height));
        if (input.includes('ArrowDown')){
            this.game.player.setState(states.SITTING, 0);
        } else if (input.includes('ArrowUp')) {
            this.game.player.setState(states.JUMPING, 1);
        } else if (input.includes('Enter')){
            if (this.game.power > 0.1) this.game.player.setState(states.ROLLING, 2);
        }
    }
}

export class Jumping extends State {
    constructor(game){
        super('JUMPING', game);
    }
    enter(){
        if (this.game.player.onGround()) this.game.player.vy -= 27;
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 6;
        this.game.player.frameY = 1;
    }
    handleInput(input){
        if (this.game.player.vy > this.game.player.weight){
            this.game.player.setState(states.FALLING, 1);
        } else if (input.includes('Enter')){
            if (this.game.power > 0.1) this.game.player.setState(states.ROLLING, 2);
        } else if (input.includes('ArrowDown') && this.game.power > 0.2){
            this.game.player.setState(states.DIVING, 0);
        }
    }
}

export class Falling extends State {
    constructor(game){
        super('FALLING', game);
    }
    enter(){
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 6;
        this.game.player.frameY = 2;
    }
    handleInput(input){
        if (this.game.player.onGround()){
            this.game.player.setState(states.RUNNING, 1);
        } else if (input.includes('ArrowDown') && this.game.power > 0.2){
            this.game.player.setState(states.DIVING, 0);
        }
    }
}

export class Rolling extends State {
    constructor(game){
        super('ROLLING', game);
    }
    enter(){
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 6;
        this.game.player.frameY = 6;
    }
    handleInput(input){
        this.game.particles.unshift(new Fire(this.game, this.game.player.x + this.game.player.width * 0.5, this.game.player.y + this.game.player.height * 0.5));
        if (!input.includes('Enter') && this.game.player.onGround()){
            this.game.player.setState(states.RUNNING, 1);
        } else if (!input.includes('Enter') && !this.game.player.onGround()){
            this.game.player.setState(states.FALLING, 1);
        } else if (input.includes('Enter') && input.includes('ArrowUp') && this.game.player.onGround()){
            this.game.player.vy -= 27;
        } else if (input.includes('ArrowDown') && this.game.player.onGround()){
            this.game.player.setState(states.SITTING, 0);
        } else if (input.includes('ArrowDown') && !this.game.player.onGround() && this.game.power > 0.2){
            this.game.player.setState(states.DIVING, 0);
        } else if (this.game.power <= 0 && this.game.player.onGround()){
            this.game.player.setState(states.SITTING, 0);
        } else if (this.game.power <= 0 && !this.game.player.onGround()){
            this.game.player.setState(states.FALLING, 1);
        }
    }
}

export class Diving extends State {
    constructor(game){
        super('DIVING', game);
    }
    enter(){
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 6;
        this.game.player.frameY = 6;
        this.game.player.vy = 15;
        this.game.power -= 0.2;
    }
    handleInput(input){
        this.game.particles.unshift(new Fire(this.game, this.game.player.x + this.game.player.width * 0.5, this.game.player.y + this.game.player.height * 0.5));
        this.game.particles.unshift(new Meteor(this.game, this.game.player.x - this.game.player.width * 0.5, this.game.player.y));

        if (this.game.player.onGround()){
            this.game.player.setState(states.RUNNING, 1);
            for (let i = 0; i < 60; i++){
                this.game.particles.unshift(new Splash(this.game, this.game.player.x, this.game.player.y));
            }
            bangArray[Math.floor(Math.random() * 4)].play();
        } else if (!input.includes('Enter') && this.game.player.onGround()  && this.game.power > 0.1){
            this.game.player.setState(states.ROLLING, 2);
            bangArray[Math.floor(Math.random() * 4)].play();
        }
    }
}

export class Hit extends State {
    constructor(game){
        super('HIT', game);
    }
    enter(){
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 10;
        this.game.player.frameY = 4;
        this.game.player.speed = 0;
    }
    handleInput(input){
    if (this.game.player.frameX >= 10 && this.game.player.onGround()){
        this.game.player.setState(states.RUNNING, 1);
    } else if (this.game.player.frameX >= 10 && !this.game.player.onGround()){
            this.game.player.setState(states.FALLING, 1);
        }
    }
}