//engines
const canvas1 = document.getElementById('canvas1');
const canvas2 = document.getElementById('canvas2');
const ctx1 = canvas1.getContext('2d');
const ctx2 = canvas2.getContext('2d');
canvas1.width = 900;
canvas1.height = 600;
canvas2.width = 900;
canvas2.height = 600;

//global variables
const controlBarSize = 300;
const outlineArray = [];
const controlsBar = {
    width: controlBarSize,
    height: canvas1.height,
}
var currentMode = undefined;
var studyModeWon = false;
var shuffledButtonArray = [];
var shuffledButtonArrayLength = null;
var shuffledButtonY = false;
var shuffledOutlineArray = [];
var shuffledOutlineArrayLength = null;
var onMobile = false;
const studyModeButton = document.getElementById('studyMode');

//the masked image @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
let maskData = [];
const mask = new Image();
mask.src = './latwristmask.png';

//mouse
if (
    navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/iPhone/i)
  ) {
    onMobile = true;
  }

const mouse1 = {
    x: undefined,
    y: undefined,
    width: 0.00001,
    height: 0.00001,
    click: false,
    touchMoving: false,
    positionX: undefined,
    positionY: undefined,
    position: undefined,
    positionRed: undefined,
    positionGreen: undefined,
    positionBlue: undefined
}

//draw the masked image to canvas2 and get image data
mask.addEventListener('load', function(){
    ctx2.drawImage(mask, controlBarSize, 0, mask.naturalWidth, mask.naturalHeight);
    maskData = ctx2.getImageData(controlBarSize, 0, 600, 600);
});

let canvasPosition1 = canvas1.getBoundingClientRect();
canvas1.addEventListener('mousemove', function(e){
    mouse1.x = e.x - canvasPosition1.left + window.pageXOffset;
    mouse1.y = e.y - canvasPosition1.top + window.pageYOffset;
    //only calculate mouse X if positioned to right of control bar
    if (Math.floor(mouse1.x - controlBarSize > 0)) mouse1.positionX = Math.floor(mouse1.x - controlBarSize);
    else mouse1.positionX = 0;
    mouse1.positionY = Math.floor(mouse1.y);
    //calculate the base index of the maskData array mouse pointer hovering over (base number - doesn't take into account the 4 bits)
    mouse1.position = ((Math.floor(mouse1.positionY) * 600) + mouse1.positionX);
    mouse1.positionRed = mouse1.position * 4;
    mouse1.positionGreen = mouse1.position * 4 + 1;
    mouse1.positionBlue = mouse1.position * 4 + 2;
});
canvas1.addEventListener('mouseleave', function(e){
    mouse1.x = undefined;
    mouse1.y = undefined;
});
canvas1.addEventListener('mousedown', function (event) {
    mouse1.click = true;
    mouse1.x = event.x - canvasPosition1.left + window.pageXOffset;
    mouse1.y = event.y - canvasPosition1.top + window.pageYOffset;
});
canvas1.addEventListener('mouseup', function (event) {
    mouse1.click = false;
});

canvas1.addEventListener('touchstart', function (event) {
    mouse1.click = true;
    
});
canvas1.addEventListener('touchmove', function (e) {
    mouse1.x = e.x - canvasPosition1.left + window.pageXOffset;
    mouse1.y = e.y - canvasPosition1.top + window.pageYOffset;
    mouse1.touchMoving = true;
});
canvas1.addEventListener('touchend', function (event) {
    mouse1.click = false;
    mouse1.touchMoving = false;
});
studyModeButton.addEventListener('click', function (){
    if (currentMode === 'STUDY1') currentMode = 'STUDY2';
    else if (currentMode === 'STUDY2') currentMode = 'STUDY1';
});


//classes and class object declarations
class Outline {
    constructor(x, y, width, height, image, name){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.source = document.getElementById(image);
        this.name = name; //string to check answers in study mode, small case
    }
    draw(){
        ctx1.drawImage(this.source, this.x, this.y, this.width, this.height);
    }
}

//declare outline objects @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
var scaphoidOutline = new Outline(controlBarSize, 0, 600, 600, 'scaphoidoutline', 'Scaphoid');
var lunateOutline = new Outline(controlBarSize, 0, 600, 600, 'lunateoutline', 'Lunate');
var pisiformOutline = new Outline(controlBarSize, 0, 600, 600, 'pisiformoutline', 'Pisiform');
var hamateOutline = new Outline(controlBarSize, 0, 600, 600, 'hamateoutline', 'Hamate');
var capitateOutline = new Outline(controlBarSize, 0, 600, 600, 'capitateoutline', 'Capitate');
var trapeziumOutline = new Outline(controlBarSize + 32, 0 + 5, 600, 600, 'trapeziumoutline', 'Trapezium');
var radiusOutline = new Outline(controlBarSize, 0, 600, 600, 'radiusoutline');
var ulnaOutline = new Outline(controlBarSize, 0, 600, 600, 'ulnaoutline');
var ulnarStyloidOutline = new Outline(controlBarSize, 0, 600, 600, 'ulnarstyloidoutline', 'Ulnar Styloid');
var pronatorQuadratusOutline = new Outline(controlBarSize, 0, 600, 600, 'PQFPoutline', 'Pronator Quadratus Fat Pad');
var hookOfHamateOutline = new Outline(controlBarSize, 0, 600, 600, 'hookofhamateoutline', 'Hook of Hamate');
var dorsalSTOutline = new Outline(controlBarSize, 0, 600, 600, 'dorsalSToutline', 'Dorsal ST');
var volarSTOutline = new Outline(controlBarSize, 0, 600, 600, 'volarSToutline', 'Volar ST');

outlineArray.push(scaphoidOutline, lunateOutline, pisiformOutline, hamateOutline, capitateOutline, trapeziumOutline, ulnarStyloidOutline, pronatorQuadratusOutline, hookOfHamateOutline, dorsalSTOutline, volarSTOutline, radiusOutline, ulnaOutline);

class Button {
    constructor(x, y, width, height, text, name) {
        this.x = x; //learning mode positions
        this.y = y;
        this.studyX = 70; //study mode positions
        this.studyY = 205;
        this.width = width;
        this.height = height;
        this.image = document.getElementById("buttonimage")
        this.text = text; //text drawn on the button
        this.name = name; //string that the checker function will use to evaluate correct answers
    }
    draw(context){
        //draw the buttons and their text in learning mode
        if (currentMode === 'LEARNING' || currentMode === 'STUDY2'){
            context.drawImage(this.image, this.x, this.y, this.width, this.height);
            context.font = '15px Verdana';
            if (this.text === 'LEARNING MODE' || this.text === 'STUDY MODE') context.font = 'bold 14px Verdana';
            context.fillStyle = "black";
            context.textAlign = 'center';
            context.fillText(this.text, this.x + (this.width/2), this.y+(this.height/1.75));
        }
        //draw the buttons and their text in study mode, excluding the mode selectors and win button
        if (currentMode === 'STUDY1' && this.text != 'LEARNING MODE' && this.text && this.text != 'STUDY MODE' && this.text != 'WELL DONE!'){
            context.drawImage(this.image, this.studyX, this.studyY, this.width, this.height);
            context.font = '15px Verdana';
            context.fillStyle = "black";
            context.textAlign = 'center';
            context.fillText(this.text, this.studyX + (this.width/2), this.studyY+(this.height/1.75));
        }
        //draw the mode selectors in study mode
        if (currentMode === 'STUDY1' && (this.text === 'LEARNING MODE' || this.text === 'STUDY MODE')){
            context.drawImage(this.image, this.x, this.y, this.width, this.height);
            context.font = 'bold 14px Verdana';
            context.fillStyle = "black";
            context.textAlign = 'center';
            context.fillText(this.text, this.x + (this.width/2), this.y+(this.height/1.75));
        }
        //draw the win button in study mode
        if ((currentMode === 'STUDY1' || currentMode === 'STUDY2') && this.text === 'WELL DONE!'){
            context.drawImage(this.image, this.x, this.y, this.width, this.height);
            context.font = 'bold 16px Verdana';
            context.fillStyle = "black";
            context.textAlign = 'center';
            context.fillText(this.text, this.x + (this.width/2), this.y+(this.height*0.33));
            if (this.text === 'WELL DONE!') {
                context.font = '12px Verdana';
                context.fillStyle = "black";
                context.textAlign = 'center';
                context.fillText('Click to restart', this.x + (this.width/2), this.y+(this.height/1.75) + 20);
            }
        }  
    }
}
//non removable buttons
var buttonArray = [];
const learningButton = new Button(0, 0, 150, 40, 'LEARNING MODE');
const studyButton = new Button(150, 0, 150, 40, 'STUDY MODE');
const winButton = new Button(70, 205, 150, 120, 'WELL DONE!');
//declare button objects and push to the main button array
const scaphoidButton = new Button(10, 105, 150, 40, 'SCAPHOID', 'Scaphoid');
const lunateButton = new Button(10, 155, 150, 40, 'LUNATE', 'Lunate');
const ulnarStyloidButton = new Button(10, 155, 150, 40, 'ULNAR STYLOID', 'Ulnar Styloid');
const pisiformButton = new Button(10, 255, 150, 40, 'PISIFORM', 'Pisiform');
const hamateButton = new Button(10, 305, 150, 40, 'HAMATE', 'Hamate');
const capitateButton = new Button(10, 355, 150, 40, 'CAPITATE', 'Capitate');
const PQFatPadButton = new Button(10, 155, 150, 40, 'PQ FAT PAD', 'Pronator Quadratus Fat Pad');
const trapeziumButton = new Button(10, 455, 150, 40, 'TRAPEZIUM', 'Trapezium');
const hookOfHamateButton = new Button(10, 155, 150, 40, 'HOOK OF HAMATE', 'Hook of Hamate');
const dorsalSTButton = new Button(10, 155, 150, 40, 'DORSAL ST', 'Dorsal ST');
const volarSTButton = new Button(10, 155, 150, 40, 'VOLAR ST', 'Volar ST');

function resetButtonArray(){
    buttonArray = [];
    buttonArray.push(scaphoidButton, lunateButton, pisiformButton, hamateButton, capitateButton, ulnarStyloidButton, trapeziumButton, PQFatPadButton, hookOfHamateButton, dorsalSTButton, volarSTButton);
    for (let i = 0; i < buttonArray.length; i++){
        buttonArray[i].y = (105 + (45*i));
    }
}
resetButtonArray();
//initial shuffle for study mode

class FloatingMessage{
    constructor(x, y, width, height, destX, destY, text, image){
        this.x = x;
        this.y = y;
        this.destX = destX;
        this.destY = destY;
        this.width = width;
        this.height = height
        this.text = text;
        this.image = image; //placeholder
        this.arrived = false;
    }
    draw(context){
        context.drawImage(this.image, this.x, this.y, this.width, this.height);
        context.font = 'bold 16px Verdana';
        /* if (this.text === 'NO!') {
            context.fillStyle = "red";
        }
        else  */context.fillStyle = "black";
        context.textAlign = 'center';
        context.fillText(this.text, this.x + (this.width/2), this.y + (this.height * 0.72) );
    }
    update(){
        if (this.x != this.destX){
            this.x += (this.destX - this.x) * 0.1;;
        }
        if (this.y != this.destY){
            this.y += (this.destY - this.y )* 0.1;
        }
        if ((this.destX - this.x > -1 && this.destX - this.x < 1) && (this.destY - this.y > -1 && this.destY - this.y < 1)){
            this.arrived = true;
        }
    }
}
var floatingMessageArray = [];

//game board
drawBackground = function(id){
    //draw the game image
    let backgroundImage = document.getElementById(id);
    ctx1.drawImage(backgroundImage, controlBarSize, 0, canvas1.width - controlBarSize, canvas1.height);
    //draw the sidebar
    ctx1.fillStyle = 'blue';
    ctx1.fillRect(0, 0, controlsBar.width, controlsBar.height);   
}

//functions and utilities
window.addEventListener('resize', function(){
    canvasPosition1 = canvas1.getBoundingClientRect();
    //canvasPosition2 = canvas2.getBoundingClientRect();
})

function collision (first, second){
    if (    !(  first.x > second.x + second.width ||
                first.x + first.width < second.x ||
                first.y > second.y + second.height ||
                first.y + first.height < second.y)
                //if any of these statements is true there can't be a collision
    ) {
        return true;
    }    
}

function checker(){        
    //add a statement for each colour used and return a string to describe the landmark
    //string returned must match checker cases to draw the outlines; use .name property
    if (mouse1.positionX > 0) {
        /*ctx1.fillText('R: ' + maskData.data[mouse1.positionRed], 300, 150);
        ctx1.fillText('G: ' + maskData.data[mouse1.positionGreen], 300, 200);
        ctx1.fillText('B: ' + maskData.data[mouse1.positionBlue], 300, 250); */
        if (maskData.data[mouse1.positionRed] === 255 && maskData.data[mouse1.positionGreen] === 0 && maskData.data[mouse1.positionBlue] === 0) return 'Ulnar Styloid';
        else if (maskData.data[mouse1.positionRed] === 125 && maskData.data[mouse1.positionGreen] === 0 && maskData.data[mouse1.positionBlue] === 0) return 'Trapezium';
        else if (maskData.data[mouse1.positionRed] === 0 && maskData.data[mouse1.positionGreen] === 255 && maskData.data[mouse1.positionBlue] === 0) return 'Lunate';
        else if (maskData.data[mouse1.positionRed] === 0 && maskData.data[mouse1.positionGreen] === 125 && maskData.data[mouse1.positionBlue] === 0) return 'Hamate';
        else if (maskData.data[mouse1.positionRed] === 0 && maskData.data[mouse1.positionGreen] === 0 && maskData.data[mouse1.positionBlue] === 255) return 'Capitate';
        else if (maskData.data[mouse1.positionRed] === 0 && maskData.data[mouse1.positionGreen] === 0 && maskData.data[mouse1.positionBlue] === 125) return 'Pronator Quadratus Fat Pad';      
        else if (maskData.data[mouse1.positionRed] === 255 && maskData.data[mouse1.positionGreen] === 255 && maskData.data[mouse1.positionBlue] === 0) return 'Scaphoid';      
        else if (maskData.data[mouse1.positionRed] === 255 && maskData.data[mouse1.positionGreen] === 0 && maskData.data[mouse1.positionBlue] === 255) return 'Pisiform';      
        else if (maskData.data[mouse1.positionRed] === 125 && maskData.data[mouse1.positionGreen] === 125 && maskData.data[mouse1.positionBlue] === 0) return 'Hook of Hamate';      
        else if (maskData.data[mouse1.positionRed] === 125 && maskData.data[mouse1.positionGreen] === 0 && maskData.data[mouse1.positionBlue] === 125) return 'Dorsal ST';      
        else if (maskData.data[mouse1.positionRed] === 0 && maskData.data[mouse1.positionGreen] === 125 && maskData.data[mouse1.positionBlue] === 125) return 'Volar ST';
      
        else if (maskData.data[mouse1.positionRed] === 75 && maskData.data[mouse1.positionGreen] === 0 && maskData.data[mouse1.positionBlue] === 0) return 'Radius';
        else if (maskData.data[mouse1.positionRed] === 0 && maskData.data[mouse1.positionGreen] === 0 && maskData.data[mouse1.positionBlue] === 75) return 'Ulna';
        else return 'Keep looking...';
    }
}

UI = function (){
    //UI generated text styling
    ctx1.fillStyle = 'white';
    ctx1.font = '20px Verdana';
    ctx1.textAlign = 'center';
    //ctx1.fillText(' baseIndex: ' + mouse1.position,50, 100);
    ctx1.fillText('Current mode: ' + currentMode, 150, 62);
    
    learningButton.draw(ctx1);
    studyButton.draw(ctx1);

    //display highlight images
    if (currentMode === 'LEARNING' || currentMode === 'STUDY1'){
        switch(checker()){
            case 'Scaphoid':
                scaphoidOutline.draw();
                break;
            case 'Lunate':
                lunateOutline.draw();
                break;
            case 'Ulnar Styloid':
                ulnarStyloidOutline.draw();
                break;
            case 'Pisiform':
                pisiformOutline.draw();
                break;
            case 'Hamate':
                hamateOutline.draw();
                break;
            case 'Capitate':
                capitateOutline.draw();
                break;
            case 'Pronator Quadratus Fat Pad':
                pronatorQuadratusOutline.draw();
                break;
            case 'Trapezium':
                trapeziumOutline.draw();
                break;
            case 'Radius':
                radiusOutline.draw();
                break;
            case 'Ulna':
                ulnaOutline.draw();
                break;
            case 'Hook of Hamate':
                hookOfHamateOutline.draw();
                break;        
            case 'Dorsal ST':
                dorsalSTOutline.draw();
                break;
            case 'Volar ST':
                volarSTOutline.draw();
                break;
        }
    
    }
    if (floatingMessageArray.length > 0){
        for (let i = 0; i < floatingMessageArray.length; i++){
            floatingMessageArray[i].draw(ctx1);
            floatingMessageArray[i].update(ctx1);
            if (floatingMessageArray[i].arrived){
                floatingMessageArray.splice(i, 1);
            }
        };
    };    

    //display bone name on sidebar when in learning mode
    if (currentMode === 'LEARNING'){
        ctx1.fillStyle = 'white';
        ctx1.font = '20px Verdana';
        ctx1.textAlign = 'center';
        if (checker()) ctx1.fillText(checker(),150, 90);
    }
    //display score in study mode 1
    if (currentMode === 'STUDY1'){
        ctx1.fillStyle = 'white';
        ctx1.font = '20px Verdana';
        ctx1.textAlign = 'center';
        ctx1.fillText('Progress:  ' + (shuffledButtonArrayLength - shuffledButtonArray.length) + '/' + shuffledButtonArrayLength, 150, 90);
    }

    //display score in study mode 2
    if (currentMode === 'STUDY2'){
        ctx1.fillStyle = 'white';
        ctx1.font = '20px Verdana';
        ctx1.textAlign = 'center';
        ctx1.fillText('Progress:  ' + (shuffledOutlineArrayLength - shuffledOutlineArray.length) + '/' + shuffledOutlineArrayLength, 150, 90);
    }
}

//mode selector button logic and initialisation of study mode
function modeSelect() {
    if (currentMode === undefined) currentMode = 'LEARNING';
    if (collision(learningButton, mouse1) && mouse1.click) {
        resetButtonArray();
        shuffledButtonY = false;
        currentMode = 'LEARNING';
        document.getElementById('canvas1').style.borderColor = 'goldenrod';
    }
    if (collision(studyButton, mouse1) && mouse1.click && !mouse1.touchMoving) {
        currentMode = 'STUDY1';
        document.getElementById('canvas1').style.borderColor = 'red';
    }
    if (currentMode === 'STUDY1' || currentMode === 'STUDY2') studyMode();
}

function studyMode() {
    shuffleArrays();
    //mode1 (button prompt)
    if (currentMode === 'STUDY1'){
        //main logic
        if (shuffledButtonArray.length > 0) {
            shuffledButtonArray[0].draw(ctx1);
            if (checker() === shuffledButtonArray[0].name && mouse1.click) {
                shuffledButtonArray.splice(0, 1);
                floatingMessageArray.push (new FloatingMessage(300, 600, 120, 30, 300, 250, 'CORRECT!', document.getElementById('buttonimage')));
            } else if (checker() != shuffledButtonArray[0].name && mouse1.click && mouse1.x > 300 && floatingMessageArray.length < 1) {
                floatingMessageArray.push (new FloatingMessage(300, 600, 80, 80, 300, 250, 'NO!', document.getElementById('sadface')));
            }
        }
        //set win state
        if (shuffledButtonArray.length === 0 && !studyModeWon) {
            studyModeWon = true;
        }
        //restart button
        if (studyModeWon){
            winButton.draw(ctx1);
            if (collision(winButton, mouse1) && mouse1.click){
                studyModeWon = false;
                shuffleArrays();
                currentMode = 'STUDY2';
            }
        }
    }
    
    //mode 2 same but with outlines
    function study2Checker(){
        if (mouse1.click){
            for (let i = 0; i < buttonArray.length; i++){
                if (collision(mouse1, buttonArray[i])) return(buttonArray[i].name);
            }
        }
    }    
    if (currentMode === 'STUDY2'){
        //main logic
        if (shuffledOutlineArray.length > 0) {
            shuffledOutlineArray[0].draw(ctx1);
        }
        
        if (!studyModeWon && study2Checker() === shuffledOutlineArray[0].name){
            shuffledOutlineArray.splice(0,1);
            floatingMessageArray.push (new FloatingMessage(300, 600, 120, 30, 300, 250, 'CORRECT!', document.getElementById('buttonimage')));
            //set win state
            if (shuffledOutlineArray.length === 0 && !studyModeWon) {
                studyModeWon = true;
            }
        } else if (!studyModeWon && study2Checker() != shuffledOutlineArray[0].name && mouse1.click && mouse1.x < 300 && floatingMessageArray.length < 1){
            floatingMessageArray.push (new FloatingMessage(300, 600, 80, 80, 300, 250, 'NO!', document.getElementById('sadface')));
        }
        
        if (studyModeWon){
            winButton.draw(ctx1);
            if (collision(winButton, mouse1) && mouse1.click){
                studyModeWon = false;
                shuffledButtonY = false;
                shuffleArrays();
                currentMode = 'STUDY1';
            }
        }        
    }
}

function shuffleArrays(){

    for (let i = buttonArray.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let tempBut = buttonArray[i];
        buttonArray[i] = buttonArray[j];
        buttonArray[j] = tempBut;
    }

    if (!shuffledButtonY){
        for (let i = buttonArray.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = buttonArray[i].y;
            buttonArray[i].y = buttonArray[j].y;
            buttonArray[j].y = temp;
        }
        shuffledButtonY = true;
    }
    

    if (shuffledButtonArray.length === 0) {
        //ducplicate the button array
        shuffledButtonArray = [...buttonArray];
        //remove unusable learning mode specific buttons
        /*let index = shuffledButtonArray.indexOf(metacarpalsButton);
        shuffledButtonArray.splice(index, 1);*/
        //for the scoring UI element
        shuffledButtonArrayLength = shuffledButtonArray.length;
        //shuffle the array
        for (let i = shuffledButtonArray.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = shuffledButtonArray[i];
            shuffledButtonArray[i] = shuffledButtonArray[j];
            shuffledButtonArray[j] = temp;
        }
    }

    if (shuffledOutlineArray.length === 0 && !studyModeWon) {
        shuffledOutlineArray = [...outlineArray];
        //splice 8-15
        shuffledOutlineArray.splice(11, 2);
        shuffledOutlineArrayLength = shuffledOutlineArray.length;
        for (let i = shuffledOutlineArray.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = shuffledOutlineArray[i];
            shuffledOutlineArray[i] = shuffledOutlineArray[j];
            shuffledOutlineArray[j] = temp;
        }
    }
}

function buttonHandler(mouse1) {
    //draw buttons in learning mode
    if (currentMode === 'LEARNING' || (currentMode === 'STUDY2' && !studyModeWon)){
        for (let i = 0; i < buttonArray.length; i++){
            buttonArray[i].draw(ctx1);
        }
    }

    //hover over buttons in learning mode to highlight bone
    if (mouse1.x && currentMode === 'LEARNING' && collision(scaphoidButton, mouse1)) scaphoidOutline.draw();
    else if (mouse1.x && currentMode === 'LEARNING' && collision(lunateButton, mouse1)) lunateOutline.draw();
    else if (mouse1.x && currentMode === 'LEARNING' && collision(ulnarStyloidButton, mouse1)) ulnarStyloidOutline.draw();
    else if (mouse1.x && currentMode === 'LEARNING' && collision(pisiformButton, mouse1)) pisiformOutline.draw();
    else if (mouse1.x && currentMode === 'LEARNING' && collision(hamateButton, mouse1)) hamateOutline.draw();
    else if (mouse1.x && currentMode === 'LEARNING' && collision(capitateButton, mouse1)) capitateOutline.draw();
    else if (mouse1.x && currentMode === 'LEARNING' && collision(PQFatPadButton, mouse1)) pronatorQuadratusOutline.draw();
    else if (mouse1.x && currentMode === 'LEARNING' && collision(trapeziumButton, mouse1)) trapeziumOutline.draw();
    else if (mouse1.x && currentMode === 'LEARNING' && collision(hookOfHamateButton, mouse1)) hookOfHamateOutline.draw();
    else if (mouse1.x && currentMode === 'LEARNING' && collision(dorsalSTButton, mouse1)) dorsalSTOutline.draw();
    else if (mouse1.x && currentMode === 'LEARNING' && collision(volarSTButton, mouse1)) volarSTOutline.draw();

    //draw study mode change button
    if (currentMode === 'STUDY1' || currentMode === 'STUDY2') {
        studyModeButton.style.display = 'initial';
    } else if (currentMode === 'LEARNING') studyModeButton.style.display = 'none';
}

//animation loop
let fps, fpsInterval, startTime, now, then, elapsed; //declare empty variables
function startAnimating(fps){ //function needed to kick off the animation by getting system time and tying fps to system time.
  fpsInterval = 1000/fps; //how much time passes before the next frame is served
  then = Date.now(); //Date.now is no. of ms elapsed since 1.1.1970
  startTime = then;
  animate();
}

function animate(){
    requestAnimationFrame(animate);
    now = Date.now();
    elapsed = now - then;
    if (elapsed > fpsInterval) { //check to see if it's time to draw the next frame
        then = now - (elapsed % fpsInterval);

        ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
        drawBackground('latwrist');
        modeSelect();
        UI();
        buttonHandler(mouse1);
    }
}
startAnimating(60);

//colours used
////ulnar styloid 255, 0, 0
////lunate 0, 255, 0
////capitate 0, 0, 255
////scaphoid 255, 255, 0
////pisiform 255, 0, 255
////trapezium 125, 0, 0
////hamate 0, 125, 0
////PQFP 0, 0, 125
////hook 125, 125, 0
////dorsal ST 125, 0, 125
////volar ST 125, 125, 0
////radius 75, 0, 0
////ulna 0, 0, 75
