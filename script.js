const canvas=document.getElementById("gameCanvas");
const ctx=canvas.getContext("2d");
const playerImage=new Image();
playerImage.src="Player1.png";
let button={
    x:canvas.width/2-90,
    y:canvas.height/2-125+160,
    width:180,
    height:50
};
const player={
    x:450,
    y:300,
    width:40,
    height:40,
    speed:5
};
let keys={};
let enemies=[];
let coinsCollected=0;
let gameOver=false;
let win=false;
let coin={
    x:0,
    y:0,
    radius:12
};
spawnCoin();
document.addEventListener("keydown",function(e){
    keys[e.key.toLowerCase()]=true;
});

document.addEventListener("keyup",function(e){
    keys[e.key.toLowerCase()]=false;
});

function spawnCoin(){
    coin.x=Math.random()*(canvas.width-40)+20;
    coin.y=Math.random()*(canvas.height-40)+20;
}

function spawnEnemy(){
    let side=Math.floor(Math.random()*4);

    let enemy={
        x:0,
        y:0,
        width:35,
        height:35,
        speed:2+Math.random()*2,
        dx:0,
        dy:0
    };

    if(side===0){
        enemy.x=Math.random()*canvas.width;
        enemy.y=-40;
        enemy.dx=(Math.random()-0.5)*2;
        enemy.dy=1;
    }

    if(side===1){
        enemy.x=canvas.width+40;
        enemy.y=Math.random()*canvas.height;
        enemy.dx=-1;
        enemy.dy=(Math.random()-0.5)*2;
    }

    if(side===2){
        enemy.x=Math.random()*canvas.width;
        enemy.y=canvas.height+40;
        enemy.dx=(Math.random()-0.5)*2;
        enemy.dy=-1;
    }

    if(side===3){
        enemy.x=-40;
        enemy.y=Math.random()*canvas.height;
        enemy.dx=1;
        enemy.dy=(Math.random()-0.5)*2;
    }

    let length=Math.sqrt(enemy.dx*enemy.dx+enemy.dy*enemy.dy);
    enemy.dx/=length;
    enemy.dy/=length;

    enemies.push(enemy);
}

setInterval(function(){
    if(!gameOver&&!win){
        spawnEnemy();
    }
},1200);

function rectCollision(a,b){
    return a.x<b.x+b.width&&
           a.x+a.width>b.x&&
           a.y<b.y+b.height&&
           a.y+a.height>b.y;
}

function circleRectCollision(circle,rect){
    let closestX=Math.max(rect.x,Math.min(circle.x,rect.x+rect.width));
    let closestY=Math.max(rect.y,Math.min(circle.y,rect.y+rect.height));

    let dx=circle.x-closestX;
    let dy=circle.y-closestY;

    return dx*dx+dy*dy<circle.radius*circle.radius;
}

function update(){

    if(gameOver||win){
        return;
    }

    if(keys["w"]) player.y-=player.speed;
    if(keys["s"]) player.y+=player.speed;
    if(keys["a"]) player.x-=player.speed;
    if(keys["d"]) player.x+=player.speed;

    if(player.x<0) player.x=0;
    if(player.y<0) player.y=0;
    if(player.x+player.width>canvas.width) player.x=canvas.width-player.width;
    if(player.y+player.height>canvas.height) player.y=canvas.height-player.height;

    for(let enemy of enemies){
        enemy.x+=enemy.dx*enemy.speed;
        enemy.y+=enemy.dy*enemy.speed;

        if(rectCollision(player,enemy)){
            gameOver=true;
        }
    }

    if(circleRectCollision(coin,player)){
        coinsCollected++;

        if(coinsCollected>=15){
            win=true;
        }
        else{
            spawnCoin();
        }
    }
}

function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);

    ctx.fillStyle="gold";
    ctx.font="28px Arial";
    ctx.fillText("Coins: "+coinsCollected+"/15",20,40);

    ctx.beginPath();
    ctx.arc(coin.x,coin.y,coin.radius,0,Math.PI*2);
    ctx.fillStyle="gold";
    ctx.fill();

    ctx.fillStyle="red";

    for(let enemy of enemies){
        ctx.fillRect(enemy.x,enemy.y,enemy.width,enemy.height);
    }

    ctx.drawImage(playerImage,player.x,player.y,player.width,player.height);

    if(gameOver||win){

        ctx.fillStyle="rgba(0,0,0,0.6)";
        ctx.fillRect(0,0,canvas.width,canvas.height);

        let boxWidth=400;
        let boxHeight=250;
        let boxX=(canvas.width-boxWidth)/2;
        let boxY=(canvas.height-boxHeight)/2;

        ctx.fillStyle="#333";
        ctx.fillRect(boxX,boxY,boxWidth,boxHeight);

        ctx.strokeStyle="white";
        ctx.lineWidth=3;
        ctx.strokeRect(boxX,boxY,boxWidth,boxHeight);

        ctx.textAlign="center";

        if(gameOver){
            ctx.fillStyle="white";
            ctx.font="55px Arial";
            ctx.fillText("GAME OVER",canvas.width/2,boxY+80);

            ctx.font="24px Arial";
            ctx.fillText("You collected "+coinsCollected+" / 15 coins",canvas.width/2,boxY+120);
        }

        if(win){
            ctx.fillStyle="lime";
            ctx.font="55px Arial";
            ctx.fillText("YOU WIN!",canvas.width/2,boxY+80);

            ctx.fillStyle="white";
            ctx.font="24px Arial";
            ctx.fillText("Collected all 15 coins!",canvas.width/2,boxY+120);
        }

        ctx.fillStyle="#4CAF50";
        ctx.fillRect(canvas.width/2-90,boxY+160,180,50);

        ctx.fillStyle="white";
        ctx.font="24px Arial";
        ctx.fillText("Play Again",canvas.width/2,boxY+193);

        ctx.textAlign="left";
    }
}

canvas.addEventListener("click",function(e){

    if(!gameOver&&!win){
        return;
    }

    const rect=canvas.getBoundingClientRect();

    const mouseX=e.clientX-rect.left;
    const mouseY=e.clientY-rect.top;

    if(
        mouseX>button.x &&
        mouseX<button.x+button.width &&
        mouseY>button.y &&
        mouseY<button.y+button.height
    ){
        player.x=450;
        player.y=300;

        enemies=[];
        coinsCollected=0;

        gameOver=false;
        win=false;

        spawnCoin();
    }
});

function gameLoop(){
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();