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
const studyModeButton = document.getElementById('studyMode');

//the masked image @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
let maskData = [];
const mask = new Image();
mask.src = './om10mask.png';

//mouse
const mouse1 = {
    x: undefined,
    y: undefined,
    width: 0.00001,
    height: 0.00001,
    click: false,
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
    mouse1.x = e.x - canvasPosition1.left;
    mouse1.y = e.y - canvasPosition1.top;
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
    mouse1.x = event.x - canvasPosition1.left;
    mouse1.y = event.y - canvasPosition1.top;
});
canvas1.addEventListener('mouseup', function (event) {
    mouse1.click = false;
});

canvas1.addEventListener('touchstart', function (event) {
    mouse1.click = true;
});
canvas1.addEventListener('touchend', function (event) {
    mouse1.click = false;
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
var frontalOutline = new Outline(controlBarSize, 0, 600, 600, 'frontaloutline', 'Frontal Bone');
var frontalSinusesOutline = new Outline(controlBarSize, 0, 600, 600, 'frontalsinusesoutline', 'Frontal Sinuses');
var mandibleOutline = new Outline(controlBarSize, 0, 600, 600, 'mandibleoutline', 'Mandible');
var mastoidsOutline = new Outline(controlBarSize, 0, 600, 600, 'mastoidsoutline', 'Mastoids');
var maxillaOutline = new Outline(controlBarSize, 0, 600, 600, 'maxillaoutline', 'Maxilla');
var maxilliarySinusesOutline = new Outline(controlBarSize, 0, 600, 600, 'maxilliarysinusesoutline', 'Maxilliary Sinuses');
var nasalBonesOutline = new Outline(controlBarSize, 0, 600, 600, 'nasalbonesoutline', 'Nasal Bones');
var nasalSpaceOutline = new Outline(controlBarSize, 0, 600, 600, 'nasalspaceoutline', 'Nasal Space');
var orbitsOutline = new Outline(controlBarSize, 0, 600, 600, 'orbitsoutline', 'Orbits');
var parietalsOutline = new Outline(controlBarSize, 0, 600, 600, 'parietalsoutline', 'Parietals');
var perpindicularPlateOutline = new Outline(controlBarSize, 0, 600, 600, 'perpindicularplateoutline', 'Perpindicular Plate');
var petrousRidgesOutline = new Outline(controlBarSize, 0, 600, 600, 'petrousridgesoutline', 'Petrous Ridges');
var temporalsOutline = new Outline(controlBarSize, 0, 600, 600, 'temporalsoutline', 'Temporal Bones');
var vomerOutline = new Outline(controlBarSize, 0, 600, 600, 'vomeroutline', 'Vomer');
var zygomaOutline = new Outline(controlBarSize, 0, 600, 600, 'zygomaoutline', 'Zygoma');

outlineArray.push(frontalOutline, frontalSinusesOutline, mandibleOutline, mastoidsOutline, maxillaOutline, maxilliarySinusesOutline, nasalBonesOutline, nasalSpaceOutline, orbitsOutline, parietalsOutline, perpindicularPlateOutline, petrousRidgesOutline, temporalsOutline, vomerOutline, zygomaOutline);

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
            if (this.text === 'FRONTAL SINUSES' || this.text === 'PERPINDICULAR PLATE' || this.text === 'MAXILLIARY SINUSES') context.font = '12px Verdana';
            else context.font = '15px Verdana';
            if (this.text === 'LEARNING MODE' || this.text === 'STUDY MODE') context.font = 'bold 14px Verdana';
            context.fillStyle = "black";
            context.textAlign = 'center';
            context.fillText(this.text, this.x + (this.width/2), this.y+(this.height/1.75));
        }
        //draw the buttons and their text in study mode, excluding the mode selectors and win button
        if (currentMode === 'STUDY1' && this.text != 'LEARNING MODE' && this.text && this.text != 'STUDY MODE' && this.text != 'WELL DONE!'){
            context.drawImage(this.image, this.studyX, this.studyY, this.width, this.height);
            if (this.text === 'FRONTAL SINUSES' || this.text === 'PERPINDICULAR PLATE' || this.text === 'MAXILLIARY SINUSES') context.font = '12px Verdana';
            else context.font = '15px Verdana';
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
const frontalButton = new Button(10, 105, 150, 40, 'FRONTAL', 'Frontal Bone');
const frontalSinusesButton = new Button(10, 105, 150, 40, 'FRONTAL SINUSES', 'Frontal Sinuses');
const mandibleButton = new Button(10, 105, 150, 40, 'MANDIBLE', 'Mandible');
const mastoidsButton = new Button(10, 105, 150, 40, 'MASTOIDS', 'Mastoids');
const maxillaButton = new Button(10, 105, 150, 40, 'MAXILLA', 'Maxilla');
const maxilliarySinusesButton = new Button(10, 105, 150, 40, 'MAXILLIARY SINUSES', 'Maxilliary Sinuses');
const nasalBonesButton = new Button(10, 105, 150, 40, 'NASAL BONES', 'Nasal Bones');
const orbitsButton = new Button(10, 105, 150, 40, 'ORBITS', 'Orbits');
const perpindicularPlateButton = new Button(10, 105, 150, 40, 'PERPINDICULAR PLATE', 'Perpindicular Plate');
const petrousRidgesButton = new Button(10, 105, 150, 40, 'PETROUS RIDGES', 'Petrous Ridges');
const vomerButton = new Button(10, 105, 150, 40, 'VOMER', 'Vomer');
const zygomaButton = new Button(10, 105, 150, 40, 'ZYGOMA', 'Zygoma');


function resetButtonArray(){
    console.log('reset fired');
    buttonArray = [];
    buttonArray.push(frontalButton, frontalSinusesButton, mandibleButton, mastoidsButton, maxillaButton, maxilliarySinusesButton, nasalBonesButton, orbitsButton, perpindicularPlateButton, petrousRidgesButton, vomerButton, zygomaButton);
    for (let i = 0; i < buttonArray.length; i++){
        buttonArray[i].y = (105 + (41*i));
    }
}
resetButtonArray();
//initial shuffle for study mode

class FloatingMessage{
    constructor(x, y, width, height, destX, destY, text){
        this.x = x;
        this.y = y;
        this.destX = destX;
        this.destY = destY;
        this.width = width;
        this.height = height
        this.text = text;
        this.image = document.getElementById('buttonimage')//placeholder
        this.arrived = false;
    }
    draw(context){
        context.drawImage(this.image, this.x, this.y, this.width, this.height);
        context.font = 'bold 16px Verdana';
        if (this.text === 'NO!') {
            context.fillStyle = "red";
        }
        else context.fillStyle = "black";
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
        /*ctx1.fillText('R: ' + maskData.data[mouse1.positionRed],50, 150);
        ctx1.fillText('G: ' + maskData.data[mouse1.positionGreen],50, 200);
        ctx1.fillText('B: ' + maskData.data[mouse1.positionBlue],50, 250); */
        if (maskData.data[mouse1.positionRed] === 0 && maskData.data[mouse1.positionGreen] === 0 && maskData.data[mouse1.positionBlue] === 125) return 'Frontal Bone';
        else if (maskData.data[mouse1.positionRed] === 255 && maskData.data[mouse1.positionGreen] === 255 && maskData.data[mouse1.positionBlue] === 0) return 'Frontal Sinuses';
        else if (maskData.data[mouse1.positionRed] === 125 && maskData.data[mouse1.positionGreen] === 125 && maskData.data[mouse1.positionBlue] === 0) return 'Mandible';
        else if (maskData.data[mouse1.positionRed] === 125 && maskData.data[mouse1.positionGreen] === 0 && maskData.data[mouse1.positionBlue] === 125) return 'Mastoids';
        else if (maskData.data[mouse1.positionRed] === 0 && maskData.data[mouse1.positionGreen] === 125 && maskData.data[mouse1.positionBlue] === 0) return 'Maxilla';
        else if (maskData.data[mouse1.positionRed] === 125 && maskData.data[mouse1.positionGreen] === 0 && maskData.data[mouse1.positionBlue] === 0) return 'Maxilliary Sinuses';
        else if (maskData.data[mouse1.positionRed] === 0 && maskData.data[mouse1.positionGreen] === 255 && maskData.data[mouse1.positionBlue] === 255) return 'Nasal Bones';
        else if (maskData.data[mouse1.positionRed] === 200 && maskData.data[mouse1.positionGreen] === 200 && maskData.data[mouse1.positionBlue] === 0) return 'Nasal Space';
        else if (maskData.data[mouse1.positionRed] === 255 && maskData.data[mouse1.positionGreen] === 0 && maskData.data[mouse1.positionBlue] === 0) return 'Orbits';
        else if (maskData.data[mouse1.positionRed] === 200 && maskData.data[mouse1.positionGreen] === 0 && maskData.data[mouse1.positionBlue] === 0) return 'Parietals';
        else if (maskData.data[mouse1.positionRed] === 255 && maskData.data[mouse1.positionGreen] === 0 && maskData.data[mouse1.positionBlue] === 255) return 'Perpindicular Plate';
        else if (maskData.data[mouse1.positionRed] === 0 && maskData.data[mouse1.positionGreen] === 125 && maskData.data[mouse1.positionBlue] === 125) return 'Petrous Ridges';
        else if (maskData.data[mouse1.positionRed] === 0 && maskData.data[mouse1.positionGreen] === 0 && maskData.data[mouse1.positionBlue] === 200) return 'Temporal Bones';
        else if (maskData.data[mouse1.positionRed] === 0 && maskData.data[mouse1.positionGreen] === 0 && maskData.data[mouse1.positionBlue] === 255) return 'Vomer';
        else if (maskData.data[mouse1.positionRed] === 0 && maskData.data[mouse1.positionGreen] === 255 && maskData.data[mouse1.positionBlue] === 0) return 'Zygoma';
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
            case 'Frontal Bone':
                frontalOutline.draw();
                break;
            case 'Frontal Sinuses':
                frontalSinusesOutline.draw();
                break;
            case 'Mandible':
                mandibleOutline.draw();
                break;
            case 'Mastoids':
                mastoidsOutline.draw();
                break;
            case 'Maxilla':
                maxillaOutline.draw();
                break;
            case 'Maxilliary Sinuses':
                maxilliarySinusesOutline.draw();
                break;
            case 'Nasal Bones':
                nasalBonesOutline.draw();
                break;
            case 'Nasal Space':
                nasalSpaceOutline.draw();
                break;
            case 'Orbits':
                orbitsOutline.draw();
                break;
            case 'Parietals':
                parietalsOutline.draw();
                break;
            case 'Perpindicular Plate':
                perpindicularPlateOutline.draw();
                break;        
            case 'Petrous Ridges':
                petrousRidgesOutline.draw();
                break;
            case 'Temporal Bones':
                temporalsOutline.draw();
                break;
            case 'Vomer':
                vomerOutline.draw();
                break;
            case 'Zygoma':
                zygomaOutline.draw();
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
    if (collision(studyButton, mouse1) && mouse1.click) {
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
                floatingMessageArray.push (new FloatingMessage(300, 600, 120, 30, 300, 250, 'CORRECT!'));
            } else if (checker() != shuffledButtonArray[0].name && mouse1.click && mouse1.x > 300 && floatingMessageArray.length < 1) {
                floatingMessageArray.push (new FloatingMessage(300, 600, 120, 30, 300, 250, 'NO!'));
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
            floatingMessageArray.push (new FloatingMessage(300, 600, 120, 30, 300, 250, 'CORRECT!'));
            //set win state
            if (shuffledOutlineArray.length === 0 && !studyModeWon) {
                studyModeWon = true;
            }
        } else if (!studyModeWon && study2Checker() != shuffledOutlineArray[0].name && mouse1.click && mouse1.x < 300 && floatingMessageArray.length < 1){
            floatingMessageArray.push (new FloatingMessage(300, 600, 120, 30, 300, 250, 'NO!'));
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
        shuffledOutlineArray.splice(7, 1);
        shuffledOutlineArray.splice(8, 1);
        shuffledOutlineArray.splice(10, 1);

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
    if (mouse1.x && currentMode === 'LEARNING' && collision(frontalButton, mouse1)) frontalOutline.draw();
    else if (mouse1.x && currentMode === 'LEARNING' && collision(frontalSinusesButton, mouse1)) frontalSinusesOutline.draw();
    else if (mouse1.x && currentMode === 'LEARNING' && collision(mandibleButton, mouse1)) mandibleOutline.draw();
    else if (mouse1.x && currentMode === 'LEARNING' && collision(mastoidsButton, mouse1)) mastoidsOutline.draw();
    else if (mouse1.x && currentMode === 'LEARNING' && collision(maxillaButton, mouse1)) maxillaOutline.draw();
    else if (mouse1.x && currentMode === 'LEARNING' && collision(maxilliarySinusesButton, mouse1)) maxilliarySinusesOutline.draw();
    else if (mouse1.x && currentMode === 'LEARNING' && collision(nasalBonesButton, mouse1)) nasalBonesOutline.draw();
    else if (mouse1.x && currentMode === 'LEARNING' && collision(orbitsButton, mouse1)) orbitsOutline.draw();
    else if (mouse1.x && currentMode === 'LEARNING' && collision(perpindicularPlateButton, mouse1)) perpindicularPlateOutline.draw();
    else if (mouse1.x && currentMode === 'LEARNING' && collision(petrousRidgesButton, mouse1)) petrousRidgesOutline.draw();
    else if (mouse1.x && currentMode === 'LEARNING' && collision(vomerButton, mouse1)) vomerOutline.draw();
    else if (mouse1.x && currentMode === 'LEARNING' && collision(zygomaButton, mouse1)) zygomaOutline.draw();

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
        drawBackground('OM10');
        modeSelect();
        UI();
        buttonHandler(mouse1);
    }
}
startAnimating(60);

