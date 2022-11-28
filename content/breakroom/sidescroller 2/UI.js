const tada = document.getElementById('tada');

export class UI {
    constructor(game){
        this.game = game;
        this.fontSize = 30;
        this.fontFamily = 'Changa';  
        this.livesImage = document.getElementById('lives');
        this.powerMeterImage = document.getElementById('power_meter');
        this.powerMeterWidth = 1;
        this.selector = Math.floor(Math.random() * (6-1) + 1);
        this.message = null;
    }
    draw(context){
        context.save();
        context.shadowOffsetX = 2;
        context.shadowOffestY = 2;
        context.shadowColor = 'white';
        context.shadowBlur = 0;
        context.font = this.fontSize + 'px ' + this.fontFamily;
        context.textAlign = 'left';
        context.fillStyle = this.game.fontColour;
        // score
        if (!this.game.gameOver) context.fillText('Score: ' + this.game.score, 20, 50);
        // timer
        context.font = this.fontSize * 0.8 + 'px ' + this.fontFamily;
        context.fillText('Time: ' + (this.game.time * 0.001).toFixed(1), 20, 80);

        if (this.game.time < 500){
            context.save();
            context.font = this.fontSize * 5 + 'px ' + this.fontFamily;
            if (this.game.time > -3000 && this.game.time < -2000) context.fillText('3', this.game.width/2-15, 300);
            else if (this.game.time > -2000 && this.game.time < -1000) context.fillText('2', this.game.width/2-115, 300);
            else if (this.game.time > -1000 && this.game.time < 0) context.fillText('1', this.game.width/2-215, 300);
            else if (this.game.time > 0 && this.game.time < 500) context.fillText('GO!-->', this.game.width/2-400, 300);





            context.restore();
        }

        //lives
        for (let i=0; i < this.game.lives; i++){
            context.drawImage(this.livesImage, 25 * i + 20, 95, 25, 25);
        }

        // game over messages
        if (this.game.gameOver){
            context.fillText('Score: ' + this.game.score, 20, 50);
            context.textAlign = 'center';
            context.font = this.fontSize * 2 + 'px ' + this.fontFamily;
            if (this.game.score >= this.game.winningScore){
                context.fillStyle = 'rgba(213, 32, 184, 0.8)';
                context.fillRect(this.game.width * 0.2, this.game.height * 0.4, this.game.width * 0.6, this.game.height * 0.45);
                context.fillStyle = 'black';
                switch (this.selector) {
                    case 1: this.message = "Excellent!";
                    break;
                    case 2: this.message = "Top notch!";
                    break;
                    case 3: this.message = "Marvellous!";
                    break;
                    case 4: this.message = "Jolly good!";
                    break;
                    case 5: this.message = "Hurrah!";
                    break;
                    default: this.message = "win";
                }
                context.fillText(this.game.score + '? ' + this.message, this.game.width * 0.5, this.game.height * 0.495);
                tada.play();
            } else {
                context.fillStyle = 'rgba(213, 32, 184, 0.8)';
                context.fillRect(this.game.width * 0.2, this.game.height * 0.4, this.game.width * 0.6, this.game.height * 0.45);
                context.fillStyle = 'black';
                switch (this.selector) {
                    case 1: this.message = "Upsetting.";
                    break;
                    case 2: this.message = "Dire.";
                    break;
                    case 3: this.message = "Grim.";
                    break;
                    case 4: this.message = "Disappointing.";
                    break;
                    case 5: this.message = "Farcical.";
                    break;
                    default: this.message = "lose";
                }
                context.fillText(this.game.score + '? ' + this.message, this.game.width * 0.5, this.game.height * 0.495);
            }
            let percent = ((this.game.power/2)*100).toFixed(0);

            context.font = this.fontSize + 'px ' + this.fontFamily;
            context.fillText('Enemies defeated: ' + this.game.enemiesDefeated, this.game.width * 0.5, this.game.height * 0.5 + 40);
            context.fillText('Dive kills: ' + this.game.diveKills + '          +' + (this.game.diveKills * 2) + ' points', this.game.width * 0.5, this.game.height * 0.5 + 70);
            context.fillText('Lives remaining: ' + this.game.lives + '          +' + (this.game.addedScoreLives) + ' points', this.game.width * 0.5, this.game.height * 0.5 + 100);
            context.fillText('Power remaining: ' + percent + '          +' + (this.game.addedScorePower) + ' points', this.game.width * 0.5, this.game.height * 0.5 + 130);
            context.fillText('Lives lost: ' + (5 - this.game.lives) + '          ' + (-25 + (this.game.lives * 5)) + ' points', this.game.width * 0.5, this.game.height * 0.5 + 160);


        }
        context.restore();


        //power meter handler
        var powerX = 25;
        var powerY = 130;
        let percent = ((this.game.power/2)*100).toFixed(0);

        this.powerMeterWidth = this.game.power;
        context.drawImage(this.powerMeterImage, 0, 0, 450 * this.powerMeterWidth/2, 50, 25, 130, 250 * this.powerMeterWidth, 25);
        context.font = this.fontSize * 0.5 + 'px ' + this.fontFamily;
        context.fillStyle = 'black';
        context.fillText('Power: ' + percent + '%', powerX + 10, powerY + 18)
        


        if (this.game.power < 0.21){
            let diveX = powerX; let diveY = powerY + 30;
            context.save();
            context.fillStyle = 'red';
            context.fillRect(diveX, diveY, 105, 15);
            context.fillStyle = 'black';
            context.fillText('DIVE DISABLED', diveX + 5, diveY + 12);
            context.restore();
        }
        if (this.game.power < 0.1){
            let rollX = powerX + 125; let rollY = powerY + 30;
            context.save();
            context.fillStyle = 'red';
            context.fillRect(rollX, rollY, 105, 15);
            context.fillStyle = 'black';
            context.fillText('ROLL DISABLED', rollX + 5, rollY + 12);
            context.restore();
        }
    }
}
