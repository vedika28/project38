var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var coinAnm, coin, coinsGroup;

//initiate Game STATEs
var PLAY = 1;
var END = 0;
var gameState = PLAY;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var gameOver, restart, gameOverImage, restartImage;
var jumpingTrex;
var score=0;
var trexGroup;
var bg;
var count = 0;

//to prelooad the images and animations required.
function preload() {
  trex_running = loadAnimation("images/trex1.png", "images/trex3.png", "images/trex4.png");
  trex_collided = loadImage("images/trex_collided.png");
  jumpingTrex = loadImage("images/trex4.png");

  groundImage = loadImage("images/ground2.png");
  cloudImage = loadImage("images/cloud.png");

  obstacle1 = loadImage("images/obstacle1.png");
  obstacle2 = loadImage("images/obstacle2.png");
  obstacle3 = loadImage("images/obstacle3.png");
  obstacle4 = loadImage("images/obstacle4.png");
  obstacle5 = loadImage("images/obstacle5.png");

  gameOverImage = loadImage("images/gameOver.png");
  restartImage = loadImage("images/restart.png");

  coinAnm = loadAnimation("coinImgs/coin1.png", "coinImgs/coin2.png", "coinImgs/coin3.png"
    , "coinImgs/coin4.png", "coinImgs/coin5.png", "coinImgs/coin6.png", "coinImgs/coin7.png")
}


function setup() {
  // createCanvas(600, 200);

  setBackground();

  createCanvas(displayWidth, displayHeight - 145);

  trex = createSprite(50, 180, 20, 50);
  trex.addAnimation("running", trex_running);
  trex.addImage("colliding", trex_collided);
  trex.addImage("jumping", jumpingTrex);
  trex.scale = 0.5;

  ground = createSprite(displayWidth / 2, 180, displayWidth, 20);
  ground.addImage("ground", groundImage);
  //ground.x = ground.width / 2;
  //ground.velocityX = -4;

  invisibleGround = createSprite(200, 190, 400, 10);
  invisibleGround.visible = false;

  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  coinsGroup = new Group();
  trexGroup = new Group();
  trexGroup.add(trex);

  //to place gameOver and restart icon on the screen
  gameOver = createSprite(camera.position.x + 230, 60);
  restart = createSprite(camera.position.x + 230, 100);
  gameOver.addImage(gameOverImage);
  gameOver.scale = 0.5;
  restart.addImage(restartImage);
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
}

function draw() {
  background(255);
  if (bg) {
    background(bg);
  }
  if (gameState === PLAY) {
    //to make trex jump once space key is pressed
    if (keyDown("space") && trex.position.y >= ground.y - 50) {
      //trex.changeImage("jump", jumpingTrex);
      trex.velocityY = -14;
    }

    //scoring
    if (frameCount % 2 === 0) {
      count += 1;
    }
    //count = count+Math.round(frameCount/700);

    //adding gravity
    trex.velocityY = trex.velocityY + 0.8

    //assignig velocity to give real world effect
    camera.position.x = trex.position.x + 200
    camera.position.y = 100
    camera.velocityX = 6;
    trex.velocityX = 6;
    gameOver.velocityX = 6;
    restart.velocityX = 6;
    ground.velocityX = 6;
    invisibleGround.velocityX = 6;

    //making trex collide with invisible ground.
    trex.collide(invisibleGround);

    //calling the function to spawn the objects.
    spawnObstacles();
    spawnCoins();

    //destroying coins if trex touch them
    for (var x = 0; x < coinsGroup.length; x = x + 1) {
      if (trexGroup.isTouching(coinsGroup[x])) {
        coinsGroup[x].destroy();
        score = score + 1;
      }
    }

    //ending game once trex touches obstacles
    if (obstaclesGroup.isTouching(trex)) {
      gameState = END;
    }

    //to give instructions to player
    textSize(20);
    text("collect the coins and press space to jump from the obstacles", camera.position.x - 300, camera.position.y - 270)

  }
  //to stop the game.
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;

    //setting velcity of each game object to 0
    ground.velocityX = 0;
    invisibleGround.velocityX = 0;
    trex.velocityY = 0;
    trex.velocityX = 0;
    camera.velocityX = 0;
    gameOver.velocityX = 0;
    restart.velocityX = 0;

    //changing the trex animation.
    trex.changeAnimation("colliding", trex_collided);

    //destroying games objects
    obstaclesGroup.destroyEach();
    cloudsGroup.destroyEach();
    coinsGroup.destroyEach();
  }

  //to be able to play the game ends
  if (mousePressedOver(restart)) {
    reset();
  }

  //displaying score
  textSize(25);
  text("Coins:" + score, camera.position.x + 300, 30);
  text("Score:" + count, camera.position.x + 300, 0);

  //to give adaptivity
  if (score>=800) {
    camera.velocityX = 8;
    trex.velocityX = 8;
    gameOver.velocityX = 8;
    restart.velocityX = 8;
    ground.velocityX = 8;
    invisibleGround.velocityX = 8;
  }

  drawSprites();
}



function spawnClouds() {
  // to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(camera.position.x + 800, 100, 40, 10);
    cloud.y = Math.round(random(80, 120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    var speed3 = cloud.velocityX;

    //assign lifetime to the variable
    cloud.lifetime = width / speed3;

    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;

    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}

function spawnCoins() {
  //write code here to spawn the coins
  if (frameCount % 40 === 0) {
    var coin = createSprite(camera.position.x + 800, 100, 10, 10);
    coin.y = Math.round(random(80, 100));
    coin.addAnimation("coins", coinAnm);
    coin.scale = 0.2;
    var speed2 = coin.velocityX;

    //assign lifetime to the variable
    coin.lifetime = width / speed2;

    //adjust the depth
    coin.depth = cloudsGroup.depth;
    coin.depth = coin.depth + 1;

    //add each coin to the group
    coinsGroup.add(coin);
  }
}

function spawnObstacles() {
  if (frameCount % 60 === 0) {
    var obstacle = createSprite(camera.position.x + 800, 165, 10, 40);
    var speed = obstacle.velocityX;

    //generate random obstacles
    var rand = Math.round(random(1, 5));
    switch (rand) {
      case 1: obstacle.addImage(obstacle1);
        break;
      case 2: obstacle.addImage(obstacle2);
        break;
      case 3: obstacle.addImage(obstacle3);
        break;
      case 4: obstacle.addImage(obstacle4);
        break;
      case 5: obstacle.addImage(obstacle5);
        break;
      default: break;
    }

    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = width / speed;

    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset() {
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;

  trex.changeAnimation("running", trex_running);
  score = 0;
  count = 0;
}


async function setBackground() {
  var response = await fetch("http://worldtimeapi.org/api/timezone/Asia/kolkata");
  var responseJson = await response.json();
  var datetime = responseJson.datetime;
  var hour = datetime.slice(11, 13);
  console.log(hour);

  if (hour >= 06 && hour <= 17) {
    bg = loadImage("images/bg2.jpg");
    spawnClouds();
  } else {
    bg = loadImage("images/bg.jpg");
  }
}