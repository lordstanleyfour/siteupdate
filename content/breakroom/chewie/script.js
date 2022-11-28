const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 800; //declares variables which let the script know what the html has drawn the canvas at
canvas.height = 500;

var keys = [];
var refugees = []; //refugee array
var troops = []; //stormtrooper array
const shootFrame = [59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131]; //15 prime numbers for troppers shooting intervals
const refugeeNumbers = 15; //number of refugees allowed at once 
const troopsNumbers = 20; //number of troops allowed at once(placeholder)
var score = 0; //number of refugees safely arrived
var dead = 0;
var killed = 0;
var refugeeSpawns = 0; //track total number of refugee spawns since start
const maxRefugeeSpawns = 150; //150
var finalScore = 0;
var continueAnimating = true;
var gameStart = false;

const playerSprite = document.getElementById("chewie");
const background = document.getElementById("background");
const troopSprite = document.getElementById("stormtrooper");
const boom = document.getElementById("boom");

const refugeeSprites = [];
const refugee1 = document.getElementById("toby");
const refugee2 = document.getElementById("tobywig");
const refugee3 = document.getElementById("bith");
const refugee4 = document.getElementById("c3p0");
const refugee5 = document.getElementById("dart");
const refugee6 = document.getElementById("falleen");
const refugee7 = document.getElementById("jawa");
const refugee8 = document.getElementById("oola");
const refugee9 = document.getElementById("toki");
refugeeSprites.push(refugee1, refugee2, refugee3, refugee4, refugee5, refugee6, refugee7, refugee8, refugee9);

const deathSounds = [];
const music = document.getElementById("music");
const roar = document.getElementById("roar");
const bang = document.getElementById("bang");
const death1 = document.getElementById("death1");
const death2 = document.getElementById("death2");
const death3 = document.getElementById("death3");
const death4 = document.getElementById("death4");
const death5 = document.getElementById("death5");
deathSounds.push(death1, death2, death3, death4, death5);
let roared = false;

function drawSprite(img, sX, sY, sW, sH, dX, dY, dW, dH){
  ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH);
}

const player = {
  x: 200,
  y: 200,
  width: 40,
  height: 72,
  frameX: 0,
  frameY: 0,
  speed: 9, 
  moving: false
};

class Refugee {
  constructor(){
    this.width = 32;
    this.height = 48;
    this.frameX = 0;
    this.frameY = 3;
    this.x = (Math.random() * (150 - 0) + 0);
    this.y = (Math.random() * (1250-550) + 550);//stagger starting y to simulate timed spawn start
    this.sprite = refugeeSprites[Math.floor(Math.random() * refugeeSprites.length)]; //randomise sprite
    this.moving = false;
    this.speed = (Math.random() * ((player.speed * 0.5) - (player.speed * 0.25)) + (player.speed * 0.25));
    this.destX = (Math.random() * (100 - 20) + 20); //Math.random() * (max-min) + min
    this.destY = 100;
    this.arrived = false;
    this.killed = false;
    this.dead = false;
  }
  draw(){
    drawSprite(this.sprite, this.width*this.frameX, this.height*this.frameY, this.width, this.height, this.x, this.y, this.width, this.height);
      if (this.frameX < 3 && this.moving) this.frameX++
      else this.frameX = 0;
    }  
  update(){
    if (this.y > this.destY) { //moving up the screen logic
      this.y -= this.speed;
      this.moving = true;
    }
    if (this.x > this.destX && this.y < canvas.height-100){//correcting for X
      this.x -= (this.speed * 0.2);
      this.moving = true;
    }
    if (this.x < this.destX && this.y < canvas.height-100){//correction for X
      this.x += (this.speed * 0.2);
      this.moving = true;
    }
    if (this.x > (this.destX-5) && this.x < (this.destX + 5) && this.y <= this.destY) {
      this.moving = false; //arrival logic
      this.arrived = true;
    }   
    
  }
  remove(){
    let j = refugees.indexOf(this);
    if (this.arrived === true) {
      score++;
      refugees.splice(j, 1);
    }
    if (this.killed === true) {      
      refugees.splice(j, 1);
      this.dead + true;
      dead+=1;
    }
  }
}

/* move enemy sprite towards player: 
//calculate direction towards player
toPlayerX = playerX - this.x;
toPlayerY = playerY - this.y;
//normalise
toPlayerLength = Math.sqrt(toPlayerX * toPlayerX + toPlayerY * toPlayerY); //total distance to cover
toPlayerX = toPlayerX / toPlayerlength; //proportion of total distance in X axis
toPlayerY = toPlayerY / toPlayerLength; 
//move towards player
this.x += toPlayerX * this.speed;
this.y += to playerY * this.speed;*/


class Troop {
  constructor(){
    this.width = 32;
    this.height = 48;
    this.frameX = 0;
    this.frameY = 1;
    this.moving = false;
    this.x = (Math.floor(Math.random() * (1200 - 850))+850); //placeholder values for sprite check
    this.y = (Math.floor(Math.random() * (450 - 150))+150); //placeholder values for sprite check
    this.speed = 7; //placeholder, define better later
    this.target = refugees[(Math.floor(Math.random() * (refugees.length)))]; //which index of the refugee array to take targetX and targetY from
    this.targetX = 0;
    this.targetY = 0;
    this.toTargetX = 0;
    this.toTargetY = 0;
    this.toTargetLength = 0;
    this.toPlayerX = 0;
    this.toPlayerY = 0;
    this.toPlayerLength = 0;
    this.destX = 0;
    this.destY = 0;
    this.deathSound = deathSounds[Math.floor(Math.random() * deathSounds.length)];
    this.firing = false;
    this.suicide = false;
    this.dead = false;
    this.killed = false;
    this.startTimer = null;
    this.timer = null;
    this.shooting = false;
    this.blastX = null;
    this.blastY = null;
    this.shootingFrame = shootFrame[(Math.floor(Math.random() * (shootFrame.length)))];
    this.stopX = (Math.floor(Math.random() * (400 - 300))+300);
    //does it need a var to initiate despawn?
  }
  draw(){
    if (this.suicide === false){
        drawSprite(troopSprite, this.width*this.frameX, this.height*this.frameY, this.width, this.height, this.x, this.y, this.width, this.height);
        if (this.frameX < 3 && this.moving) this.frameX++
        else this.frameX = 0;
        if (this.timer > this.startTimer) this.timer++;
        if (this.shooting = true) {
          ctx.beginPath();
          ctx.rect (this.blastX, this.blastY, 15, 3);
          ctx.fillStyle = "red"
          ctx.fill();
          ctx.closePath();
          this.blastX -= 20;
        }
    }
    else {
      drawSprite(boom, this.width*this.frameX, this.height*this.frameY, this.width, this.height, this.x, this.y, this.width, this.height);
      this.deathSound.play ();
      if (this.frameY < 8) {
        this.frameX = 0;
        this.frameY++;
        if (this.frameY === 8){
          this.dead = true;
        }
      }
    }
  }
  update(){
    let sap = this.target; //couldn't figure out how to make the troop change target without declaring a local variable
    this.targetX = sap.x;
    this.targetY = sap.y;
    this.toTargetX = this.targetX - this.x;
    this.toTargetY = this.targetY - this.y;
    this.toTargetLength = Math.sqrt(this.toTargetX * this.toTargetX + this.toTargetY * this.toTargetY);
    this.toTargetX = this.toTargetX / this.toTargetLength;
    this.toTargetY = this.toTargetY / this.toTargetLength;
    this.toPlayerX = (player.x+20) - (this.x+16);
    this.toPlayerY = (player.y+36) - (this.y+24);
    this.toPlayerLength = Math.sqrt(this.toPlayerX * this.toPlayerX + this.toPlayerY * this.toPlayerY);

    if (this.startTimer == null) this.startTimer = Date.now();
    if (this.timer == null) this.timer = this.startTimer;
    if (this.timer === this.startTimer) this.timer++;

    if ((this.timer - this.startTimer) % this.shootingFrame === 0) {
      this.blastX = this.x;
      this.blastY = this.y+(this.height/2);
      this.shooting = true;
    }
    if (this.blastX < 0) this.shooting = false;

    if (this.x > this.stopX) {
      this.x -= this.speed;
      this.moving = true;
    } else this.moving = false;

    if (refugees.length != 0) { //stops the troopers spazzing out endgame
      //walk towards target if target on canvas
      if (this.targetY < canvas.height && this.targetX > 0 && this.x < this.stopX){
        this.x += this.toTargetX * this.speed;
        this.y += this.toTargetY * this.speed;
        this.moving = true;
      } //else this.moving = false;

      //check if target has arrived and select a new target if they have
      if (sap.arrived === true){
        sap = refugees[(Math.floor(Math.random() * (refugees.length)))]
        if (sap.arrived === false) {
          this.target = sap;
        }
      }

      //check if target has arrived and select a new target if they have
      if (sap.dead === true){
        sap = refugees[(Math.floor(Math.random() * (refugees.length)))]
        if (sap.dead === false) {
          this.target = sap;
        }
      }

      //kill refugee on contact
      if (this.toTargetLength < sap.width) {
        sap.killed = true;
        this.suicide = true;
        bang.play ();
      }   

    }

    if (this.toPlayerLength < this.height) {
      this.suicide = true;
      this.killed = true;
    }

  }
  remove(){
    let i = troops.indexOf(this);
    if (this.dead === true && this.killed === false) {
      troops.splice(i, 1);
    }
    if (this.dead === true && this.killed === true) {
      killed++;
      troops.splice(i, 1);
      //this.deathSound.play ();
    }
  }
}

refugeeSpawner = function() {
  if (refugeeSpawns < maxRefugeeSpawns && refugees.length < refugeeNumbers){
    for(i=0; i < refugeeNumbers; i++) { //add refugees to the game
      refugees.push(new Refugee());
      refugeeSpawns++;
    }
  }
}

troopSpawner = function() {
  if (troops.length < 10){
    for (i=0; i < (troopsNumbers - troops.length); i++) {
      troops.push(new Troop());
    }
  }
}

drawScore = function() {
  ctx.beginPath();
  ctx.font = "normal bolder 16px verdana";
  ctx.fillStyle = "rgb(0, 0, 0)";
  ctx.fillText ("Rescued refugees: "+score, canvas.width-230, 20);
  ctx.fillText ("Lost refugees: "+dead, canvas.width-230, 40);
  ctx.fillText ("Killed stormtroopers: "+killed, canvas.width-230, 60);
  ctx.fillText ("Total score: "+finalScore, canvas.width-230, 80);
  finalScore = ((score + killed)-dead);
}

window.addEventListener("keydown", function (e){
  keys[e.keyCode] = true;//when a key is pressed that key is added to the keys array
  player.moving = true;
});

window.addEventListener("keyup", function (e){
  delete keys[e.keyCode]; //when a key is released that key is deleted from the keys array.  This method prevents event listeners from interfering with one another and makes control more responsive.
  player.moving = false;
});

function movePlayer() {
  if (keys[38] && player.y > 100){//up
    player.y -= player.speed;
    player.frameY = 3;
    player.moving = true;
  }
  if (keys[37] && player.x > 0){//left
    player.x -= player.speed;
    player.frameY = 1;
    player.moving = true;
  }
  if (keys[40] && player.y < (canvas.height - player.height)){//down
    player.y += player.speed;
    player.frameY = 0;
    player.moving = true;
  }
  if (keys[39] && player.x < (canvas.width - player.width)){//right
    player.x += player.speed;
    player.frameY = 2;
    player.moving = true;
  }
}
function handlePlayerFrame(){
  if (player.frameX < 3 && player.moving) player.frameX++
  else player.frameX = 0;
}

function rawr(){
  if (killed % 8 === 0 && killed != 0 && !roared) {
    roar.play ();
    roared = true;
  } else if (killed % 8 != 0) roared = false;
  if (score+dead === maxRefugeeSpawns) roar.play ();
}

function startGame(){
  ctx.beginPath;
  ctx.strokeStyle = "black";
  ctx.strokeWeight = 3;
  ctx.fillStyle = "grey";
  if (!gameStart){
    ctx.fillRect(canvas.width/2 - 160, canvas.height/2 - 50, 340, 55);
    ctx.rect(canvas.width/2 - 160, canvas.height/2 - 50, 340, 55);
    ctx.stroke();
    ctx.fillStyle = "black";
    ctx.font = "normal bolder 32px verdana";
    ctx.fillText("Press UP to start", canvas.width/2 - 140, canvas.height/2 - 10);
    drawSprite(playerSprite, player.width*player.frameX, player.height*player.frameY, player.width, player.height, player.x, player.y, player.width, player.height);
  }
  if (keys[38]){
    gameStart = true;
  }
}

let fps, fpsInterval, startTime, now, then, elapsed; //declare empty variables

function startAnimating(fps){ //function needed to kick off the animation by getting system time and tying fps to system time.
  fpsInterval = 1000/fps; //how much time passes before the next frame is served
  then = Date.now(); //Date.now is no. of ms elapsed since 1.1.1970
  startTime = then;
  animate();
}

function animate(){
  if (continueAnimating === true) {
    requestAnimationFrame(animate); //pass the parent function to RAF to cause it to call itself recursively
    now = Date.now();
    elapsed = now - then;
    if (elapsed > fpsInterval) { //check to see if it's time to draw the next frame
      then = now - (elapsed % fpsInterval); //resets the clock to keep frame rate consistent
      ctx.clearRect (0, 0, canvas.width, canvas.height);
      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
      //by giving requestAnimationFrame the name of it's parent function as a parameter it will run
      //repeatedly until infinity.  The function needs to be called once outside of itself to initialise.

    music.play();

    if (!gameStart) movePlayer();
    startGame();

      if (gameStart){
        for (i=0; i < refugees.length; i++){
        refugees[i].draw();
        refugees[i].update();
        refugees[i].remove();
        }
        refugeeSpawner();
    
        for (i=0; i < troops.length; i++){
          troops[i].draw();
          troops[i].update();
          troops[i].remove();
        }
        troopSpawner();
    
        drawSprite(playerSprite, player.width*player.frameX, player.height*player.frameY, player.width, player.height, player.x, player.y, player.width, player.height);
        movePlayer();
        handlePlayerFrame();
        rawr();
        drawScore();
        if (score+dead === maxRefugeeSpawns) {
          //continueAnimating = false;
          gameStart = false;
          alert(`Your final score is ${finalScore}`)
          if (confirm("Press OK to restart")) {
            score = 0;
            dead = 0;
            killed = 0;
            refugeeSpawns = 0;
            refugees = [];
            troops = [];
            keys = [];
            finalScore = 0;
            player.x = 200;
            player.y = 200;
            player.moving = false;
          } else {
            continueAnimating = false;
          }
        }
      }
    }
  }
}

if (continueAnimating) startAnimating(15);

//bugs
//stormtrooper sprite blinking; happens when one dies, another blinks. 
////get the stormtroopers to show a number over their heads on screen to represent array index
////figure out which order the blinks happen
////theory is that when element spliced, the next element gets the prev index and is thus skipped by the for loop 
////do something to how the draw function is called on the array or how the splice happens
////(filter array rather than splice? check prev franks projects)

//features to consider
//restart on game over

//touchscreen controls; hold up/down/left/right of chewie to move in that direction
//balance scoring so that game isn't winnable by standing still
////more troopers (need faster player)
////slower refugees
////bolts are actually objects dangerour to the refugees
////some troopers throw grenades
//tie fighter flyover which drops a bomb

