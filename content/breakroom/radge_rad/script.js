const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
const canvasLow = document.getElementById('canvas2');
const ctx2 = canvasLow.getContext('2d');
canvas.width = 800;
canvas.height = 500;
canvasLow.width = 1000;
canvasLow.height = 350;

mouseOffsetFactor = (window.innerWidth - canvas.width)/2;

/*window.addEventListener('resize', function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});*/

////////////////////////////////////////
const mouse = {
    x: canvas.width/2,
    y: undefined,
};

const backFill = new Image();
backFill.src = "backfill.png";
const gunSprite = new Image ();
gunSprite.src = "radSprite.png";
const projectileSprite = new Image ();
projectileSprite.src = "projectileSprite.png";
const targetSprite1 = new Image ();
targetSprite1.src = "targetSprite1.png";
const targetSprite2 = new Image ();
targetSprite2.src = "targetSprite2.png";
const meltSprite = new Image();
meltSprite.src = "melt.png";
const chestSprite = new Image ();
chestSprite.src = "chestSprite.png";
const handSprite = new Image ();
handSprite.src = "handSprite.png";
const elbowSprite = new Image();
elbowSprite.src = "elbowSprite.png";
const backSpriteLow = new Image ();
backSpriteLow.src = "lowCanvasBackground.png";
const warningSpriteOff = new Image ();
warningSpriteOff.src = "controlled.png";
const warningSpriteOn = new Image();
warningSpriteOn.src = "red.png";

const actx = new AudioContext();

const meltNoise = new Audio();
meltNoise.src = "sounds/melt.wav";

const music = document.getElementById('music'); //the data on the cd (the song)
const musicNode = actx.createMediaElementSource(music); //put the song on the actual cd
musicNode.connect(actx.destination); //wire from the cd to speaker

const gun = {
    w: canvas.width * 0.1,
    h: canvas.height * 0.2,
};

const targetArray = [];
const targetSpriteArray = [targetSprite1, targetSprite2];
const projectileArray = [];
const splatArray = [];
const xraySpriteArray = [chestSprite, handSprite, elbowSprite];
const xrayArray = [];
const winMessages = ["Or are you too good for games?", "It's not like you were working anyway.", "You could do better, but probably not.", "Everything is pointless. Especially this.", "It's fine, nobody is watching. Except God.", "Was it worth it?", "Your shoelace is untied.", "Mother would be less disappointed than usual", "Not great, but not awful", "Well at least you tried"]
const failMessages = ["SsSsStRuCk AaAafFfFfF", "You're impressing no-one.", "I'm ashamed of you."];
var winCondition = false;
var targetSpeed = 5;
var firedY = 0;
var uncoverSplatsRequired = 5; //change back to 5
var shotsFired = 0;
var missCounter = 0;
var missCounterRunning = 0;
var deathCounter = 0;
var xrayCounter = 1;
var meltTrigger = false;
var score, rejrate, winMessage, failMessage, startTime, endTime;

/////////////////////////////////////////////////

function audioHandler(pathway, volume){
    fetch(pathway)
    .then(data =>data.arrayBuffer())
    .then(arrayBuffer => actx.decodeAudioData(arrayBuffer))
    .then(decodedAudio => {
        let sample = decodedAudio;
        let playSound = actx.createBufferSource();
        let gainNode = actx.createGain();

        playSound.buffer = sample;
        playSound.connect(gainNode);
        gainNode.connect(actx.destination);
        gainNode.gain.value = volume;
        playSound.start(actx.currentTime);
    });
}

canvas.addEventListener('click', function (e) {
    mouse.x = e.x-mouseOffsetFactor;
    mouse.y = e.y;
    projectileArray.push(new Projectile());
    audioHandler('sounds/zap.wav', 0.3);
    console.log(actx.state);
    if (winCondition == false) shotsFired++;
});

canvas.addEventListener('mousemove', function (e) {
    mouse.x = e.x-mouseOffsetFactor;
    mouse.y = e.y;
});

class Projectile {
    constructor() {
        this.x = mouse.x + (gun.w-15);
        this.y = (canvas.height - (canvas.height * 0.1)) + 11;
        this.w = 10;
	    this.h = 10;
        this.speedY = -17;
        this.speedX = 0;
        this.collided = false;
	    this.firedY = firedY;
	    this.sprite = projectileSprite;
	    this.frameX = 0;
	    this.frameY = 0;
    }
    update() {
        if (this.collided === false) this.y += this.speedY;
    }
    draw() {
	drawSprite (projectileSprite, this.w*this.frameX, this.h*this.frameY, this.w, this.h, this.x, this.y, this.w, this.h);
	    if (this.frameX < 1) this.frameX ++;
	    else this.frameX = 0;
    }
}

class Splat {
    constructor() {
        this.x = undefined;
        this.y = Math.random() * ((targetArray[0].y + targetArray[0].h - 16) - (targetArray[0].y)) + targetArray[0].y;
    }
    update() {
	    if (targetArray[0].movingLeft) this.x -=targetSpeed;
	    else if (targetArray[0].movingRight) this.x +=targetSpeed;
    }
    draw() {
        ctx.fillStyle = 'rgba(20, 255, 30, 0.50)';
        ctx.beginPath();
        ctx.fillRect(this.x-8, this.y-8, 16, 16);
	    ctx.arc(this.x, this.y, 10, 0, Math.PI * 2);
	    ctx.fill();
    }
}

class Target {
    constructor() {
        this.x = (canvas.width * 0.5);
        this.y = Math.floor(canvas.height * 0.05)+10;
	    this.w = 100;
	    this.h = 150;
	    this.sprite;
	    this.frameX = 1;
    	this.frameY = 0;
        this.frameCount = 0;
        this.moving = false;
        this.movingRight = false;
        this.movingLeft = false;
    }
    update() {
        //switches
        if (this.moving === false) {
            this.moving = true;
            this.movingRight = true;
        }
        if (this.movingRight === true && this.x > (canvas.width - this.w)) {
            this.movingRight = false;
            this.movingLeft = true;
        }
        if (this.movingLeft === true && this.x < 0) {
            this.movingLeft = false;
            this.movingRight = true;
        }
        //movement
        if (this.movingRight) this.x += targetSpeed;
        if (this.movingLeft) this.x -= targetSpeed;
        //animation
	    if (this.frameCount >= 0 && this.frameCount < 4) {
	        this.frameX = 1;
	        this.frameCount++;
	    } else if (this.frameCount >= 4 && this.frameCount < 8) {
	        this.frameX = 2;
	        this.frameCount++;
	    } else if (this.frameCount >= 8 && this.frameCount < 12) {
	        this.frameX = 1;
	        this.frameCount++;
	    } else if (this.frameCount >= 12 && this.frameCount <= 15) {
	        this.frameX = 0;
	        this.frameCount++;
	    } else {
	        this.frameX = 1;
	        this.frameCount = 0;
	    }
    }
    draw () {
	    drawSprite (this.sprite, this.w*this.frameX, this.h*this.frameY, this.w, this.h, this.x, this.y, this.w, this.h);
    }
}

class Xray {
    constructor() {
        this.x = null;
        this.y = 80;
        this.w = 200;
        this.h = 250;
        this.sprite;
        this.frameX = 0;
        this.frameY = 0;
        this.arrayPos;
        this.complete = false;
    }
    update() {
        if (this.complete == false && this.arrayPos == (xrayCounter - 1)) {
            for (let i = 1; i < 9; i++) {
                if (splatArray.length == uncoverSplatsRequired * i && this.frameX <= i - 1) this.frameX++;
                if (this.frameX == 8) {
                    this.complete = true;
                    xrayCounter++;
                    meltTrigger = true;
                    splatArray.splice(0, splatArray.length - 1);
                }
            }
        }
    }
    draw() {
        drawLowSprite(this.sprite, this.w * this.frameX, this.h * this.frameY, this.w, this.h, this.x, this.y, this.w, this.h);
    }
}

function drawSprite(img, sX, sY, sW, sH, dX, dY, dW, dH) {
    ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH);
}

function drawLowSprite(img, sX, sY, sW, sH, dX, dY, dW, dH) {
    ctx2.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH);
}

function lowCanGraphics() {
    ctx2.clearRect(0, 0, canvasLow.width, canvasLow.height);
    drawLowSprite(backSpriteLow, 0, 0, 1000, 350, 0, 0, 1000, 350);
    if (projectileArray.length == 0) drawLowSprite(warningSpriteOff, 0, 0, 79, 64, 869, 16, 79, 64);
    if (projectileArray.length > 0) drawLowSprite(warningSpriteOn, 0, 0, 79, 64, 869, 16, 79, 64);
    //draw score
    rejrate = Math.floor((missCounterRunning / shotsFired)* 100);
    ctx2.font = "25px Verdana";
    let gradient = ctx2.createLinearGradient(0, 0, canvas2.width, 0);
    gradient.addColorStop("0", "magenta");
    gradient.addColorStop("0.5", "blue");
    gradient.addColorStop("1.0", "red");
    ctx2.fillStyle = gradient;
    ctx2.fillText("Reject Rate -> " + rejrate + "%", 700, 150);
}

function populateXrays() {
    for (let i = 0; i < 3; i++) {
        xrayArray.push(new Xray());
        xrayArray[i].x = (i * 230) + 20;
        xrayArray[i].sprite = xraySpriteArray[i];
        xrayArray[i].arrayPos = i;
    }
}

function start() {
    startTime = new Date();
}

function end() {
    endTime = new Date();
    let timeDiff = endTime - startTime;
    score = Math.floor((((60000 - timeDiff) / 1000) * (100 - rejrate)) / 10);
    ctx2.beginPath();
    ctx2.font = "25px Verdana";
    let gradient = ctx2.createLinearGradient(0, 0, canvas2.width, 0);
    gradient.addColorStop("0", "magenta");
    gradient.addColorStop("0.5", "blue");
    gradient.addColorStop("1.0", "red");
    // Fill with gradient
    ctx2.fillStyle = gradient;
    ctx2.fillText("Time -> " + (timeDiff/1000) + "secs", 700, 180);
}

function projectileHandler() {
    if (projectileArray.length > 0) {
        for (let i = 0; i < projectileArray.length; i++) {
            projectileArray[i].update();
            projectileArray[i].draw();
            //collision
            if ((projectileArray[i].x > targetArray[0].x) && (projectileArray[i].x < (targetArray[0].x + targetArray[0].w)) && (projectileArray[i].y < targetArray[0].y + targetArray[0].h) && projectileArray[i].y > targetArray[0].y) {
                projectileArray[i].collided = true;
                splatArray.push(new Splat());
		        splatArray[splatArray.length-1].x = projectileArray[i].x;
		        splatArray[splatArray.length-1].y = projectileArray[i].firedY;
                projectileArray.splice(i, 1);
                i--;
		    }
        }
    }
    if (splatArray.length > 0) {
        for (let i = 0; i < splatArray.length; i++) {
            splatArray[i].update();
            splatArray[i].draw();
        }
    }
}

function projectileSplicerOffscreen () {
	for (let i = 0; i < projectileArray.length; i++) {
            if (projectileArray[i].y < 0) {
                projectileArray.splice(i, 1);
                i--;
                splatArray.splice(0, 1)
                missCounter++;
                missCounterRunning++;
                if (missCounter > 5 && xrayArray[(xrayCounter-1)].frameX == 0) {
                    missCounter = 0;
                    deathCounter++;
                } else if (missCounter > 5 && xrayArray[(xrayCounter - 1)].frameX > 0) {
                    xrayArray[(xrayCounter - 1)].frameX--;
                    missCounter = 0;
                    deathCounter++;
                }
            }
	}
}

function handleFiredY () {
    if ((mouse.y > targetArray[0].y) && (mouse.y < (targetArray[0].y + targetArray[0].h))) {
	firedY = mouse.y;
    } else { 
        firedY = Math.random() * ((targetArray[0].y + targetArray[0].h - 16) - (targetArray[0].y)) + targetArray[0].y;
    }
}

function meltHandler() {
    meltNoise.play();
    melting.x = targetArray[0].x;
        drawSprite(melting.sprite, melting.frameX * melting.w, 0, melting.w, melting.h, melting.x, melting.y, melting.w, melting.h)
    melting.frameX++;
    if (targetArray[0].movingLeft) melting.x -= targetSpeed;
    else if (targetArray[0].movingRight) melting.x += targetSpeed

    if (melting.frameX > 14) {
        meltTrigger = false;
        melting.frameX = 0;
        melting.x = targetArray[0].x;
    }
}

function winConditionChecker() {
    let completeCounter = 0;
        for (let i = 0; i < xrayArray.length; i++) {
            if (xrayArray[i].complete) completeCounter++
    }
    if (completeCounter == 1) targetSpeed = 7;
    else if (completeCounter == 2) targetSpeed = 8.5;
    else if (completeCounter == 3) winCondition = true;
}

function win () {
    if (winCondition) {
	    ctx.fillStyle = 'gold';
	    ctx.strokeStyle = 'black';
        ctx.fillRect(0, 0, canvas.width - 1, canvas.height - 1);
        ctx.rect(10, 10, canvas.width - 20, canvas.height - 20);
        ctx.stroke();
        ctx.font = "small-caps bolder 50px verdana";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        end();
        ctx.beginPath();
        ctx.fillText("score: " + score, canvas.width / 2, (canvas.height / 2) + 50);
        ctx.fillText("Press F5 to restart", canvas.width / 2, (canvas.height / 2 + 100));
        ctx.beginPath();
        ctx.font = "small-caps bolder 30px verdana"
        ctx.fillText(winMessage, canvas.width / 2, (canvas.height / 2 + 150))
        ctx.font = "small-caps bolder 50px Verdana";
        let gradient = ctx.createLinearGradient(0, 0, canvas.width/2, 0);
        gradient.addColorStop("0", "magenta");
        gradient.addColorStop("0.5", "blue");
        gradient.addColorStop("1.0", "red");
        ctx.fillStyle = gradient;
        ctx.fillText("Hooray for you.", canvas.width / 2, canvas.height / 2-50);

    }
}

function targetChooser() {
    let i = Math.floor(Math.random() * 2);
    targetArray.push(new Target());
    targetArray[0].sprite = targetSpriteArray[i]; 
}

function winMessageHandler() {
    let i = Math.floor(Math.random() * (winMessages.length))
    winMessage = winMessages[i];
}

function failMessageHandler() {
    let i = Math.floor(Math.random() * 3)
    failMessage = failMessages[i];
}

function death() {
    if (deathCounter >= 5 && winCondition == false) {
        ctx.fillStyle = 'red';
        ctx.strokeStyle = 'gold';
        ctx.fillRect(0, 0, canvas.width - 1, canvas.height - 1);
        ctx.rect(10, 10, canvas.width - 20, canvas.height - 20);
        ctx.stroke();
        ctx.font = "small-caps bolder 50px verdana";
        ctx.fillStyle = "brown";
        ctx.textAlign = "center";
        ctx.fillText(failMessage, canvas.width / 2, canvas.height / 2);
        ctx.fillText("Press F5 to restart", canvas.width / 2, canvas.height / 2 + 100);
        ctx.stroke();
    }
}

start();
populateXrays();
targetChooser();
//targetArray.push(new Target());
winMessageHandler();
failMessageHandler();

var melting = {
    sprite: meltSprite,
    w: targetArray[0].w,
    h: targetArray[0].h,
    x: null,
    y: targetArray[0].y,
    frameX: 0,
}

function animate() {    
    music.play();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSprite(backFill, 0, 0, 800, 500, 0, 0, 800, 500);
    lowCanGraphics();
    drawSprite(gunSprite, 0, 0, 80, 100, mouse.x, canvas.height - gun.h, gun.w, gun.h);
    targetArray[0].update();
    targetArray[0].draw();
    for (let i = 0; i < xrayArray.length; i++) {
        xrayArray[i].update();
        xrayArray[i].draw();
    }
    handleFiredY();
    projectileHandler();
    projectileSplicerOffscreen();
    if (meltTrigger) meltHandler();
    winConditionChecker();
    win();
    death();
    if (winCondition == false) requestAnimationFrame(animate);
}
animate();

/*TODO
    * add html for game instructions
    * sound effects and music
    * more patient sprites
    */