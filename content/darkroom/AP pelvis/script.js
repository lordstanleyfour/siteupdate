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
mask.src = './APpelvismask.png';

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
var acetabulaOutline = new Outline(controlBarSize, 0, 600, 600, 'acetabula', 'Acetabulum');
var ASISOutline = new Outline(controlBarSize, 0, 600, 600, 'ASIS', 'ASIS');
var bowelgasOutline = new Outline(controlBarSize, 0, 600, 600, 'bowelgas', 'Bowel Gas');
var femoraOutline = new Outline(controlBarSize, 0, 600, 600, 'femora', 'Femur');
var greatertrochantersOutline = new Outline(controlBarSize, 0, 600, 600, 'greatertrochanters', 'Greater Trochanter');
var iliaccrestsOutline = new Outline(controlBarSize, 0, 600, 600, 'iliaccrests', 'Iliac Crest');
var iliaOutline = new Outline(controlBarSize, 0, 600, 600, 'ilia', 'Ilium');
var inferiorpubicramiOutline = new Outline(controlBarSize, 0, 600, 600, 'inferiorpubicrami', 'Inferior Pubic Ramus');
var lessertrochantersOutline = new Outline(controlBarSize, 0, 600, 600, 'lessertrochanters', 'Lesser Trochanter');
var obturatorforaminaOutline = new Outline(controlBarSize, 0, 600, 600, 'obturatorforamina', 'Obturator Foramen');
var pelvicteardropsOutline = new Outline(controlBarSize, 0, 600, 600, 'pelvicteardrops', 'Pelvic Teardrop');
var sacroiliacjointsOutline = new Outline(controlBarSize, 0, 600, 600, 'sacroiliacjoints', 'Sacroiliac Joints');
var sacrumOutline = new Outline(controlBarSize, 0, 600, 600, 'sacrum', 'Sacrum');
var superiorpubicramiOutline = new Outline(controlBarSize, 0, 600, 600, 'superiorpubicrami', 'Superior Pubic Ramus');
var symphysispubisOutline = new Outline(controlBarSize, 0, 600, 600, 'symphysispubis', 'Symphysis Pubis');
var vertebralbodiesOutline = new Outline(controlBarSize, 0, 600, 600, 'vertebralbodies', 'Vertebral Bodies');

outlineArray.push(acetabulaOutline, ASISOutline, bowelgasOutline, femoraOutline, greatertrochantersOutline, iliaccrestsOutline, iliaOutline, inferiorpubicramiOutline, lessertrochantersOutline, obturatorforaminaOutline, pelvicteardropsOutline, sacroiliacjointsOutline, sacrumOutline, superiorpubicramiOutline, symphysispubisOutline, vertebralbodiesOutline);

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
            if(this.text === 'GREATER TROCHANTER' || this.text === 'INFERIOR PUBIC RAMUS' || this.text === 'SUPERIOR PUBIC RAMUS' || this.text === 'LESSER TROCHANTER' || this.text === 'SACROILIAC JOINTS') context.font = '11px Verdana';
            else context.font = '15px Verdana';
            if (this.text === 'LEARNING MODE' || this.text === 'STUDY MODE') context.font = 'bold 14px Verdana';
            context.fillStyle = "black";
            context.textAlign = 'center';
            context.fillText(this.text, this.x + (this.width/2), this.y+(this.height/1.75));
        }
        //draw the buttons and their text in study mode, excluding the mode selectors and win button
        if (currentMode === 'STUDY1' && this.text != 'LEARNING MODE' && this.text && this.text != 'STUDY MODE' && this.text != 'WELL DONE!'){
            context.drawImage(this.image, this.studyX, this.studyY, this.width, this.height);
            if(this.text === 'GREATER TROCHANTER' || this.text === 'INFERIOR PUBIC RAMUS' || this.text === 'SUPERIOR PUBIC RAMUS'|| this.text === 'LESSER TROCHANTER' || this.text === 'SACROILIAC JOINTS') context.font = '11px Verdana';
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
const acetabulumButton = new Button(10, 105, 150, 40, 'ACETABULUM', 'Acetabulum');
const ASISButton = new Button(10, 105, 150, 40, 'ASIS', 'ASIS');
const femurButton = new Button(10, 105, 150, 40, 'FEMUR', 'Femur');
const greaterTrochanterButton = new Button(10, 105, 150, 40, 'GREATER TROCHANTER', 'Greater Trochanter');
const iliacCrestButton = new Button(10, 105, 150, 40, 'ILIAC CREST', 'Iliac Crest');
const inferiorPubicRamusButton = new Button(10, 105, 150, 40, 'INFERIOR PUBIC RAMUS', 'Inferior Pubic Ramus');
const lesserTrochanterButton = new Button(10, 105, 150, 40, 'LESSER TROCHANTER', 'Lesser Trochanter');
const pelvicTeardropButton = new Button(10, 105, 150, 40, 'PELVIC TEARDROP', 'Pelvic Teardrop');
const sacroiliacJointsButton = new Button(10, 105, 150, 40, 'SACROILIAC JOINTS', 'Sacroiliac Joints');
const sacrumButton = new Button(10, 105, 150, 40, 'SACRUM', 'Sacrum');
const superiorPubicRamusButton = new Button(10, 105, 150, 40, 'SUPERIOR PUBIC RAMUS', 'Superior Pubic Ramus');
const symphysisPubisButton = new Button(10, 105, 150, 40, 'SYMPHYSIS PUBIS', 'Symphysis Pubis');


function resetButtonArray(){
    console.log('reset fired');
    buttonArray = [];
    buttonArray.push(acetabulumButton, ASISButton, femurButton, greaterTrochanterButton, iliacCrestButton, inferiorPubicRamusButton, lesserTrochanterButton, pelvicTeardropButton, 
                     sacroiliacJointsButton, sacrumButton, superiorPubicRamusButton, symphysisPubisButton);
    for (let i = 0; i < buttonArray.length; i++){
        buttonArray[i].y = (105 + (41*i));
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
        else */ context.fillStyle = "black";
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
        /*ctx1.fillText('R: ' + maskData.data[mouse1.positionRed],300, 300);
        ctx1.fillText('G: ' + maskData.data[mouse1.positionGreen],300, 350);
        ctx1.fillText('B: ' + maskData.data[mouse1.positionBlue],300, 400);*/
        if (maskData.data[mouse1.positionRed] === 255 && maskData.data[mouse1.positionGreen] === 0 && maskData.data[mouse1.positionBlue] === 0) return 'Acetabulum';
        else if (maskData.data[mouse1.positionRed] === 0 && maskData.data[mouse1.positionGreen] === 255 && maskData.data[mouse1.positionBlue] === 0) return 'ASIS';
        else if (maskData.data[mouse1.positionRed] === 0 && maskData.data[mouse1.positionGreen] === 0 && maskData.data[mouse1.positionBlue] === 255) return 'Bowel Gas';
        else if (maskData.data[mouse1.positionRed] === 255 && maskData.data[mouse1.positionGreen] === 255 && maskData.data[mouse1.positionBlue] === 0) return 'Femur';
        else if (maskData.data[mouse1.positionRed] === 255 && maskData.data[mouse1.positionGreen] === 0 && maskData.data[mouse1.positionBlue] === 255) return 'Greater Trochanter';
        else if (maskData.data[mouse1.positionRed] === 0 && maskData.data[mouse1.positionGreen] === 255 && maskData.data[mouse1.positionBlue] === 255) return 'Iliac Crest';
        else if (maskData.data[mouse1.positionRed] === 125 && maskData.data[mouse1.positionGreen] === 0 && maskData.data[mouse1.positionBlue] === 0) return 'Ilium';
        else if (maskData.data[mouse1.positionRed] === 0 && maskData.data[mouse1.positionGreen] === 125 && maskData.data[mouse1.positionBlue] === 0) return 'Inferior Pubic Ramus';
        else if (maskData.data[mouse1.positionRed] === 125 && maskData.data[mouse1.positionGreen] === 125 && maskData.data[mouse1.positionBlue] === 0) return 'Lesser Trochanter';
        else if (maskData.data[mouse1.positionRed] === 125 && maskData.data[mouse1.positionGreen] === 0 && maskData.data[mouse1.positionBlue] === 125) return 'Obturator Foramen';
        else if (maskData.data[mouse1.positionRed] === 0 && maskData.data[mouse1.positionGreen] === 125 && maskData.data[mouse1.positionBlue] === 125) return 'Pelvic Teardrop';
        else if (maskData.data[mouse1.positionRed] === 200 && maskData.data[mouse1.positionGreen] === 0 && maskData.data[mouse1.positionBlue] === 0) return 'Sacroiliac Joints';
        else if (maskData.data[mouse1.positionRed] === 0 && maskData.data[mouse1.positionGreen] === 200 && maskData.data[mouse1.positionBlue] === 0) return 'Sacrum';
        else if (maskData.data[mouse1.positionRed] === 0 && maskData.data[mouse1.positionGreen] === 0 && maskData.data[mouse1.positionBlue] === 200) return 'Superior Pubic Ramus';
        else if (maskData.data[mouse1.positionRed] === 200 && maskData.data[mouse1.positionGreen] === 200 && maskData.data[mouse1.positionBlue] === 0) return 'Symphysis Pubis';
        else if (maskData.data[mouse1.positionRed] === 200 && maskData.data[mouse1.positionGreen] === 0 && maskData.data[mouse1.positionBlue] === 200) return 'Vertebral Bodies';
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
            case 'Acetabulum':
                acetabulaOutline.draw();
                break;
            case 'ASIS':
                ASISOutline.draw();
                break;
            case 'Bowel Gas':
                bowelgasOutline.draw();
                break;
            case 'Femur':
                femoraOutline.draw();
                break;
            case 'Greater Trochanter':
                greatertrochantersOutline.draw();
                break;
            case 'Iliac Crest':
                iliaccrestsOutline.draw();
                break;
            case 'Ilium':
                iliaOutline.draw();
                break;
            case 'Inferior Pubic Ramus':
                inferiorpubicramiOutline.draw();
                break;
            case 'Lesser Trochanter':
                lessertrochantersOutline.draw();
                break;
            case 'Obturator Foramen':
                obturatorforaminaOutline.draw();
                break;
            case 'Pelvic Teardrop':
                pelvicteardropsOutline.draw();
                break;        
            case 'Sacroiliac Joints':
                sacroiliacjointsOutline.draw();
                break;
            case 'Sacrum':
                sacrumOutline.draw();
                break;
            case 'Superior Pubic Ramus':
                superiorpubicramiOutline.draw();
                break;            
            case 'Symphysis Pubis':
                symphysispubisOutline.draw();
                break;            
            case 'Vertebral Bodies':
                vertebralbodiesOutline.draw();
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
        shuffledOutlineArray.splice(2, 1);
        shuffledOutlineArray.splice(5, 1);
        shuffledOutlineArray.splice(7, 1);
        shuffledOutlineArray.splice(12, 1);
        console.log(shuffledOutlineArray);
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
    if (mouse1.x && currentMode === 'LEARNING' && collision(acetabulumButton, mouse1)) acetabulaOutline.draw();
    else if (mouse1.x && currentMode === 'LEARNING' && collision(ASISButton, mouse1)) ASISOutline.draw();
    else if (mouse1.x && currentMode === 'LEARNING' && collision(femurButton, mouse1)) femoraOutline.draw();
    else if (mouse1.x && currentMode === 'LEARNING' && collision(greaterTrochanterButton, mouse1)) greatertrochantersOutline.draw();
    else if (mouse1.x && currentMode === 'LEARNING' && collision(iliacCrestButton, mouse1)) iliaccrestsOutline.draw();
    else if (mouse1.x && currentMode === 'LEARNING' && collision(inferiorPubicRamusButton, mouse1)) inferiorpubicramiOutline.draw();
    else if (mouse1.x && currentMode === 'LEARNING' && collision(lesserTrochanterButton, mouse1)) lessertrochantersOutline.draw();
    else if (mouse1.x && currentMode === 'LEARNING' && collision(pelvicTeardropButton, mouse1)) pelvicteardropsOutline.draw();
    else if (mouse1.x && currentMode === 'LEARNING' && collision(sacroiliacJointsButton, mouse1)) sacroiliacjointsOutline.draw();
    else if (mouse1.x && currentMode === 'LEARNING' && collision(sacrumButton, mouse1)) sacrumOutline.draw();
    else if (mouse1.x && currentMode === 'LEARNING' && collision(superiorPubicRamusButton, mouse1)) superiorpubicramiOutline.draw();
    else if (mouse1.x && currentMode === 'LEARNING' && collision(symphysisPubisButton, mouse1)) symphysispubisOutline.draw();


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
        drawBackground('APpelvis');
        modeSelect();
        UI();
        buttonHandler(mouse1);

    }
}
startAnimating(60);