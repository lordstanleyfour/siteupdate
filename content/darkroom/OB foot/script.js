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
mask.src = './OBfootmask.png';

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
    maskData = ctx2.getImageData(controlBarSize, 0, mask.naturalWidth, mask.naturalHeight);
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
var talusOutline = new Outline(controlBarSize, 0, 600, 600, 'talus', 'Talus');
var calcaneumOutline = new Outline(controlBarSize, 0, 600, 600, 'calcaneum', 'Calcaneum');
var navicularOutline = new Outline(controlBarSize, 0, 600, 600, 'navicular', 'Navicular');
var cuboidOutline = new Outline(controlBarSize, 0, 600, 600, 'cuboid', 'Cuboid');
var medialCuneiformOutline = new Outline(controlBarSize, 0, 600, 600, 'medialcuneiform', 'Med. Cuneiform');
var intermediateCuneiformOutline = new Outline(controlBarSize, 0, 600, 600, 'intermediatecuneiform', 'Int. Cuneiform');
var lateralCuneiformOutline = new Outline(controlBarSize, 0, 600, 600, 'lateralcuneiform', 'Lat. Cuneiform');
var medialHallucalSesamoidOutline = new Outline(controlBarSize, 0, 600, 600, 'medialhallucalsesamoid', 'Med. Hal. Sesamoid');
var lateralHallucalSesamoidOutline = new Outline(controlBarSize, 0, 600, 600, 'lateralhallucalsesamoid', 'Lat. Hal. Sesamoid');
var firstMTOutline = new Outline(controlBarSize, 0, 600, 600, '1stmt', '1st MT');
var secondMTOutline = new Outline(controlBarSize, 0, 600, 600, '2ndmt', '2nd MT');
var thirdMTOutline = new Outline(controlBarSize, 0, 600, 600, '3rdmt', '3rd MT');
var fourthMTOutline = new Outline(controlBarSize, 0, 600, 600, '4thmt', '4rd MT');
var fifthMTOutline = new Outline(controlBarSize, 0, 600, 600, '5thmt', '5th MT');
var phalangesOutline = new Outline(controlBarSize, 0, 600, 600, 'phalanges', 'Phalanges');

outlineArray.push(talusOutline, calcaneumOutline, navicularOutline, cuboidOutline, medialCuneiformOutline, intermediateCuneiformOutline, lateralCuneiformOutline, medialHallucalSesamoidOutline, lateralHallucalSesamoidOutline, firstMTOutline, secondMTOutline, thirdMTOutline, fourthMTOutline, fifthMTOutline, phalangesOutline);

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
            if (this.text === 'MED HAL. SESAMOID' || this.text === 'LAT HAL. SESAMOID') context.font = '12px Verdana';
            if (this.text === 'LEARNING MODE' || this.text === 'STUDY MODE') context.font = 'bold 14px Verdana';
            context.fillStyle = "black";
            context.textAlign = 'center';
            context.fillText(this.text, this.x + (this.width/2), this.y+(this.height/1.75));
        }
        //draw the buttons and their text in study mode, excluding the mode selectors and win button
        if (currentMode === 'STUDY1' && this.text != 'LEARNING MODE' && this.text && this.text != 'STUDY MODE' && this.text != 'WELL DONE!'){
            context.drawImage(this.image, this.studyX, this.studyY, this.width, this.height);
            context.font = '15px Verdana';
            if (this.text === 'MED HAL. SESAMOID' || this.text === 'LAT HAL. SESAMOID') context.font = '12px Verdana';
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
const talusButton = new Button(10, null, 150, 40, 'TALUS', 'Talus');
const calcaneumButton = new Button(10, null, 150, 40, 'CALCANEUM', 'Calcaneum');
const navicularButton = new Button(10, null, 150, 40, 'NAVICULAR', 'Navicular');
const cuboidButton = new Button(10, null, 150, 40, 'CUBOID', 'Cuboid');
const medialCuneiformButton = new Button(10, null, 150, 40, 'MED. CUNEIFORM', 'Med. Cuneiform');
const intermediateCuneiformButton = new Button(10, null, 150, 40, 'INT. CUNEIFORM', 'Int. Cuneiform');
const lateralCuneiformButton = new Button(10, null, 150, 40, 'LAT. CUNEIFORM', 'Lat. Cuneiform');
const medialHallucalSesamoidButton = new Button(10, null, 150, 40, 'MED HAL. SESAMOID', 'Med. Hal. Sesamoid');
const lateralHallucalSesamoidButton = new Button(10, null, 150, 40, 'LAT HAL. SESAMOID', 'Lat. Hal. Sesamoid');
const metatarsalsButton = new Button(10, null, 150, 40, 'METATARSALS', 'Metatarsals');
const phalangesButton = new Button(10, null, 150, 40, 'PHALANGES', 'Phalanges');

function resetButtonArray(){
    buttonArray = [];
    buttonArray.push(talusButton, calcaneumButton, navicularButton, cuboidButton, medialCuneiformButton, intermediateCuneiformButton, lateralCuneiformButton, medialHallucalSesamoidButton, lateralHallucalSesamoidButton, metatarsalsButton, phalangesButton);
    for (let i = 0; i < buttonArray.length; i++){
        buttonArray[i].y = (105 + (44*i));
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
/*         ctx1.fillText('R: ' + maskData.data[mouse1.positionRed],200, 150);
        ctx1.fillText('G: ' + maskData.data[mouse1.positionGreen],200, 200);
        ctx1.fillText('B: ' + maskData.data[mouse1.positionBlue],200, 250); */
        if (maskData.data[mouse1.positionRed] === 255 && maskData.data[mouse1.positionGreen] === 0 && maskData.data[mouse1.positionBlue] === 0) return 'Talus';
        else if (maskData.data[mouse1.positionRed] === 125 && maskData.data[mouse1.positionGreen] === 0 && maskData.data[mouse1.positionBlue] === 0) return 'Calcaneum';
        else if (maskData.data[mouse1.positionRed] === 0 && maskData.data[mouse1.positionGreen] === 255 && maskData.data[mouse1.positionBlue] === 0) return 'Navicular';
        else if (maskData.data[mouse1.positionRed] === 0 && maskData.data[mouse1.positionGreen] === 125 && maskData.data[mouse1.positionBlue] === 0) return 'Cuboid';
        else if (maskData.data[mouse1.positionRed] === 255 && maskData.data[mouse1.positionGreen] === 255 && maskData.data[mouse1.positionBlue] === 0) return 'Med. Cuneiform';
        else if (maskData.data[mouse1.positionRed] === 0 && maskData.data[mouse1.positionGreen] === 0 && maskData.data[mouse1.positionBlue] === 125) return 'Int. Cuneiform';
        else if (maskData.data[mouse1.positionRed] === 0 && maskData.data[mouse1.positionGreen] === 0 && maskData.data[mouse1.positionBlue] === 255) return 'Lat. Cuneiform';
        else if (maskData.data[mouse1.positionRed] === 255 && maskData.data[mouse1.positionGreen] === 125 && maskData.data[mouse1.positionBlue] === 0) return 'Med. Hal. Sesamoid';
        else if (maskData.data[mouse1.positionRed] === 125 && maskData.data[mouse1.positionGreen] === 125 && maskData.data[mouse1.positionBlue] === 0) return 'Lat. Hal. Sesamoid';
        else if (maskData.data[mouse1.positionRed] === 0 && maskData.data[mouse1.positionGreen] === 255 && maskData.data[mouse1.positionBlue] === 255) return '1st MT';
        else if (maskData.data[mouse1.positionRed] === 0 && maskData.data[mouse1.positionGreen] === 125 && maskData.data[mouse1.positionBlue] === 255) return '2nd MT';
        else if (maskData.data[mouse1.positionRed] === 0 && maskData.data[mouse1.positionGreen] === 125 && maskData.data[mouse1.positionBlue] === 125) return '3rd MT';
        else if (maskData.data[mouse1.positionRed] === 75 && maskData.data[mouse1.positionGreen] === 0 && maskData.data[mouse1.positionBlue] === 0) return '4th MT';
        else if (maskData.data[mouse1.positionRed] === 0 && maskData.data[mouse1.positionGreen] === 75 && maskData.data[mouse1.positionBlue] === 0) return '5th MT';
        else if (maskData.data[mouse1.positionRed] === 0 && maskData.data[mouse1.positionGreen] === 0 && maskData.data[mouse1.positionBlue] === 75) return 'Phalanges';
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
            case 'Talus':
                talusOutline.draw();
                break;
            case 'Calcaneum':
                calcaneumOutline.draw();
                break;
            case 'Navicular':
                navicularOutline.draw();
                break;
            case 'Cuboid':
                cuboidOutline.draw();
                break;
            case 'Med. Cuneiform':
                medialCuneiformOutline.draw();
                break;
            case 'Int. Cuneiform':
                intermediateCuneiformOutline.draw();
                break;
            case 'Lat. Cuneiform':
                lateralCuneiformOutline.draw();
                break;
            case 'Med. Hal. Sesamoid':
                medialHallucalSesamoidOutline.draw();
                break;
            case 'Lat. Hal. Sesamoid':
                lateralHallucalSesamoidOutline.draw();
                break;
            case '1st MT':
                firstMTOutline.draw();
                break;
            case '2nd MT':
                secondMTOutline.draw();
                break;        
            case '3rd MT':
                thirdMTOutline.draw();
                break;
            case '4th MT':
                fourthMTOutline.draw();
                break;
            case '5th MT':
                fifthMTOutline.draw();
                break;
            case 'Phalanges':
                phalangesOutline.draw();
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
        //@@@@@@@@@@@@@@@@@@@@@@@@@@@remove unusable learning mode specific buttons
        let index = shuffledButtonArray.indexOf(metatarsalsButton);
        shuffledButtonArray.splice(index, 1);
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
        shuffledOutlineArray.splice(8, 8);
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
    if (mouse1.x && currentMode === 'LEARNING' && collision(talusButton, mouse1)) talusOutline.draw();
    else if (mouse1.x && currentMode === 'LEARNING' && collision(calcaneumButton, mouse1)) calcaneumOutline.draw();
    else if (mouse1.x && currentMode === 'LEARNING' && collision(navicularButton, mouse1)) navicularOutline.draw();
    else if (mouse1.x && currentMode === 'LEARNING' && collision(cuboidButton, mouse1)) cuboidOutline.draw();
    else if (mouse1.x && currentMode === 'LEARNING' && collision(medialCuneiformButton, mouse1)) medialCuneiformOutline.draw();
    else if (mouse1.x && currentMode === 'LEARNING' && collision(intermediateCuneiformButton, mouse1)) intermediateCuneiformOutline.draw();
    else if (mouse1.x && currentMode === 'LEARNING' && collision(lateralCuneiformButton, mouse1)) lateralCuneiformOutline.draw();
    else if (mouse1.x && currentMode === 'LEARNING' && collision(medialHallucalSesamoidButton, mouse1)) medialHallucalSesamoidOutline.draw();
    else if (mouse1.x && currentMode === 'LEARNING' && collision(lateralHallucalSesamoidButton, mouse1)) lateralHallucalSesamoidOutline.draw();
    else if (mouse1.x && currentMode === 'LEARNING' && collision(metatarsalsButton, mouse1)) {
        firstMTOutline.draw();
        secondMTOutline.draw();
        thirdMTOutline.draw();
        fourthMTOutline.draw();
        fifthMTOutline.draw();
    }
    else if (mouse1.x && currentMode === 'LEARNING' && collision(phalangesButton, mouse1)) phalangesOutline.draw();

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
        drawBackground('OBfoot');
        modeSelect();
        UI();
        buttonHandler(mouse1);

        

    }
}
startAnimating(60);