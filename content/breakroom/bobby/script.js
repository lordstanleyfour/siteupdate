window.addEventListener('load', function() {
    const canvas = document.getElementById("canvas1");
    const ctx = canvas1.getContext("2d");

    const  canvasWidth = 600; const canvasHeight = 500; let jizzArray = []; let popupArray = []; let hue = 0;
    let progressScore = 0; let targetScore = 2; let winState = false; let level = 0;

    const mouse = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    click: false
    }

    let canvasPosition = canvas.getBoundingClientRect();

    canvas.addEventListener('mousedown', function (event) {
    mouse.click = true;
    mouse.x = event.x - canvasPosition.left;
    mouse.y = event.y - canvasPosition.top;
    });
    canvas.addEventListener('mouseup', function (event) {
    mouse.click = false;
    })

    canvas.onselectstart = function(){
        return false;
        //prevents text selection on double click inside the canvas
    }

////////////////////////////////////////////////////////////////////////////////////////////////////////////

class InputHandler{
    constructor(){
        this.keys = [];
        window.addEventListener('keydown', e => { // arrow function used so that the 'this' is inherited from the parent scope (the constructor) as using a window scoped event listener will make JS forget which 'this' to use
            //console.log(e.key);
            if ((   e.key === 'Enter') 
                && this.keys.indexOf(e.key) === -1){ //in an array, if the index of something is -1 it means it's not in the array
                this.keys.push(e.key);
            }
        });
        window.addEventListener('keyup', e => {
            if (    e.key === 'Enter'){
                this.keys.splice(this.keys.indexOf(e.key), 1);
            }
        });
    }
}


    class YourBurd {
        constructor (){
            this.armX = 240; //240
            this.armY = 500;
            this.armRotation = -55*Math.PI/180; //arm rotates at the olecranon
            this.armMovementSpeed = 1; //seems to work between 1 and 3
            this.armRight = true;
            this.armLeft = false;
            this.tongueRotation = -20;
            this.tongueMovementSpeed = 1; //seems to work between 1 and 3
            this.tongueDown = true;
            this.tongueUp = false;
        }
        drawMain(context){
            //tongue
            context.fillStyle = "darkRed";
            context.strokeStyle = "maroon";
            context.lineWidth = 2;
            context.beginPath();
            context.ellipse(250, 310, 50, 20, this.tongueRotation*Math.PI/180, 0, Math.PI*2);
            context.fill();
            context.stroke();
            //body
            context.fillStyle = "pink";
            context.strokeStyle = "plum";
            context.lineWidth = 1;
            context.beginPath();
            context.ellipse(120, 320, 150, 200, 0, 0, Math.PI*2); 
          /* ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise) */
            context.fill();
            context.stroke();
            //trousers
            context.fillStyle = "blue";
            context.strokeStyle = "darkblue";
            context.lineWidth = 1;
            context.beginPath();
            context.ellipse(120, 320, 150, 200, 0, Math.PI*0.1, Math.PI*0.9);
            context.fill();
            context.stroke();
            context.beginPath();
            context.rotate(0*Math.PI/180)
            //eye
            context.beginPath();
            context.fillStyle = "white";
            context.strokeStyle = "black";
            context.lineWidth = 1;
            context.ellipse(200, 200, 25, 50, 320*Math.PI/180, 0, Math.PI*2);
            context.fill();
            context.stroke();
            //pupil
            context.beginPath();
            context.fillStyle = "black";
            context.lineWidth = 1;
            context.arc(220, 220, 10, 0*Math.PI/180, 270*Math.PI/180);
            context.fill();
            //mouth
            context.beginPath();
            context.fillStyle = "red";
            context.ellipse(236, 300, 75, 40, 0, 293*Math.PI/180, 61.5*Math.PI/180, true);
            context.fill();
            context.strokeStyle = "maroon";
            context.lineWidth = 7;
            context.stroke();
            //main hair
            context.beginPath();
            context.fillStyle = "yellow";
            context.strokeStyle = "gold";
            context.lineWidth = 3;
            context.ellipse(50, 185, 75, 150, 45*Math.PI/180, 0, Math.PI*2);
            context.fill();
            context.stroke();
            context.beginPath;
            context.arc(300, 40, 40, 0, Math.PI*2);
            context.stroke;
            //ringlets
            for (let i = 1; i < 6; i++){
                context.lineWidth = 1;
                context.beginPath();
                context.arc(i*30+10, 90, 20, 0, Math.PI*2);                    
                context.stroke();
            }
            for (let j = 1; j < 6; j++){
                context.beginPath();
                context.arc(j*30-5, 120, 20, 0, Math.PI*2);                    
                context.stroke();
            }
            for (let k = 1; k < 6; k++){
                context.beginPath();
                context.arc(k*30-20, 150, 20, 0, Math.PI*2);                    
                context.stroke();
            }
            for (let l = 1; l < 6; l++){
                context.beginPath();
                context.arc(l*30-35, 180, 20, 0, Math.PI*2);                    
                context.stroke();
            }
            for (let m = 1; m < 6; m++){
                context.beginPath();
                context.arc(m*30-50, 210, 20, 0, Math.PI*2);                    
                context.stroke();
            }
            for (let n = 1; n < 6; n++){
                context.beginPath();
                context.arc(n*30-65, 240, 20, 0, Math.PI*2);                    
                context.stroke();
            }
            for (let o = 1; o < 6; o++){
                context.beginPath();
                context.arc(o*30-80, 270, 20, 0, Math.PI*2);                    
                context.stroke();
            }            
        }
        drawArmMethod(context){
            //wrapped inside function to prevent rotation screwing things up
            function drawArm(armX, armY, rotation){
                context.translate(armX, armY);
                context.beginPath();
                context.rotate(rotation);
                //hand
                context.fillStyle = "pink";
                context.strokeStyle = "plum";
                context.lineWidth = 1;
                context.ellipse(250, 30, 40, 60, 90*Math.PI/180, 0, Math.PI*2);
                context.fill();
                context.stroke();
                //left forearm
                context.beginPath();
                context.fillStyle = "blue";
                context.strokeStyle = "darkblue";
                context.lineWidth = 1;
                context.fillRect(0, 0, 200, 60);
                context.rect(0, 0, 200, 60);
                context.fill();
                context.stroke();
                //left arm
                context.beginPath();
                context.rect(-20, -100, 60, 150);
                context.stroke();
                context.fill();
                ////level decoration
                let stripeMidPointX = 8;
                let stripeApexY = -40;
                function lanceCorporal(){
                    context.strokeStyle = "yellow";
                    context.lineWidth = 10;
                    context.beginPath();
                    context.moveTo(stripeMidPointX-13, stripeApexY-20);
                    context.lineTo(stripeMidPointX, stripeApexY);
                    context.lineTo(stripeMidPointX+15, stripeApexY-20);
                    context.stroke();
                }
                function corporal(){
                    context.strokeStyle = "yellow";
                    context.lineWidth = 10;
                    context.beginPath();
                    context.moveTo(stripeMidPointX-13, stripeApexY);
                    context.lineTo(stripeMidPointX, stripeApexY+20);
                    context.lineTo(stripeMidPointX+15, stripeApexY);
                    context.stroke();
                }
                function sergeant(){
                    context.strokeStyle = "yellow";
                    context.lineWidth = 10;
                    context.beginPath();
                    context.moveTo(stripeMidPointX-13, stripeApexY+20);
                    context.lineTo(stripeMidPointX, stripeApexY+40);
                    context.lineTo(stripeMidPointX+15, stripeApexY+20);
                    context.stroke();
                    context.closePath();
                }
                function staffSergeant(){
                    context.beginPath();
                    context.strokeStyle = "yellow";
                    context.fillStyle = "yellow";
                    context.lineWidth = 1;
                    context.moveTo(stripeMidPointX-13, stripeApexY-45);
                    context.lineTo(stripeMidPointX+15, stripeApexY-45);
                    context.lineTo(stripeMidPointX+1, stripeApexY-20)
                    context.stroke();
                    context.fill();
                    context.closePath();                
                    context.beginPath();
                    context.lineWidth = 1;
                    context.moveTo(stripeMidPointX-13, stripeApexY-27);
                    context.lineTo(stripeMidPointX+15, stripeApexY-27);
                    context.lineTo(stripeMidPointX+1, stripeApexY-52)
                    context.stroke();
                    context.fill();
                    context.closePath();
                }
                if (level === 1 || (level === 0 && winState)){
                    lanceCorporal();
                }
                if (level === 2 || (level === 1 && winState)){
                    lanceCorporal();
                    corporal();
                }
                if (level === 3 || (level === 2 && winState)) {
                    lanceCorporal();
                    corporal();
                    sergeant();
                }
                if (level === 3 && winState){
                    lanceCorporal();
                    corporal();
                    sergeant();
                    staffSergeant();
                }
                //left elbow
                context.fillStyle = "blue";
                context.beginPath();
                context.fillRect(30, 0, 25, 58);
                context.fill();
                //reset canvas
                context.setTransform(1, 0, 0, 1, 0, 0);
            }
            drawArm(this.armX, this.armY, this.armRotation);
        }
        update(){
            //arm movement speed modifier
            if (progressScore === 0) this.armMovementSpeed = 0;
            if (progressScore > 0 && progressScore <= 0.33) this.armMovementSpeed = 1;
            if (progressScore > 0.33 && progressScore <= 0.66) this.armMovementSpeed = 2;
            if (progressScore > 0.66) this.armMovementSpeed = 3;

            //moving the arm back and forth;
            if (this.armRight) this.armX += (this.armMovementSpeed * 1.8);
            else if (this.armLeft) this.armX -= (this.armMovementSpeed * 1);

            if (this.armX >= 300) {
                this.armRight = false;
                this.armLeft = true;
            }
            else if (this.armX <= 220){
                this.armRight = true;
                this.armLeft = false;
            }
            //tongue movement
            if (this.tongueDown){
                this.tongueRotation += this.tongueMovementSpeed;
                if (this.tongueRotation > 20){
                    this.tongueDown = false;
                    this.tongueUp = true;
                }
            } else if (this.tongueUp) {
                this.tongueRotation -= this.tongueMovementSpeed;
                if (this.tongueRotation < -20){
                    this.tongueUp = false;
                    this.tongueDown = true;
                }
            }
        }
    }

    class TheBoaby {
        constructor(){
            this.x = 310;
            this.veinWidth = 2;
            this.throbWidth = 4;
            this.throbInterval = 700;
            this.throbTimer = 0;
        }
        draw(context){
            //top head
            context.beginPath();
            context.fillStyle = "brown";
            context.strokeStyle = "saddlebrown"
            context.lineWidth = this.throbWidth;
            context.ellipse(this.x+20, 285, 35, 25, 0, 0, Math.PI*2);
            context.fill();
            context.stroke();
            //bottom head
            context.beginPath();
            context.ellipse(this.x+20, 315, 35, 25, 0, 0, Math.PI*2);
            context.fill();
            context.stroke();
            //shaft
            context.beginPath();
            context.fillRect(this.x, 272, 300, 58);
            context.fill();
            //shaft outlines
            context.beginPath();
            context.moveTo(this.x+46, 270);
            context.lineTo(this.x+300, 270);
            context.stroke();
            context.beginPath();
            context.moveTo(this.x+46, 332);
            context.lineTo(this.x+300, 332);
            context.stroke();
            //foreskin
            context.beginPath();
            context.lineWidth = 4;
            context.arc(300, 299, 60, -17*Math.PI/180, 17*Math.PI/180);
            context.arc(307, 302, 60, -19*Math.PI/180, 19*Math.PI/180);
            context.stroke();
            //scrotum
            context.beginPath();
            context.ellipse(600, 374, 30, 45, -35, 0, Math.PI*2);
            context.stroke();
            context.fill();
            //wrinkles
            context.beginPath();
            context.lineWidth = 1
            for (let i = 0; i < 8; i++){
            context.arc(595, 280 + (i*7), 70, 65*Math.PI/180, 105*Math.PI/180);
            context.stroke();
            }
            //big vein
            context.beginPath();
            context.strokeStyle = "darkblue";
            context.lineWidth = 7;
            context.moveTo(this.x+310, 322);
            context.lineTo(this.x+270, 312);
            context.lineTo(this.x+250, 300);
            context.lineTo(this.x+200, 298);
            context.lineTo(this.x+100, 305);
            context.lineTo(this.x+60, 330);
            context.stroke();
            //vein branches
            context.lineWidth = 4;
            context.beginPath();
            context.moveTo(this.x+250, 300);
            context.lineTo(this.x+245,325);
            context.lineTo(this.x+225,332);
            context.stroke();
            context.beginPath();
            context.moveTo(this.x+180, 300);
            context.lineTo(this.x+165,285);
            context.lineTo(this.x+145,280);
            context.stroke();
            context.moveTo(this.x+120, 305);
            context.lineTo(this.x+100, 280);
            context.stroke();
            context.moveTo(this.x+120, 305);
            context.lineTo(this.x+100, 320);
            context.lineTo(this.x+130, 328);
            context.stroke();            
        }
        update(deltaTime){
            if (!winState) this.throbWidth = 4;
            if (winState) this.throbTimer += deltaTime;            

            if (this.throbWidth === 7 && this.throbTimer > this.throbInterval){
                this.throbWidth = 4;
                this.throbTimer = 0;
                this.throbInterval = 800;
            } else if (this.throbWidth === 4 && this.throbTimer > this.throbInterval) {
                this.throbWidth = 7;
                this.throbTimer = 0;
                this.throbInterval = 75;
            }
        }
    }

    class Jizz {
        constructor(jizzX, jizzY){
            this.x = jizzX; //where it lands on the face
            this.y = jizzY;
            this.currentX = 290; //where to draw
            this.currentY = 300;
            this.endY = this.y + 100; //end point for drips
            this.radius = 10;
            this.timeAlive = 0;
            this.lifeSpan = 20000;
            this.landed = false;
            this.markedForDeletion = false;

            //for handling the drip trails
            this.initialised = false; //switch for pushing the required "false" propertied indices to the dripCount array
            this.radiusInt = 10; //goes from 9 to 3.  For determining the point of radius decay at which to take data to draw a drip circle
            this.dripFragmentArray = []; //stores data for drawing at the frame of radiusInt change
            this.dripCountArray = []; // triggers for testing whether to store above data that frame 
        }
        draw(context) {
            //the initial shot
            if (!this.landed){
                context.beginPath();
                context.fillStyle = "lightgoldenrodyellow";
                context.arc(this.currentX, this.currentY, this.radius, 0, Math.PI*2);
                context.fill();
            }
            //the moving drip
            if (this.landed) {
                context.beginPath();
                context.fillStyle = "lightgoldenrodyellow";
                context.arc(this.currentX, this.currentY, this.radius, 0, Math.PI*2);
                context.fill();
            }
            //draw static drip fragments
            for (let i = 0; i < 7; i++){
                if (this.dripCountArray[i]){
                    context.beginPath();
                    context.fillStyle = "lightgoldenrodyellow";
                    context.arc(this.dripFragmentArray[i].x, this.dripFragmentArray[i].y, this.dripFragmentArray[i].rad, this.dripFragmentArray[i].start, this.dripFragmentArray[i].end)
                    context.fill();
                }
            }
        }
        initialise(){
            if (!this.initialised){
                for (let i = 0; i < 7; i++){
                    this.dripCountArray.push(false);
                }
                this.initialised = true;
            }
        }
        update(deltaTime){
            //remove after time elapsed
            this.timeAlive += deltaTime;
            if (this.timeAlive > this.lifeSpan) this.markedForDeletion = true;

            //moving to target
            const dx = this.currentX - this.x;
            const dy = this.currentY - this.y;
            if (!this.landed){
                if (this.currentX != this.x) this.currentX -= dx/10;
                if (this.currentY != this.y) this.currentY -= dy/10;
                if (dx < 1 && dy < 1) this.landed = true;
            }            

            //drip travel
            if (this.landed === true) {
                if (this.landed && this.currentY < this.endY) {
                    this.currentY += 0.25;
                    this.radius -= 0.015;
                }
                //for getting positional snapshots for static drip fragments
                this.radiusInt = Math.floor(this.radius);
                
                if (this.radiusInt === 9 && !this.dripCountArray[0]) {
                    this.dripCountArray[0] = true;
                    this.dripFragmentArray.push({x: this.currentX, y: this.currentY, rad: this.radiusInt, start: 0, end: Math.PI*2});
                }
                if (this.radiusInt === 8 && !this.dripCountArray[1]) {
                    this.dripCountArray[1] = true;
                    this.dripFragmentArray.push({x: this.currentX, y: this.currentY, rad: this.radiusInt, start: 0, end: Math.PI*2});
                }
                if (this.radiusInt === 7 && !this.dripCountArray[2]) {
                    this.dripCountArray[2] = true;
                    this.dripFragmentArray.push({x: this.currentX, y: this.currentY, rad: this.radiusInt, start: 0, end: Math.PI*2});
                }
                if (this.radiusInt === 6 && !this.dripCountArray[3]) {
                    this.dripCountArray[3] = true;
                    this.dripFragmentArray.push({x: this.currentX, y: this.currentY, rad: this.radiusInt, start: 0, end: Math.PI*2});
                }
                if (this.radiusInt === 5 && !this.dripCountArray[4]) {
                    this.dripCountArray[4] = true;
                    this.dripFragmentArray.push({x: this.currentX, y: this.currentY, rad: this.radiusInt, start: 0, end: Math.PI*2});
                }
                if (this.radiusInt === 4 && !this.dripCountArray[5]) {
                    this.dripCountArray[5] = true;
                    this.dripFragmentArray.push({x: this.currentX, y: this.currentY, rad: this.radiusInt, start: 0, end: Math.PI*2});
                }
                if (this.radiusInt === 3 && !this.dripCountArray[6]) {
                    this.dripCountArray[6] = true;
                    this.dripFragmentArray.push({x: this.currentX, y: this.currentY, rad: this.radiusInt, start: 0, end: Math.PI*2});
                }
            }
        }
    }

    class PopupTarget {
        constructor(randomPopupXPos, randomPopupYPos) {
            this.targetX = 0;
            this.targetY = 0;
            this.w = 10;
            this.h = 10;
            this.clickedOn = false;
            this.clickBuffer = 3;
            this.moving = false; //should this be moving, depends on current level
            this.arrived = true; //arrived at new coordinates
            this.moveSpeed = 0;
            this.currentX = randomPopupXPos;
            this.currentY = randomPopupYPos;
            this.dx = "hello";
            this.dy = this.currentY - this.y;
        }
        draw(context, hue){
        //placeholder?
        context.fillStyle = 'hsl(' + hue + ', 100%, 50%)';
        context.strokeStyle = "green";
        context.lineWidth = 1;
        context.beginPath();
        context.fillRect(this.currentX, this.currentY, this.w, this.h);
        context.fill();
        }
        update(mouse, targetScore, level, winState){
            if (mouse.click){
                if (mouse.x - 3 > this.currentX - this.clickBuffer && mouse.x - 3 < this.currentX + this.w + this.clickBuffer && mouse.y - 3 > this.currentY - this.clickBuffer && mouse.y - 3 < this.currentY + this.h + this.clickBuffer) this.clickedOn = true;
            }
            if (this.clickedOn) progressScore += 1/targetScore;

            //determine whether to be moving and how fast
            if (level === 2) this.moveSpeed = 1; //figure out later
            if (level === 3) this.moveSpeed = 1.75; //figure out later

            //movement logic
            //set target
            if (this.arrived && !winState) {
                this.targetX = (Math.random() * (590-265) + 265);
                this.targetY = (Math.random() * (240-60) + 60);
                this.arrived = false;
            }
            //move to target
            if (!this.arrived && !winState){
                this.dx = this.currentX - this.targetX;
                this.dy = this.currentY - this.targetY;

                if (this.dx > 1) this.currentX -= this.moveSpeed;
                if (this.dx < -1) this.currentX += this.moveSpeed;
                if (this.dy > 1 ) this.currentY -= this.moveSpeed;
                if (this.dy < -1) this.currentY += this.moveSpeed;

                //retarget and restart movement once arrived
                if(this.dx < 1 && this.dx > -1 && this.dy < 1 && this.dy > -1) this.arrived = true;
            }
        }
    }

///////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function jizzHandler(deltaTime){
        //push jizz to array
        if (winState){
            if (jizzTimer > jizzInterval && jizzArray.length < 30) {
                jizzArray.push(new Jizz(jizzX, jizzY))
                jizzTimer = 0;
            } else {
                jizzTimer += deltaTime;
            }
        }
        

        //instantiante jizz
        jizzArray.forEach(jizz => {
            jizz.initialise();
            jizz.draw(ctx);
            jizz.update(deltaTime);
        });

        //purge array 
        jizzArray = jizzArray.filter(jizz => !jizz.markedForDeletion);
    }

    function popupHandler(){
        //initialise
        if (popupArray.length === 0) {
            popupArray.push (new PopupTarget(randomPopupXPos, randomPopupYPos));
        }

        //instantiate
        popupArray.forEach(popup => {
            popup.draw(ctx, hue);
            popup.update(mouse, targetScore,  level, winState);
            hue += 5;
        })

        //delete when clicked on
        popupArray = popupArray.filter(popup => !popup.clickedOn);
    }

    function progressHandler (context, deltaTime) {
        //progress decay
        let decay = deltaTime*0.000025;
        if (progressScore > 0 && !winState){
            progressScore -= decay;
        }
        // draw progress bar
        context.fillStyle = 'hsl(' + hue + ', 100%, 50%)';
        context.strokeStyle = "red";
        context.lineWidth = 2;
        context.beginPath();
        if (progressScore < 1) context.fillRect(50, 12, 500*progressScore, 30);
        if (progressScore >= 1) context.fillRect(50, 12, 500, 30);
        if (winState) context.fillRect(50, 12, 500, 30);
        context.fill();
        context.rect(50, 12, 500, 30);
        context.stroke();
        // draw text
        context.beginPath;
        context.fillStyle = "white";
        context.font = "small-caps bolder 16px comic sans MS";
        context.textAlign = "left"
        context.fillText("Progress ------>", 80, 33);
        context.fillText("Target Score: " + targetScore, 400, 33)
    }

    function continueGame(){
        switch(level){
            case 0:
                level = 1;
                progressScore = 0;
                targetScore = 5; // default 5
                winState = false;
                jizzArray = [];
                break;
            case 1:
                level = 2;
                progressScore = 0;
                targetScore = 10; // default 10
                winState = false;
                jizzArray = [];
                break;
            case 2:
                level = 3;
                progressScore = 0;
                targetScore = 15; //default 15
                winState = false;
                jizzArray = [];
                break;
            case 3:
                level = 0;
                progressScore = 0;
                targetScore = 2; // default to 2
                winState = false;
                jizzArray = [];
                break;    
            }
    }

    function winStateHandler(context){
        if (progressScore > 0.98){
            winState = true;
            context.fillStyle = "white";
            context.font = "small-caps bolder 40px comic sans MS";
            context.textAlign = "center"
            if (level < 3) {
                context.fillStyle = "rgba(149, 71, 7, 0.7)";
                context.fillRect(25, 70, 550, 50)
                context.fillStyle = 'white';
                context.fillText("Press ENTER to continue", canvasWidth/2, 110);
            }
            else {
                context.fillStyle = "rgba(149, 71, 7, 0.7)";
                context.fillRect(25, 70, 550, 50)
                context.fillStyle = 'white';
                context.fillText("Press F5 to restart", canvasWidth/2, 110);
            }
        }
        if (winState === true && input.keys.indexOf('Enter') > -1) continueGame();
    }

    let lastTime = 0;
    let jizzTimer = 0;
    let randomJizzInterval = (Math.random() * (750 - 100) + 100); //(max-min) + min
    let jizzInterval = randomJizzInterval;
    let jizzX = (Math.random() * (250-75) + 75);
    let jizzY = (Math.random() * (400-175) + 175);
    let randomPopupXPos = (Math.random() * (590-265) + 265);
    let randomPopupYPos = (Math.random() * (240-60) + 60);

    const input = new InputHandler();
    const burd = new YourBurd(canvasWidth, canvasHeight);
    const boaby = new TheBoaby();

/////////////////////////////////////////////////////////////////////////////////////////////////////////

    function animate(timeStamp){
        //timers
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        //background
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.fillStyle = "rgba(149, 71, 7, 0.38)";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        //popup bounding box
        ctx.strokeStyle = "red";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.rect(265, 60, 335, 190);
        ctx.stroke();

        //instiations
        progressHandler(ctx, deltaTime);
        boaby.draw(ctx);
        boaby.update(deltaTime);
        burd.drawMain(ctx);
        burd.update();
        jizzHandler(deltaTime);
        burd.drawArmMethod(ctx);
        popupHandler();
        winStateHandler(ctx);

        //if (popupArray.length > 0)console.log(popupArray[0]);

        //recalculate random values
        jizzX = (Math.random() * (250-75) + 75);
        jizzY = (Math.random() * (400-175) + 175);
        randomPopupXPos = (Math.random() * (590-265) + 265);
        randomPopupYPos = (Math.random() * (240-60) + 60);    


        
        console.log(mouse);

        requestAnimationFrame(animate);
    }
    animate(0);
});

//todo

//current bugs

/* 7146.16 ISA balance
1786.54 bonus

80000 - 7146.16 - 1786.54 = 71067.30

- 50000 papa

21067.30 viola savings

5708.54 ISA balance

1427.14 bonus

2864.32 steve savings

245000 price 

 */