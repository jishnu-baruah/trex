var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var END=0,PLAY=1,gamestate;
var score;
var gameover,restart,gameoverImage,restartIamge;

var die,jump,cp;

function preload(){
  trex_running =  loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadImage("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameoverImage = loadImage("gameOver.png");
  restartIamge = loadImage("restart.png");
  
  die = loadSound("die.mp3");
  jump = loadSound("jump.mp3");
  cp = loadSound("checkPoint.mp3");
}

function setup() {
  createCanvas(600, 200);
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.scale = 0.5;
  trex.addImage("collided", trex_collided);
  trex.setCollider("circle",0,0,30);
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
  
  gamestate = PLAY;
  
  gameover = createSprite(300,100);
  gameover.addImage(gameoverImage);
  gameover.scale= 0.5;
  gameover.visible= false;
  
  
  restart = createSprite(300,50);
  restart.addImage(restartIamge);
  restart.scale=0.5;
  restart.visible = false;
  
}

function draw() {
  background(255);
  

  text("Score: "+ score, 500,50);
  
  if(gamestate===PLAY){
    score = score + Math.round(getFrameRate()/60);
    //console.log(trex.y);
      if(keyDown("space")&&trex.y>=161) {
        trex.velocityY = -13;
        jump.play();
        }
  
      if (ground.x < 0){
         ground.x = ground.width/2;
        }
    ground.velocityX = -(6 + 3*score/100);
    trex.velocityY = trex.velocityY + 0.8
    
    if (score>0 && score%100 === 0){
      cp.play();
    }
    
    
     spawnClouds();
     spawnObstacles();
  
      if(trex.isTouching( obstaclesGroup)){
      trex.changeAnimation("collided");
      gamestate= END;  
      die.play()  ;
      }
    
    trex.collide(invisibleGround);
    
  }
  else if(gamestate===END){
    gameover.visible=true;
    restart.visible=true;
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    trex.velocityY=0;
    
    ground.velocityX=0;
    
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);
    
     
  if(mousePressedOver(restart)) {
    reset();
  }
  }
 
  
   drawSprites();
}

function reset(){
  gamestate = PLAY;
  
  gameover.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running");
  
  
  score = 0;
  
}


function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,165,10,40);
    obstacle.velocityX = - (6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
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
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}