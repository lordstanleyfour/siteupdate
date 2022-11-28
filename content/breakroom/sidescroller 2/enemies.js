class Enemy {
    constructor(){
        this.frameX = 0;
        this.frameY = 0;
        this.fps = 20;
        this.frameInterval = 1000/this.fps;
        this.frameTimer = 0;
        this.markedForDeletion = false;
        this.selector = Math.floor(Math.random() * (4-1) + 1);
    }
    update(deltaTime){
        //movement
        this.x -= this.speedX + this.game.speed;
        this.y += this.speedY;
        if (this.frameTimer > this.frameInterval){
            this.frameTimer = 0;
            if (this.frameX < this.maxFrame) this.frameX ++;
            else this.frameX = 0;
        } else {
            this.frameTimer += deltaTime;
        }
        //check if off screen
        if (this.x + this.width < 0) this.markedForDeletion = true;
    }
    draw(context){
        if (this.game.debug) context.strokeRect (this.x, this.y, this.width, this.height);
        //if (this.image === document.getElementById('enemy_raven')) context.drawImage(this.image, this.frameX * this.width, 0, this.width, this.height, this.x, this.y, this.width/2.5, this.height/2.5);
        /* else */ context.drawImage(this.image, this.frameX * this.width, 0, this.width, this.height, this.x, this.y, this.width, this.height);
    }
}

export class FlyingEnemy extends Enemy {
    constructor(game){
        super();
        this.game = game;
        //width
        if (this.selector === 1) this.width = 60;
        else if (this.selector === 2) this.width = 650/6;
        else if (this.selector === 3) this.width = 361/6;
        //height
        if (this.selector === 1) this.height = 44;
        else if (this.selector === 2) this.height = 77;
        else if (this.selector === 3) this.height = 70;
        this.x = this.game.width + Math.random() * this.game.width * 0.5;
        this.y = Math.random() * this.game.height * 0.5;
        this.speedX = Math.random() + 1;
        this.speedY = 0;
        this.maxFrame = 5;
        //images
        if (this.selector === 1) this.image = document.getElementById('enemy_fly');
        else if (this.selector === 2) this.image = document.getElementById('enemy_raven');
        else if (this.selector === 3) this.image = document.getElementById('enemy_ghost');

        this.angle = 0;
        this.va = Math.random() * 0.1 + 0.1;
    }
    update(deltaTime){
        super.update(deltaTime);
        this.angle += this.va;
        this.y += Math.sin(this.angle);
    }
}

export class GroundEnemy extends Enemy {
    constructor(game){
        super();
        this.game = game;
        //width
        if (this.selector === 1) this.width = 60;
        else if (this.selector === 2) this.width = 71;
        else if (this.selector === 3) this.width = 482/6;
        
        //height
        if (this.selector === 1) this.height = 87;
        else if (this.selector === 2) this.height = 70;
        else if (this.selector === 3) this.height = 60;
        this.x = this.game.width;
        this.y = this.game.height - this.height - this.game.groundMargin;
        //images
        if (this.selector === 1) this.image = document.getElementById('enemy_plant');
        else if (this.selector === 2) this.image = document.getElementById('enemy_spinner');
        else if (this.selector === 3) this.image = document.getElementById('enemy_worm');
        //speed
        if (this.selector === 1) this.speedX = 0;
        else if (this.selector === 2) this.speedX = Math.random() * (3-2)+2; 
        else if (this.selector === 3) this.speedX = Math.random() * (1-0.5)+0.5;


        this.speedY = 0;
        //maxFrame
        if (this.selector === 1) this.maxFrame = 1;
        else if (this.selector === 2) this.maxFrame = 8;
        else if (this.selector === 3) this.maxFrame = 5;
        this.maxFrame = 1;
    }
}

export class ClimbingEnemy extends Enemy {
    constructor(game){
        super();
        this.game = game;
        //width
        if (this.selector === 1) this.width = 120;
        else this.width = 531/6;
        //height
        if (this.selector === 1) this.height = 144;
        else this.height = 50;
        this.x = this.game.width;
        this.y = Math.random() * this.game.height * 0.5;
        //images
        if (this.selector === 1) this.image = document.getElementById('enemy_spider_big');
        else this.image = document.getElementById('enemy_spider');
        this.speedX = 0;
        this.speedY = Math.random() > 0.5 ? 1 : -1;
        this.maxFrame = 5;
    }
    update(deltaTime){
        super.update(deltaTime);
        if (this.y > this.game.height - this.height - this.game.groundMargin) this.speedY *= -1;
        if (this.y < -this.height) this.markedForDeletion = true;
    }
    draw(context){
        super.draw(context);
        context.beginPath();
        context.moveTo(this.x + this.width/2, 0);
        context.lineTo(this.x + this.width/2, this.y + 50);
        context.stroke();
    }
}