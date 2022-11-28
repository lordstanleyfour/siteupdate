//COMPLETED BUILD
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 800; //declares variables which let the script know what the html has drawn the canvas at
canvas.height = 500;

var playerX = canvas.width/2;
var playerY = canvas.height/2;
var playerSpeed = 10;
var heat = 0;
var heatAlpha = 1;
var heatAlphaSwitch = 'increase';
const keys = [];
var score = 0;
var visa1 = {img:null, x: (canvas.width/2 - 45), y: (canvas.height/2 + 30), w: 90, h:60};
var visa2 = {img:null, x: (canvas.width/2 - 45), y: (canvas.height/2 + 30), w: 90, h:60};
var visa3 = {img:null, x: (canvas.width/2 - 45), y: (canvas.height/2 + 30), w: 90, h:60};
var visa4 = {img:null, x: (canvas.width/2 - 45), y: (canvas.height/2 + 30), w: 90, h:60};
var visa5 = {img:null, x: (canvas.width/2 - 45), y: (canvas.height/2 + 30), w: 90, h:60};
var visaCheck = null;
var continueAnimating = true;
const actx = new AudioContext();

var music = new Audio();
music = document.getElementById('music');

//sprites and images
//background images - these will change based on the x coordinate of the crosshairs
const background1 = document.getElementById("gunLeft");
const background2 = document.getElementById("gunStraight");
const background3 = document.getElementById("gunRight");
var background = background2;

//npc images
const boat = document.getElementById("boat");
const plane = document.getElementById("plane");
const npcs = [];
const npcsOnScreen = 10;//10
const npcsSpawnLimiter = 7;
var npcsSpawnCounter = 0;

//flags
const flagUK = document.getElementById("flagUk");
const flagEU = document.getElementById("flagEu");
const flagIreland = document.getElementById("flagIreland");
const flagItaly = document.getElementById("flagItaly");
const flagGermany = document.getElementById("flagGermany");
const flagPoland = document.getElementById("flagPoland");
const flagSpain = document.getElementById("flagSpain");
const flagPortugal = document.getElementById("flagPortugal");
const flagFrance = document.getElementById("flagFrance");
const flagNetherlands = document.getElementById("flagNetherlands");
const flagHungary = document.getElementById("flagHungary");
const flagCzechia = document.getElementById("flagCzechia");
const flags = [];
flags.push(flagIreland, flagItaly, flagGermany, flagPoland, flagSpain, flagPortugal, flagFrance, flagNetherlands, flagHungary, flagCzechia);

//effects
const seaExplosion = document.getElementById("explosion");
const planeExplosion = document.getElementById("planeExplosion");
const plop = document.getElementById("plop");
const plops = [];

//audio

//simplifies code to assign a sprite to an object by creating a function
function drawSprite(img, sX, sY, sW, sH, dX, dY, dW, dH){
  ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH);
}

//player object (crosshairs)
drawPlayer = function (size){
    //horizontal line
    ctx.beginPath();
    ctx.rect ((playerX - (size/2)), playerY-1, size, 3);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
    //vertical line
    ctx.beginPath();
    ctx.rect (playerX-1, (playerY - (size/2)), 3, size);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
    //enclosing circle
    ctx.beginPath();
    ctx.arc (playerX, playerY, size, 0, 2 * Math.PI);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "red";
    ctx.stroke();
    ctx.closePath();
}

backgroundUpdate = function (){
    if (playerX > 0 && playerX < (canvas.width/3)) background = background1;
    else if (playerX > (canvas.width/3) && playerX < ((canvas.width/3)*2)) background = background2;
    else if (playerX > ((canvas.width/3)*2) && playerX < canvas.width) background = background3;
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    if (heatAlpha >= 1 && heatAlphaSwitch === 'increase'){
        heatAlphaSwitch = 'decrease';
    } else if (heatAlpha <= 0.5 && heatAlphaSwitch === 'decrease') {
        heatAlphaSwitch = 'increase';
    }
    if (heatAlphaSwitch === 'decrease') heatAlpha-=0.02;
    else if (heatAlphaSwitch === 'increase') heatAlpha+=0.02;
    ctx.beginPath();
    ctx.fillStyle = 'rgba(255, 0, 0, ' + heatAlpha + ')';
    ctx.fillRect(canvas.width - 310, canvas.height - 50, heat * 100, 10);
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.rect(canvas.width - 311, canvas.height - 51, 101, 11);
    ctx.stroke();
    ctx.closePath();
    ctx.fillStyle = 'yellow'
    ctx.fillText('HEAT', canvas.width - 280, canvas.height - 20);
    if (heat > 0) heat -= 0.005;
    if (heat < 0) heat = 0;
    console.log(heat);
}
//boat object
class Boat {
    constructor(){
        this.x = Math.floor(Math.random() * (3000 - 800) + 800);
        this.y = Math.floor(Math.random() * (330 - 100) + 100);
        this.width = 65;
        this.height = 45;
        this.frameX = 0;
        this.frameY = 0;
        this.sprite = boat;
        this.flag = flags[Math.floor(Math.random() * (flags.length - 0) + 0)];
        this.speed = Math.floor(Math.random() * (4 - 1.5) + 1.5);
        this.spookSpeed = (this.speed*2);
        this.vertSpeed = 1;//has to be one otherwse will cause jittering if destY isn't a multiple of this.speed
        this.destX = -100;
        this.destY = Math.floor(Math.random() * (330 - 100) + 100);
        this.toDangerX = null;
        this.toDangerY = null;
        this.toDangerLength = null;
        this.visa = false;
        this.spooked = false;
        this.arrived = false;
        this.dead = false;
        //what about adding a couple of RNG "waypoints" so that it creates a dodging effect
    }
    draw(){
        if (this.dead === false){
            ctx.drawImage(this.sprite, this.x, this.y);
            ctx.drawImage(this.flag, this.x+34, this.y+1);
        } else {
            drawSprite(seaExplosion, this.width*this.frameX, this.height*this.frameY, this.width, this.height, this.x, this.y, this.width, this.height);
            this.frameX++;
        }
    }
    update(){
        if (this.x > this.destX){
            this.x -= this.speed;
        }
        if (this.x <= (0-this.width)) this.arrived = true;
        if (this.y !== this.destY && this.x < canvas.width){
            if (this.y < this.destY){
                this.y += this.vertSpeed;
            } else if (this.y > this.destY){
                this.y -= this.vertSpeed;
            }
        }
        if (plops.length != 0 && plops[0].frameX === 0){
            this.toDangerX = playerX - (this.x+32);
            this.toDangerY = playerY - (this.y+22);
            this.toDangerLength = Math.sqrt((this.toDangerX * this.toDangerX) + (this.toDangerY * this.toDangerY));
            if (this.toDangerLength < 75) this.spooked = true;
        }
        if (this.spooked) this.speed = this.spookSpeed;
        if (plops.length != 0 && plops[0].frameX < 2){
            if (playerX > this.x && playerX < (this.x+this.width) && playerY > this.y && playerY < (this.y+this.height)) this.dead = true;
        }
        if (this.flag === visa1.img || this.flag === visa2.img || this.flag === visa3.img || this.flag === visa4.img || this.flag === visa5.img) this.visa = true;
        
        //if dead or arrived then splice from array and adjust score
    }
    remove(){
        let i = npcs.indexOf(this);
        if (this.frameX === 1 ) audioHandler('./sounds/bangsink.wav')
        if (this.frameX > 6 && this.visa === false) {
            npcs.splice(i,1);
            score++;
        }
        else if (this.frameX > 6 && this.visa === true) {
            npcs.splice(i,1);
            score -= 3;
        }
        if (this.arrived && this.visa === false) {
            npcs.splice(i,1);
            score -= 2;
        }
        else if (this.arrived && this.visa === true) {
            npcs.splice(i,1);
            score += 3;
        }
    }
}

//plane object
class Plane {
    constructor(){
        this.x = canvas.width;
        this.y = 5;
        this.width = 100;
        this.height = 35;
        this.frameX = 0;
        this.frameY = 0;
        this.sprite = plane;
        this.flag = flags[Math.floor(Math.random() * (flags.length - 0) + 0)];
        this.speed = 3;//placeholder
        this.destX = 0 - this.width;
        this.destY = null;
        this.angle = 0;
        this.va = Math.random() * 0.1 + 0.1;
        this.visa = false;
        this.arrived = false;
        this.dead = false; //maybe use this for custom plane death animation?
    }
    draw(){
        if (this.dead === false){
        ctx.drawImage(this.sprite, this.x, this.y);
        ctx.drawImage(this.flag, this.x+69, this.y+5);
        } else {
        drawSprite(planeExplosion, this.width*this.frameX, this.height*this.frameY, this.width, this.height, this.x, this.y, this.width, this.height);
        this.frameX++;
        this.y += 8;
        }
    }
    update(){
        if (this.x > this.destX){
            this.x -= this.speed;
        }
        this.angle += this.va;
        this.y += Math.sin(this.angle);
        if (this.x <= (0-this.width)) this.arrived = true;
        if (plops.length != 0 && plops[0].frameX < 2){
            if (playerX > this.x && playerX < (this.x+this.width) && playerY > this.y && playerY < (this.y+this.height)) this.dead = true;
        }
        if (this.flag === visa1.img || this.flag === visa2.img || this.flag === visa3.img || this.flag === visa4.img || this.flag === visa5.img) this.visa = true;
    }
    remove(){
        let i = npcs.indexOf(this);
        if (this.frameX === 1 ) audioHandler('./sounds/plane.wav')
        if (this.frameX > 9 && this.visa === false) {
            npcs.splice(i,1);
            score++;
        }
        else if (this.frameX > 9 && this.visa === true) {
            npcs.splice(i,1);
            score -= 3;
        }
        if (this.arrived && this.visa === false) {
            npcs.splice(i,1);
            score -= 2;
        }
        else if (this.arrived && this.visa === true) {
            npcs.splice(i,1);
            score += 3;
        }
    }
}

npcSpawner = function() {
    if (npcsSpawnCounter < npcsSpawnLimiter && npcs.length < npcsOnScreen){
        for (i=0; i < npcsOnScreen; i++){
            let chance = Math.floor(Math.random() * 100);
            if (chance < 95) npcs.push(new Boat());
            else npcs.push(new Plane());
            //80% chance to spawn a boat rather than a plane
        }
        npcsSpawnCounter++;
    }
}

//shell
class Shell {
    constructor (){
        this.x = (playerX-12.5);
        this.y = (playerY-40);
        this.width = 25;
        this.height = 50;
        this.frameX = 0;
        this.frameY = 0;
    }
    draw(){
        if (playerY > 100){
            drawSprite(plop, this.width*this.frameX, this.height*this.frameY, this.width, this.height, this.x, this.y, this.width, this.height);
            this.frameX++
        }
        if (playerY < 100 && this.frameX < 2){
            ctx.fillStyle = "black";
            ctx.beginPath();
            ctx.arc(this.x+12.5, this.y+40, 7, 0, Math.PI*2);
            ctx.fill();
            ctx.closePath();
            this.frameX++;
        }
        if (playerY < 100 && this.frameX < 2){
            ctx.fillStyle = "black";
            ctx.beginPath();
            ctx.arc(this.x+12.5, this.y+40, 5, 0, Math.PI*2);
            ctx.fill();
            ctx.closePath();
            this.frameX++;
        }
        if (playerY < 100 && this.frameX >= 2 && this.frameX < 4){
            ctx.fillStyle = "black";
            ctx.beginPath();
            ctx.arc(this.x+12.5, this.y+40, 3, 0, Math.PI*2);
            ctx.fill();
            ctx.closePath();
            this.frameX++;
        }
        if (playerY < 100 && this.frameX >= 4 && this.frameX < 7){
            ctx.fillStyle = "black";
            ctx.beginPath();
            ctx.arc(this.x+12.5, this.y+40, 2, 0, Math.PI*2);
            ctx.fill();
            ctx.closePath();
            this.frameX++;
        }
    }
    remove(){
        let i = plops.indexOf(this);
        if (this.frameX > 6) plops.splice(i, 1);
    }
}

visaHandler = function (){
    let rng = Math.floor(Math.random() * 10);

    if (npcsSpawnCounter === 2 && visa1.img === null){
        visa1.img = flags[rng];
    }
    else if (npcsSpawnCounter === 3 && visa2.img === null){
        visaCheck = flags[rng];
        while (visaCheck === visa1.img){
            rng = Math.floor(Math.random() * 10);
            visaCheck = flags[rng];
        }
        visa2.img = visaCheck;
    }
    else if (npcsSpawnCounter === 4 && visa3.img === null){
        visaCheck = flags[rng];
        while (visaCheck === visa1.img || visaCheck === visa2.img){
            rng = Math.floor(Math.random() * 10);
            visaCheck = flags[rng];
        }
        visa3.img = visaCheck;
    }
    else if (npcsSpawnCounter === 5 && visa4.img === null){
        visaCheck = flags[rng];
        while (visaCheck === visa1.img || visaCheck === visa2.img || visaCheck === visa3.img){
            rng = Math.floor(Math.random() * 10);
            visaCheck = flags[rng];
        }
        visa4.img = visaCheck;
    }
    else if (npcsSpawnCounter === 6 && visa5.img === null){
        visaCheck = flags[rng];
        while (visaCheck === visa1.img || visaCheck === visa2.img || visaCheck === visa3.img || visaCheck === visa4.img){
            rng = Math.floor(Math.random() * 10);
            visaCheck = flags[rng];
        }
        visa5.img = visaCheck;
    }
}

//scorekeeping
drawScore = function() {
  ctx.font = "normal bolder 16px verdana";
  ctx.fillStyle = "yellow";
  ctx.fillText ("SCORE: "+score, canvas.width-150, canvas.height-35);
}

drawVisa = function() {
    ctx.font = "normal bolder 14px verdana";
    ctx.fillStyle = "yellow";
    ctx.fillText ("Open Border Treaty Agreed With:", 33, 440);
    ctx.beginPath();
    ctx.rect(40, 450, 250, 40)
    ctx.lineWidth = 3;
    ctx.strokeStyle = "orange";
    ctx.stroke();
    ctx.closePath();

    let visa1X = 50; let visa2X = 100; let visa3X = 150; let visa4X = 200; let visa5X = 250;
    let visaY = 460;
    let visaW = 30; let visaH = 20;

    if (visa1.img !== null) {
        ctx.drawImage(visa1.img, visa1.x, visa1.y, visa1.w, visa1.h);
        if (visa1.x > visa1X) visa1.x -= 3;
        if (visa1.y < visaY) visa1.y +=2;
        if (visa1.w > visaW) visa1.w -=1.5;
        if (visa1.h > visaH) visa1.h -=1;
    }
    if (visa2.img !== null) {
        ctx.drawImage(visa2.img, visa2.x, visa2.y, visa2.w, visa2.h);
        if (visa2.x > visa2X) visa2.x -= 3;
        if (visa2.y < visaY) visa2.y +=2;
        if (visa2.w > visaW) visa2.w -=1.5;
        if (visa2.h > visaH) visa2.h -=1;
    }
    if (visa3.img !== null) {
        ctx.drawImage(visa3.img, visa3.x, visa3.y, visa3.w, visa3.h);
        if (visa3.x > visa3X) visa3.x -= 3;
        if (visa3.y < visaY) visa3.y +=2;
        if (visa3.w > visaW) visa3.w -=1.5;
        if (visa3.h > visaH) visa3.h -=1;
    }
    if (visa4.img !== null) {
        ctx.drawImage(visa4.img, visa4.x, visa4.y, visa4.w, visa4.h);
        if (visa4.x > visa4X) visa4.x -= 3;
        if (visa4.y < visaY) visa4.y +=2;
        if (visa4.w > visaW) visa4.w -=1.5;
        if (visa4.h > visaH) visa4.h -=1;
    }
    if (visa5.img !== null) {
        ctx.drawImage(visa5.img, visa5.x, visa5.y, visa5.w, visa5.h);
        if (visa5.x > visa5X) visa5.x -= 3;
        if (visa5.y < visaY) visa5.y +=2;
        if (visa5.w > visaW) visa5.w -=1.5;
        if (visa5.h > visaH) visa5.h -=1;
    }
}

//event listeners for keypresses. keycode used as keys wasn't working properly with the version of chrome the programme was tested on
window.addEventListener("keydown", function (e){
  keys[e.keyCode] = true;//when a key is pressed that key is added to the keys array
});
window.addEventListener("keyup", function (e){
  delete keys[e.keyCode]; //when a key is released that key is deleted from the keys array.  This method prevents event listeners from interfering with one another and makes control more responsive.
});

function audioHandler(pathway){
    fetch(pathway)
    .then(data =>data.arrayBuffer())
    .then(arrayBuffer => actx.decodeAudioData(arrayBuffer))
    .then(decodedAudio => {
        let sample = decodedAudio;
        let playSound = actx.createBufferSource();
        playSound.buffer = sample;
        playSound.connect(actx.destination);
        playSound.start(actx.currentTime);
    });
} 

//player movement and shooting logic
movePlayer = function (){
    if ((keys[87] || keys[38]) && playerY > 20){//up
        playerY -= playerSpeed;
    }
    if ((keys[65] || keys[37]) && playerX > 0){//left
        playerX -= playerSpeed;
    }
    if ((keys[83] || keys[40]) && playerY < 380){//down
        playerY += playerSpeed;
    }
    if ((keys[68] || keys[39]) && playerX < canvas.width){//right
        playerX += playerSpeed;
    }
    if (keys[32] && plops.length < 1 && heat <= 0.8) {
        plops.push(new Shell());
        heat += 0.2;
        audioHandler('./sounds/bang2.wav');
    }
    if (keys[86]) visaHandler();
}

//animate the player sprite. Required as player was not built using a constructor
function handlePlayerFrame(){
  if (player.frameX < 3 && player.moving) player.frameX++
  else player.frameX = 0;
}

function endGame(){
    if (npcsSpawnCounter === npcsSpawnLimiter){
        ctx.textAlign = "center";
        ctx.font ="normal bolder 64px verdana";
        ctx.fillText('END', canvas.width/2, canvas.height/2 - 80);
        ctx.fillText("FINAL SCORE: " + score, canvas.width/2, canvas.height/2);
        if (score < 0) ctx.fillText("Congrats. You suck.", canvas.width/2, canvas.height/2 + 80);
        continueAnimating = false;
    };
}

//animation logic. lifted wholesale from a tutorial
let fps, fpsInterval, startTime, now, then, elapsed; //declare empty variables

function startAnimating(fps){ //function needed to kick off the animation by getting system time and tying fps to system time.
  fpsInterval = 1000/fps; //how much time passes before the next frame is served
  then = Date.now(); //Date.now is no. of ms elapsed since 1.1.1970
  startTime = then;
  animate();
}

//where the magic happens
function animate(){
  if (continueAnimating === true) {
    requestAnimationFrame(animate); //pass the parent function to RAF to cause it to call itself recursively
    now = Date.now();
    elapsed = now - then;
    if (elapsed > fpsInterval) { //check to see if it's time to draw the next frame
      then = now - (elapsed % fpsInterval); //resets the clock to keep frame rate consistent
      ctx.clearRect (0, 0, canvas.width, canvas.height); //gets rid of everything and draws fresh

    
    music.play();
    backgroundUpdate();
    npcSpawner();
    for (i=0; i < npcs.length; i++){
    npcs[i].draw();
    npcs[i].update();
    npcs[i].remove();
    }
    
    if (plops.length != 0){
        for (i=0; i < plops.length; i++){
            plops[i].draw();
            plops[i].remove();
        }
    }

    drawPlayer(20);
    movePlayer();
    drawScore();
    visaHandler();
    drawVisa();
    endGame();
    }
  }
}
if (continueAnimating) startAnimating(30); //starts the animation and condition prevents this from restarting the animation once the game has ended
