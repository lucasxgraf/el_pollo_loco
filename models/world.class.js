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
  NO_THROWING_SOUND = new Audio (SOUNDS.salsaBottle.NO_THROWING_SOUND);
  COIN_COLLECT_SOUND = new Audio (SOUNDS.gameSound.COIN_COLLECT_SOUND);
  SALSA_BOTTLE_COLLECT_SOUND = new Audio (SOUNDS.gameSound.SALSA_BOTTLE_COLLECT_SOUND);

  constructor(canvas, keyboard){
    this.ctx = canvas.getContext('2d');
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.drawWorld();
    this.setWorld();
    this.createBackgroundObjects();
    this.createClouds();
    this.playBackgroundMusic();
  }

  drawWorld() {
    this.update();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  
    this.ctx.save();
    this.ctx.translate(this.camera_x, 0);
  
    this.drawMovingObjectsToWorld();

    this.ctx.restore();
  
    this.drawNoneMovingObjectsToWorld();

    requestAnimationFrame(() => {
      this.drawWorld();
    });
  }

  drawMovingObjectsToWorld() {
    this.addObjectsToMap(this.backgroundObjects);
    this.addObjectsToMap(this.clouds);
    this.addObjectsToMap(this.enemies);
    this.addObjectsToMap(this.coins);
    this.addObjectsToMap(this.salsaBottles);
    this.addObjectsToMap(this.throwableObjects);
    this.addToMap(this.character);
  }

  drawNoneMovingObjectsToWorld() {
    this.addToMap(this.statusBarHealth);
    this.addToMap(this.statusBarCoin);
    this.addToMap(this.statusBarSalsaBottle);
    if (this.statusBarEndboss) {
      this.addToMap(this.statusBarEndboss);
    }
  }

  setWorld(){
    this.character.world = this;
  }

  update() {
    this.checkCollisions();
    this.checkThrowObjects();
    this.checkCollectables();
    this.checkCollisionsThrowableObjectsWithTheGround();
    this.checkCollisionsThrowableObjectsWithEnemies();
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
      if (SOUNDS.salsaBottle.NO_THROWING_SOUND.paused) {
        playAudio(SOUNDS.salsaBottle.NO_THROWING_SOUND, 1);
      }
    }
  }

  checkCollectables() {
    this.checkCoins();
    this.checkBottles();
  }
  
  checkCoins() {
    let coinsToRemove = [];
    this.coins.forEach((coin, index) => {
      if (this.character.isColliding(coin)) {
        coinsToRemove.push(index);
        this.collectCoin();
      }
    });
  
    this.removeCollectables(this.coins, coinsToRemove);
  }
  
  checkBottles() {
    let bottlesToRemove = [];
    this.salsaBottles.forEach((bottle, index) => {
      if (this.character.isColliding(bottle)) {
        bottlesToRemove.push(index);
        this.collectBottle();
      }
    });
  
    this.removeCollectables(this.salsaBottles, bottlesToRemove);
  }
  
  collectCoin() {
    this.character.collectedCoins++;
    const percentage = (this.character.collectedCoins / 19) * 100;
    this.statusBarCoin.setPercentage(percentage);
    playAudio(this.COIN_COLLECT_SOUND, 1);
  }
  
  collectBottle() {
    this.character.collectedBottles++;
    const percentage = Math.min((this.character.collectedBottles / 5) * 100, 100);
    this.statusBarSalsaBottle.setPercentage(percentage);
    playAudio(this.SALSA_BOTTLE_COLLECT_SOUND, 1);
  }
  
  removeCollectables(collection, indicesToRemove) {
    for (let i = indicesToRemove.length - 1; i >= 0; i--) {
      collection.splice(indicesToRemove[i], 1);
    }
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
      playAudio(SOUNDS.endboss.ENDBOSS_HURT_SOUND, 0.5);
    } else {
      playAudio(SOUNDS.chicken.DEAD_CHICKEN_SOUND, 0.5);
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
    playAudio(SOUNDS.salsaBottle.BREAKING_SOUND, 1);
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
    const cloudImages = ALL_IMAGES.clouds;
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