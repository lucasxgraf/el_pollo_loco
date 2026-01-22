class World {
  character = new Character();
  level = LEVEL_1;
  enemies = LEVEL_1.enemies;
  clouds = LEVEL_1.clouds;
  coins = LEVEL_1.coins;
  salsaBottles = LEVEL_1.salsaBottles;
  totalCoins = LEVEL_1.coins.length;
  totalBottles = LEVEL_1.salsaBottles.length;
  backgroundObjects = [];
  canvas;
  ctx;
  keyboard;
  camera_x = -100;
  statusBarHealth = new StatusBarHealth();
  statusBarCoin = new StatusBarCoin();
  statusBarSalsaBottle = new StatusBarSalsaBottle();
  statusBarEndboss;
  throwableObjects = [];
  throwing = true;
  no_throwing_sound = new Audio('assets/sound/no_throwing_objects.mp3');

  constructor(canvas, keyboard){
    this.ctx = canvas.getContext('2d');
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.drawWorld();
    this.setWorld();
    this.run();
    this.createBackgroundObjects();
    this.createClouds();
    this.playBackgroundMusic();
  }

  drawWorld(){
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.translate(this.camera_x, 0);
    
    this.addObjectsToMap(this.backgroundObjects);
    this.addObjectsToMap(this.enemies);
    this.addObjectsToMap(this.clouds);
    this.addObjectsToMap(this.coins);
    this.addObjectsToMap(this.salsaBottles);
    this.addObjectsToMap(this.throwableObjects);
    this.addToMap(this.character);
    
    this.ctx.translate(-this.camera_x, 0);
    this.addToMap(this.statusBarHealth);
    this.addToMap(this.statusBarCoin);
    this.addToMap(this.statusBarSalsaBottle);
    if (this.statusBarEndboss) {
      this.addToMap(this.statusBarEndboss);
    }
    this.ctx.translate(this.camera_x, 0);

    this.ctx.translate(-this.camera_x, 0);

    let self = this;
    requestAnimationFrame(function(){
      self.drawWorld();
    });
  }

  setWorld(){
    this.character.world = this;
  }

  run(){
    setInterval(() => {
      this.checkCollisions();
      this.checkThrowObjects();
      this.checkCollectables();
      this.checkCollisionsThrowableObjectsWithTheGround();
      this.checkCollisionsThrowableObjectsWithEnemies();
    }, 1000 / 60);
  }

  checkCollisions(){
    this.level.enemies.forEach((enemy) => {
      if(this.character.isColliding(enemy) && !enemy.isDead && !this.character.hurts){
        if(this.isJumpingOnEnemy(enemy)){
          enemy.health = 0;
          enemy.isDead = true;
          this.character.jumpOnEnemy();
        } else {
          this.character.hit();
          this.character.backwardJump();
          this.statusBarHealth.setPercentage(this.character.health);
        }
      }
    });
  }

  checkThrowObjects(){
    if (this.canThrowObjects()) {
      this.throwingObject();
    } else if (this.canNotThrowObjects()) {
      if (this.no_throwing_sound.paused) {
        playAudio(this.no_throwing_sound, 1);
      }
    }
}

  checkCollectables() {
  this.coins.forEach((coin, index) => {
    if (this.character.isColliding(coin)) {
      this.coins.splice(index, 1);
      this.character.collectedCoins++;
      const percentage = (this.character.collectedCoins / 19) * 100;
      this.statusBarCoin.setPercentage(percentage);
      let coinSound = new Audio('assets/sound/coin.mp3');
      playAudio(coinSound, 1);
    }
  });

  this.salsaBottles.forEach((bottle, index) => {
    if (this.character.isColliding(bottle)) {
      this.salsaBottles.splice(index, 1);
      this.character.collectedBottles++;
      const percentage = Math.min((this.character.collectedBottles / 5) * 100, 100);
      this.statusBarSalsaBottle.setPercentage(percentage);
      let bottleSound = new Audio('assets/sound/bottle_collect.mp3');
      playAudio(bottleSound, 1);
    }
  });
  }

  checkCollisionsThrowableObjectsWithTheGround() {
    this.throwableObjects.forEach((bottle) => {
      if (bottle.position_y >= bottle.bottleGround && !bottle.break) {
        this.bottleBreaks(bottle);
      }
    })
  }

  checkCollisionsThrowableObjectsWithEnemies() {
    this.throwableObjects.forEach((bottle) => {
      if (bottle.hasHit) 
        return;
  
      this.level.enemies.forEach((enemy) => {
        if (bottle.isColliding(enemy) && !enemy.isHurt() && !enemy.isDead) {
          bottle.hasHit = true;
          this.bottleCollidingWithEnemy(enemy, bottle);
        } 
      })
    })
  }

  bottleCollidingWithEnemy(enemy, bottle) {
    enemy.hit();
    if (enemy instanceof Endboss && this.statusBarEndboss) {
      this.statusBarEndboss.setPercentage(enemy.health);
    }
    if (enemy.hurt_sound) {
      playAudio(enemy.hurt_sound, 0.5);
    } else if (enemy.endboss_hurt_sound) {
      playAudio(enemy.endboss_hurt_sound, 0.5);
    }
    this.bottleBreaks(bottle);
  } 

  bottleBreaks(bottle) {
    bottle.break = true;
    bottle.intervalCounter = 200;
    this.clearTheBottleIntervals(bottle);
    bottle.animate();
    this.playBottleThrowSound(bottle);
  }

  playBottleThrowSound(bottle) {
    playAudio(bottle.breaking_sound, 1);
    setTimeout(() => {
      this.throwableObjects.splice(this.throwableObjects.indexOf(bottle), 1);
      clearInterval(bottle.animateBottleInterval);
    }, 1300);
  }

  clearTheBottleIntervals(bottle) {
    clearInterval(bottle.animateBottleInterval);
    clearInterval(bottle.throwInterval);
    clearInterval(bottle.applyGravityInterval);
  }

  enemyHurt(enemy) {
    enemy.energy -= 20;
  }

  isJumpingOnEnemy(enemy){
    return this.character.speedGravityY < 0 && 
      this.character.position_y + this.character.height - this.character.offset.bottom < enemy.position_y + enemy.height / 2;
  }

  throwingObject() {
    this.allowThrowingObjects();
    let bottle = new ThrowableObject(this.character.position_x + 50, this.character.position_y + 100);
    this.throwableObjects.push(bottle);
    this.character.collectedBottles--;
    const percentage = Math.min((this.character.collectedBottles / 5) * 100, 100);
    this.statusBarSalsaBottle.setPercentage(percentage);
  }

  allowThrowingObjects() {
    this.throwing = false;
    setTimeout(() => {
      this.throwing = true
    }, 1000);
  }

  canThrowObjects() {
    return this.keyboard.Q && this.throwing && this.character.collectedBottles > 0;
  }

  canNotThrowObjects() {
    return this.keyboard.Q && this.throwing && this.character.collectedBottles <= 0;
  }

  addObjectsToMap(objects){
    objects.forEach(o => {
      this.addToMap(o);
    });
  }

  addToMap(moveableObject){
    if(moveableObject.otherDirection){
      this.flipImage(moveableObject);
    }

    moveableObject.drawObject(this.ctx);
    // moveableObject.drawObjectHitbox(this.ctx);
    // moveableObject.drawObjectHitboxOffset(this.ctx);

    if(moveableObject.otherDirection){
      this.flipImageBack(moveableObject);
    }
  }

  flipImage(moveableObject){
    this.ctx.save();
    this.ctx.translate(moveableObject.width, 0);
    this.ctx.scale(-1, 1);
    moveableObject.position_x = moveableObject.position_x * -1;
  }

  flipImageBack(moveableObject){
    moveableObject.position_x = moveableObject.position_x * -1;
    this.ctx.restore();
  }

  createBackgroundObjects() {
    const layers = [
      'assets/img/5_background/layers/air.png',
      'assets/img/5_background/layers/3_third_layer/',
      'assets/img/5_background/layers/2_second_layer/',
      'assets/img/5_background/layers/1_first_layer/'
    ];
    
    for (let i = -1; i < 7; i++) {
      const MULTIPLIED_BY_719 = i * 719 ;
      const IMAGE_VARIANT = i % 2 === 0 ? '1.png' : '2.png';
      
      this.backgroundObjects.push(new BackgroundObject(layers[0], MULTIPLIED_BY_719, 0));
      this.backgroundObjects.push(new BackgroundObject(layers[1] + IMAGE_VARIANT, MULTIPLIED_BY_719, 0));
      this.backgroundObjects.push(new BackgroundObject(layers[2] + IMAGE_VARIANT, MULTIPLIED_BY_719, 0));
      this.backgroundObjects.push(new BackgroundObject(layers[3] + IMAGE_VARIANT, MULTIPLIED_BY_719, 0));
    }
  }

  createClouds() {
    this.clouds = [];
    const cloudImages = [
      'assets/img/5_background/layers/4_clouds/1.png',
      'assets/img/5_background/layers/4_clouds/2.png'
    ];

    const numberOfClouds = 6; 
    const cloudWidth = 720;  
    const spacingBetweenClouds = cloudWidth;

    for (let i = 0; i < numberOfClouds; i++) {
      const imagePath = cloudImages[i % 2];
      const position_x = i * spacingBetweenClouds + 720; 
      const cloud = new Cloud(imagePath, position_x);
      this.clouds.push(cloud);
    }
  }

  playBackgroundMusic() {
    playAudio(this.level.backgroundMusic, 0.5);
  }

  stopBackgroundMusic() {
    stopAudio(this.level.backgroundMusic);
  }
}