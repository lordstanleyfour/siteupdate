const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 800; //declares variables which let the script know what the html has drawn the canvas at
canvas.height = 500;

var continueAnimating = true;
var roll = false;
const keys = [];
var score = 0;
var frameCounter = 0;
var animateCounter = 0;
var refText = "CHECK";


const background0 = new Image ();
background0.src = "background.png";
const background1 = new Image ();
background1.src = "background1.png";
const background2 = new Image ();
background2.src = "background2.png";
const background3 = new Image ();
background3.src = "background3.png";
const backgroundEnd = new Image ();
backgroundEnd.src = "backgroundend.png";
const backgroundEndBad = new Image ();
backgroundEndBad.src = "backgroundendbad.png";
const backgroundImages = [background0, background1, background2, background3];
var background = backgroundImages[0];
const startImage = new Image ();
startImage.src = "start.png";

//images library
const xrayImages = [];

const chestGood = new Image ();
chestGood.src = "chestok.png";
const footGood = new Image ();
footGood.src = "footgood.png";
const kneeGood = new Image ();
kneeGood.src = "kneegood.png";
const kneeGood1 = new Image ();
kneeGood1.src = "kneegood2.png";
const pelvisGood1 = new Image ();
pelvisGood1.src = "pelvisgood1.png";
const pelvisGood2 = new Image ();
pelvisGood2.src = "pelvisgood2.png";
const wristGood = new Image ();
wristGood.src = "wristgood.png";
const elbowGood1 = new Image ();
elbowGood1.src = "elbowgood1.png";
const elbowGood2 = new Image ();
elbowGood2.src = "elbowgood2.png";
const handGood = new Image ();
handGood.src = "handgood.png";
xrayImages.push(chestGood, footGood, kneeGood, kneeGood1, pelvisGood1, pelvisGood2, wristGood, elbowGood1, elbowGood2, handGood)

const chestBad1 = new Image ();
chestBad1.src = "chestbad1.png";
const chestBad2 = new Image ();
chestBad2.src = "chestbad2.png";
const chestBad3 = new Image ();
chestBad3.src = "chestbad3.png";
const detector = new Image ();
detector.src = "detector.png";
const elbowbad = new Image ();
elbowbad.src = "elbowbad.png";
const footBad1 = new Image ();
footBad1.src = "footbad1.png";
const footBad2 = new Image ();
footBad2.src = "footbad2.png";
const kneeBad = new Image ();
kneeBad.src = "kneebad.png";
const pelvisBad1 = new Image ();
pelvisBad1.src = "pelvisbad1.png";
const wristBad1 = new Image ();
wristBad1.src = "wristbad1.png";
const wristBad2 = new Image ();
wristBad2.src = "wristbad2.png";
xrayImages.push(chestBad1, chestBad2, chestBad3, detector, footBad1, footBad2, kneeBad, pelvisBad1, wristBad1, wristBad2, elbowbad);

const lose1 = new Image ();
lose1.src = "losebad.png";
const lose2 = new Image ();
lose2.src = "losegood.png";
const win1 = new Image ();
win1.src = "wincpd.png";
const win2 = new Image ();
win2.src = "winregistrar.png";
const win3 = new Image ();
win3.src = "winconsultant.png";

const displayedImage = [startImage];
var imagePrime = startImage; //create a starting image to call here
var imageCheck = null;

const horn = new Audio ();
horn.src = "horn.wav";
const fart = new Audio ();
fart.src = "fart.wav";

function scoring (){
  if (roll) score++;
  ctx.font = "normal bolder 32px impact";
  ctx.fillStyle = "rgb(3, 53, 252)";
  ctx.fillText ("S C O R E :      "+score, canvas.width-210, 50);
}

/*const gameSounds = [];
const roar = new Audio ();

roar.src = "roar.mp3";
gameSounds.push();*/

function drawSprite(img, sX, sY, sW, sH, dX, dY, dW, dH){
  ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH);
}

function rollImage(){
  let num = Math.floor(Math.random() * (xrayImages.length - 0) + 0);
  imageCheck = xrayImages[num];
  if (imageCheck !== imagePrime){
    imagePrime = imageCheck;
    displayedImage.push(imagePrime);
    roll = false;
  } else roll = true;  
}

function displayImage(){
  ctx.drawImage(displayedImage[displayedImage.length-1], 100, 75);
}

function chooseReferralText(){
  if (imagePrime === chestGood || imagePrime === chestBad1 || imagePrime === chestBad2 || imagePrime === chestBad3) refText = "CHEST";
  else if (imagePrime === detector || imagePrime === wristBad1 || imagePrime === wristBad2 || imagePrime === wristGood) refText = "WRIST";
  else if (imagePrime === footBad1 || imagePrime === footBad2 || imagePrime === footGood) refText = "FOOT";
  else if (imagePrime === kneeBad || imagePrime === kneeGood || imagePrime === kneeGood1) refText = "KNEE";
  else if (imagePrime === pelvisBad1 || imagePrime === pelvisGood1 || imagePrime === pelvisGood2) refText = "PELVIS";
  else if (imagePrime === elbowGood1 || imagePrime === elbowGood2 || imagePrime === elbowbad) refText = "ELBOW";
  else if (imagePrime === handGood) refText = "HAND";
}

function referralText(){
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.save();
  ctx.rotate(-Math.PI/6);
  ctx.translate(-212,50);
  ctx.font = "normal bolder 16px verdana";
  ctx.fillStyle = "rgb(3, 53, 252)";
  ctx.fillText (refText, 185, 420);
  ctx.restore();
}

window.addEventListener("keydown", function (e){
  keys[e.keyCode] = true;//when a key is pressed that key is added to the keys array
});

window.addEventListener("keyup", function (e){
  delete keys[e.keyCode]; //when a key is released that key is deleted from the keys array.  This method prevents event listeners from interfering with one another and makes control more responsive.
});

function keyPressHandler(){
  if (keys[32]/*space*/) roll = true; //for testing only
  if (imagePrime === startImage) {
    if (keys[65] || keys [68]) {
      roll = true;
      score = 0;
  }
}
  if (keys[65]/*A*/&& imagePrime !== startImage) {
    if (imagePrime === chestGood || imagePrime === footGood || imagePrime === kneeGood || imagePrime === kneeGood1 || imagePrime === pelvisGood1 || imagePrime === pelvisGood2 || imagePrime === wristGood || imagePrime === elbowGood1 || imagePrime === elbowGood2 || imagePrime === handGood) {
      score += 2;
      roll = true;
    } else {
      score -= 5;
      roll = true;
    }
  }
  if (keys[68]/*D*/&& imagePrime !== startImage) {
    if (imagePrime === chestBad1 || imagePrime === chestBad2 || imagePrime === chestBad3 || imagePrime === detector || imagePrime === footBad1 || imagePrime === footBad2 || imagePrime === kneeBad || imagePrime === pelvisBad1 || imagePrime === wristBad1 || imagePrime === wristBad2) {
      score +=2;
      roll = true;
    } else {
      score -=5;
      roll = true;
    }
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

      if (imagePrime !== startImage) {
        frameCounter++;
        animateCounter++;
        if (animateCounter > 5) animateCounter = 0;
        if (animateCounter === 0) background = backgroundImages[0];
        else if (animateCounter === 1) background = backgroundImages[1];
        else if (animateCounter === 2) background = backgroundImages[2];
        else if (animateCounter === 3) background = backgroundImages[3];
        else if (animateCounter === 4) background = backgroundImages[2];
        else if (animateCounter === 5) background = backgroundImages[1];
      }
      keyPressHandler();
      if (roll === true) {
        rollImage();
      }
      displayImage();
      chooseReferralText();
      referralText();
      scoring();
      if (frameCounter > 160) {
        ctx.drawImage(backgroundEnd, 0, 0, canvas.width, canvas.height);
        if (score < -15) {
          ctx.drawImage(backgroundEndBad, 0, 0, canvas.width, canvas.height);
          ctx.drawImage(lose1, 100, 100);
          fart.play ();
        } else if (score <= 0) {
          ctx.drawImage(backgroundEndBad, 0, 0, canvas.width, canvas.height);
          ctx.drawImage(lose2, 100, 100);
          fart.play ();
        } else if (score > 25) {
          ctx.drawImage(win3, 100, 100);
          horn.play ();
        } else if (score > 10) {
          ctx.drawImage(win2, 100, 100);
          horn.play ();
        } else if (score > 0) {
          ctx.drawImage(win1, 100, 100);
          horn.play ();
        }
        continueAnimating = false;
      }
    }
  }
}

if (continueAnimating) startAnimating(8);
//download new images from github
//balancing - activate frame counter and set score limits for each win condition