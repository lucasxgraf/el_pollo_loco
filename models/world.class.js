/**
 * @file World.class.js
 * @description Represents the game world, managing entities, collisions, rendering, and game state.
 */

/**
 * Class representing the game world.
 * Manages all moving and static objects, handles collisions, and controls game flow.
 */
class World {
  character = new Character(this.keyboard);
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
  camera_x = -100
  statusBarHealth = new StatusBarHealth();
  statusBarCoin = new StatusBarCoin();
  statusBarSalsaBottle = new StatusBarSalsaBottle();
  statusBarEndboss;
  throwableObjects = [];
  throwing = true;
  NO_THROWING_SOUND = getAudioObject(SOUNDS.salsaBottle.NO_THROWING_SOUND);
  COIN_COLLECT_SOUND = getAudioObject(SOUNDS.gameSound.COIN_COLLECT_SOUND);
  SALSA_BOTTLE_COLLECT_SOUND = getAudioObject(SOUNDS.gameSound.SALSA_BOTTLE_COLLECT_SOUND);

  /**
   * Constructs a new World instance.
   * @param {HTMLCanvasElement} canvas - The canvas element to draw on.
   * @param {Keyboard} keyboard - The keyboard input controller.
   */
  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext('2d');
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.backgroundObjects = BackgroundObject.createBackgroundObjects();
    this.clouds = Cloud.createClouds();
    this.setWorld();
    this.drawWorld();
    playBackgroundMusic(this);
  }

  lastTimestamp = 0;

  /**
   * Main rendering loop that clears and redraws the world continuously.
   * Uses delta time to keep physics consistent across different display refresh rates.
   * @param {number} timestamp - DOMHighResTimeStamp provided by requestAnimationFrame.
   */
  drawWorld(timestamp = 0) {
    if (gameEnded)
      return;
    const TARGET_INTERVAL = 1000 / 60;
    const elapsed = this.lastTimestamp ? timestamp - this.lastTimestamp : TARGET_INTERVAL;
    if (elapsed < TARGET_INTERVAL * 0.75) {
      requestAnimationFrame((ts) => this.drawWorld(ts));
      return;
    }
    const dt = Math.min(elapsed / TARGET_INTERVAL, 2);
    this.lastTimestamp = timestamp;
    this.update(dt);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.save();
    const cameraX = Math.round(this.camera_x);
    this.ctx.translate(cameraX, 0);
    this.drawMovingObjectsToWorld();
    this.ctx.restore();
    this.drawNoneMovingObjectsToWorld();
    requestAnimationFrame((ts) => this.drawWorld(ts));
  }

  /**
   * Draws all moving game objects onto the canvas.
   */
  drawMovingObjectsToWorld() {
    this.addObjectsToMap(this.backgroundObjects);
    this.addObjectsToMap(this.clouds);
    this.addObjectsToMap(this.enemies);
    this.addObjectsToMap(this.coins);
    this.addObjectsToMap(this.salsaBottles);
    this.addObjectsToMap(this.throwableObjects);
    this.addToMap(this.character);
  }

  /**
   * Draws all static UI elements onto the canvas.
   */
  drawNoneMovingObjectsToWorld() {
    this.addToMap(this.statusBarHealth);
    this.addToMap(this.statusBarCoin);
    this.addToMap(this.statusBarSalsaBottle);
    if (this.statusBarEndboss) {
      this.addToMap(this.statusBarEndboss);
    }
  }

  /**
   * Assigns the world reference to the character.
   */
  setWorld() {
    this.character.world = this;
  }

  updateFrameCounter = 0;

  /**
   * Performs all game logic updates each frame, driven by requestAnimationFrame.
   * @param {number} dt - Delta time scalar (1.0 = 60fps, 2.0 = 30fps, 0.5 = 120fps).
   */
  update(dt = 1) {
    if (gameEnded)
      return;

    this.updateFrameCounter++;
    const fc = this.updateFrameCounter;

    this.character.update(fc, dt);
    this.enemies.forEach(enemy => enemy.update(fc, dt));
    this.throwableObjects.forEach(bottle => bottle.update(fc, dt));

    this.checkThrowObjects();
    this.checkCollisions();
    this.checkCollectables();
    this.checkCollisionsThrowableObjectsWithTheGround();
    this.checkCollisionsThrowableObjectsWithEnemies();

    if (fc % 10 === 0) checkIfGameIsStillWinnable(this);
    if (fc >= 60) this.updateFrameCounter = 0;
  }

  /**
   * Checks for collisions between the character and enemies.
   */
  checkCollisions() {
    this.level.enemies.forEach((enemy) => {
      if (this.character.isColliding(enemy) && !enemy.isDead && !this.character.hurts) {
        if (this.isJumpingOnEnemy(enemy)) {
          enemy.health = 0;
          this.character.jumpOnEnemy();
        } else {
          this.character.hit();
          this.character.backwardJump();
          this.statusBarHealth.setPercentage(this.character.health);
        }
      }
    });
  }

  /**
   * Handles throwing of salsa bottles based on input.
   * Delegates throwing logic to the character.
   */
  checkThrowObjects() {
    if (this.keyboard.Q) {
      this.character.attemptToThrowBottle();
    }
  }

  /**
   * Checks for collisions with collectible items (coins and bottles).
   */
  checkCollectables() {
    this.checkCoins();
    this.checkBottles();
  }

  /**
   * Checks for collisions with coins and handles collection.
   */
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

  /**
   * Checks for collisions with salsa bottles and handles collection.
   */
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

  /**
   * Processes coin collection logic.
   */
  collectCoin() {
    this.character.collectedCoins++;
    const percentage = (this.character.collectedCoins / 19) * 100;
    this.statusBarCoin.setPercentage(percentage);
    playAudio(this.COIN_COLLECT_SOUND, 1, 0, true);
  }

  /**
   * Processes salsa bottle collection logic.
   */
  collectBottle() {
    this.character.collectedBottles++;
    const percentage = Math.min((this.character.collectedBottles / 5) * 100, 100);
    this.statusBarSalsaBottle.setPercentage(percentage);
    playAudio(this.SALSA_BOTTLE_COLLECT_SOUND, 1, 0, true);
  }

  /**
   * Removes collected items from their respective arrays.
   * @param {Array} collection - The array of collectible items.
   * @param {Array<number>} indicesToRemove - Indices of items to remove.
   */
  removeCollectables(collection, indicesToRemove) {
    for (let i = indicesToRemove.length - 1; i >= 0; i--) {
      collection.splice(indicesToRemove[i], 1);
    }
  }

  /**
   * Checks if thrown bottles have hit the ground.
   */
  checkCollisionsThrowableObjectsWithTheGround() {
    this.throwableObjects.forEach((bottle) => {
      if (bottle.position_y >= bottle.bottleGround && !bottle.break) {
        this.bottleBreaks(bottle);
      }
    });
  }

  /**
   * Checks for collisions between thrown bottles and enemies.
   */
  checkCollisionsThrowableObjectsWithEnemies() {
    this.throwableObjects.forEach((bottle) => {
      if (bottle.hasHit) return;
      this.level.enemies.forEach((enemy) => {
        if (
          bottle.isColliding(enemy) &&
          !enemy.isHurt() &&
          !enemy.isDead
        ) {
          bottle.hasHit = true;
          this.bottleCollidingWithEnemy(enemy, bottle);
        }
      });
    });
  }

  /**
   * Handles collision effects between a bottle and an enemy.
   * @param {Enemy} enemy - The enemy that was hit.
   * @param {ThrowableObject} bottle - The bottle that caused the hit.
   */
  bottleCollidingWithEnemy(enemy, bottle) {
    if (bottle.break) 
      return;
    enemy.hit();
    if (enemy instanceof Endboss && this.statusBarEndboss) {
      this.statusBarEndboss.setPercentage(enemy.health);
      playAudio(SOUNDS.endboss.ENDBOSS_HURT_SOUND, 0.5);
    } else {
      if (enemy.DEAD_CHICKEN_SOUND) 
        playAudio(enemy.DEAD_CHICKEN_SOUND, 0.5);
      if (enemy.DEAD_SMALL_CHICKEN_SOUND) 
        playAudio(enemy.DEAD_SMALL_CHICKEN_SOUND, 0.5);
    }
    this.bottleBreaks(bottle);
  }

  /**
   * Triggers the breaking animation for a bottle.
   * @param {ThrowableObject} bottle - The bottle to break.
   */
  bottleBreaks(bottle) {
    bottle.break = true;
    this.playBottleThrowSound(bottle);
  }

  /**
   * Plays the bottle breaking sound and removes it after delay.
   * @param {ThrowableObject} bottle - The bottle that broke.
   */
  playBottleThrowSound(bottle) {
    playAudio(SOUNDS.salsaBottle.BREAKING_SOUND, 1, 0, true);
    setTimeout(() => {
      this.throwableObjects.splice(
        this.throwableObjects.indexOf(bottle),
        1
      );
      clearInterval(bottle.animateBottleInterval);
    }, 1300);
  }

  /**
   * Determines if the character is jumping on top of an enemy.
   * @param {Enemy} enemy - The enemy to check against.
   * @returns {boolean} True if the character is jumping on the enemy.
   */
  isJumpingOnEnemy(enemy) {
    return (
      this.character.speedGravityY < 0 &&
      this.character.position_y +
        this.character.height -
        this.character.offset.bottom <
        enemy.position_y + enemy.height / 2
    );
  }

  /**
   * Adds multiple objects to the map for rendering.
   * @param {Array<MovableObject>} objects - Objects to add.
   */
  addObjectsToMap(objects) {
    objects.forEach((o) => {
      this.addToMap(o);
    });
  }

  /**
   * Adds a single movable object to the map for rendering.
   * Handles flipping images for directional movement.
   * @param {MovableObject} moveableObject - Object to render.
   */
  addToMap(moveableObject) {
    if (moveableObject.otherDirection) {
      this.flipImage(moveableObject);
    }
    moveableObject.drawObject(this.ctx);
    if (moveableObject.otherDirection) {
      this.flipImageBack(moveableObject);
    }
  }

  /**
   * Flips an object's image horizontally for left-facing movement.
   * @param {MovableObject} moveableObject - Object to flip.
   */
  flipImage(moveableObject) {
    this.ctx.save();
    this.ctx.translate(moveableObject.width, 0);
    this.ctx.scale(-1, 1);
    moveableObject.position_x = moveableObject.position_x * -1;
  }

  /**
   * Restores the canvas transformation after flipping an image.
   * @param {MovableObject} moveableObject - Object that was flipped.
   */
  flipImageBack(moveableObject) {
    moveableObject.position_x = moveableObject.position_x * -1;
    this.ctx.restore();
  }
  /**
   * For connecting cleanup function from world.helpers.js
   */
  cleanup() {
    cleanup(this);
  }
}
