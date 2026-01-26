/**
 * @file Character.class.js
 * @description Represents the player character with movement, animation, sound, and game state handling.
 */

/**
 * Class representing the player character.
 * Extends MoveableObject to inherit movement, animation, and physics.
 */
class Character extends MoveableObject {
  characterDieInterval;
  characterConditionInterval;
  world;
  position_y = 180;
  height = 250;
  width = 100;
  collectedCoins = 0;
  collectedBottles = 0;
  stop = true;
  jumpedOnEnemy = false;
  canThrow = true;
  counter = 0;
  longIdle = 0;
  amountCounter = 0;
  speed = 5;
  speedSound = 1;
  offset = {
    top: 120,
    left: 40,
    right: 35,
    bottom: 10
  };
  IMAGES_IDLE = ALL_IMAGES.character.IMAGES_IDLE;
  IMAGES_LONG_IDLE = ALL_IMAGES.character.IMAGES_LONG_IDLE;
  IMAGES_WALKING = ALL_IMAGES.character.IMAGES_WALKING;
  IMAGES_JUMPING = ALL_IMAGES.character.IMAGES_JUMPING;
  IMAGES_DEAD = ALL_IMAGES.character.IMAGES_DEAD;
  IMAGES_HURT = ALL_IMAGES.character.IMAGES_HURT;
  WALKING_SOUND = new Audio(SOUNDS.character.WALKING_SOUND);
  JUMP_SOUND = new Audio(SOUNDS.character.JUMP_SOUND);
  HURT_SOUND = new Audio(SOUNDS.character.HURT_SOUND);

  /**
   * Constructs a new Character instance.
   * Loads images, starts animations, and applies gravity.
   */
  constructor() {
    super().loadImage('assets/img/2_character_pepe/1_idle/idle/I-1.png');
    this.keyboard = keyboard;
    this.loadImagesCharacter();
    this.animateMovement();
    this.animateConditionOfCharacter();
    this.animateWalkingSpeed();
    this.applyGravity();
  }

  /**
   * Loads all character animation images.
   */
  loadImagesCharacter() {
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_LONG_IDLE);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
  }

  /**
   * Animates character movement based on keyboard input.
   * Updates camera position accordingly.
   */
  animateMovement() {
    setInterval(() => {
      this.WALKING_SOUND.pause();
      if (this.canMoveRight()) {
        this.moveRight();
      } else if (this.canMoveLeft()) {
        this.moveLeft();
        this.otherDirection = true;
      }
      if (this.canJump()) {
        this.jump();
        playAudio(this.JUMP_SOUND, 1);
      }
      this.world.camera_x = -this.position_x + 100;
    }, 1000 / 60);
  }

  /**
   * Checks if the character can move right.
   * @returns {boolean} True if right movement is allowed.
   */
  canMoveRight() {
    return this.keyboard.RIGHT && this.position_x < this.world.level.level_end_x && !this.hurts;
  }

  /**
   * Checks if the character can move left.
   * @returns {boolean} True if left movement is allowed.
   */
  canMoveLeft() {
    return this.keyboard.LEFT && this.position_x > 0 && !this.hurts;
  }

  /**
   * Checks if the character can jump.
   * @returns {boolean} True if jump is allowed.
   */
  canJump() {
    return (this.keyboard.UP || this.keyboard.SPACE) && !this.isObjectAboveGround();
  }

  /**
   * Moves the character to the right and handles walking sound and speed.
   */
  moveRight() {
    super.moveRight();
    if (this.otherDirection) {
      this.stopIncreasingSpeed();
    }
    this.otherDirection = false;
    if (!this.isObjectAboveGround()) {
      playAudio(this.WALKING_SOUND, 1);
      this.WALKING_SOUND.playbackRate = this.speedSound;
    }
    this.increasingSpeed();
    playAudio(this.WALKING_SOUND, 1);
  }

  /**
   * Moves the character to the left and handles walking sound and speed.
   */
  moveLeft() {
    super.moveLeft();
    if (!this.otherDirection) {
      this.stopIncreasingSpeed();
    }
    this.otherDirection = true;
    if (!this.isObjectAboveGround) {
      playAudio(this.WALKING_SOUND, 1);
      this.WALKING_SOUND.playbackRate = this.speedSound;
    }
    this.increasingSpeed();
    playAudio(this.WALKING_SOUND, 1);
  }

  /**
   * Makes the character jump and stops walking sound.
   */
  jump() {
    super.jump();
    this.WALKING_SOUND.pause();
  }

  /**
   * Makes the character jump on an enemy with reduced gravity.
   */
  jumpOnEnemy() {
    this.speedGravityY = 10;
    this.WALKING_SOUND.pause();
  }

  /**
   * Animates the character's condition (dead, hurt, jump, walk, idle).
   */
  animateConditionOfCharacter() {
    this.characterConditionInterval = setInterval(() => {
      if (this.isDead()) return this.handleDeath();
      if (this.isHurt(0.7)) return this.handleHurt();
      if (this.isObjectAboveGround()) return this.handleJump();
      if (this.walkAnimationRequirements()) return this.handleWalk();
      this.resetWalkCounters();
    }, 50);
  }

  /**
   * Handles the death animation.
   */
  handleDeath() {
    this.characterDieAnimation();
  }

  /**
   * Handles the hurt animation.
   */
  handleHurt() {
    this.playAnimation(this.IMAGES_HURT);
  }

  /**
   * Handles the jump animation logic by selecting the correct frame 
   * based on the vertical speed (gravity).
   */
  handleJump() {
    this.longIdle = 0;
    let i = this.resolveJumpImageIndex();
    let path = this.IMAGES_JUMPING[i];
    this.img = IMAGE_CACHE[path];
  }

  /**
   * Resolves the index of the jump image based on vertical speed.
   * @returns {number} The index of the image in IMAGES_JUMPING.
   */
  resolveJumpImageIndex() {
    if (this.speedGravityY > 15) return 1; // Start jump
    if (this.speedGravityY > 10) return 2;
    if (this.speedGravityY > 5) return 3;
    if (this.speedGravityY > 0) return 4; // Peak
    if (this.speedGravityY > -5) return 5; // Start falling
    if (this.speedGravityY > -10) return 6;
    if (this.speedGravityY > -15) return 7;
    return 8; // Landing approach
  }

  /**
   * Handles the walk animation.
   */
  handleWalk() {
    this.counter++;
    if (this.counter >= 4) {
      this.playAnimation(this.IMAGES_WALKING);
      this.amountCounter += 0.25;
      this.counter = 0 + this.amountCounter;
    }
  }

  /**
   * Resets walk animation counters.
   */
  resetWalkCounters() {
    this.counter = 0;
    this.amountCounter = 0;
  }

  /**
   * Checks if walk animation should play.
   * @returns {boolean} True if walk animation conditions are met.
   */
  walkAnimationRequirements() {
    return (this.keyboard.RIGHT || this.keyboard.LEFT && this.position_x > 0) && this.position_x < this.world.level.level_end_x;
  }

  /**
   * Plays the jump animation with timing control.
   */
  characterJumpAnimation() {
    clearInterval(this.characterConditionInterval);
    this.longIdle = 0;
    this.characterJumpInterval = setInterval(() => {
      this.playAnimation(this.IMAGES_JUMPING);
    }, 220);
    setTimeout(() => {
      this.currentImage = 0;
      this.animateConditionOfCharacter();
      clearInterval(this.characterJumpInterval);
    }, 850);
  }

  /**
   * Makes the character jump backward when hurt.
   */
  backwardJump() {
    if (this.hurts) 
      return;
    this.initiateBackwardJump();
    this.startBackwardMovement();
    this.endBackwardJump();
  }

  /**
   * Initiates the backward jump state.
   */
  initiateBackwardJump() {
    this.hurts = true;
    this.speed = 15;
    this.stopIncreasingSpeed();
    playAudio(this.HURT_SOUND, 1);
  }

  /**
   * Starts moving the character backward.
   */
  startBackwardMovement() {
    this.backwardInterval = setInterval(() => {
      this.position_x--;
    }, 1000 / 200);
  }

  /**
   * Ends the backward jump state.
   */
  endBackwardJump() {
    setTimeout(() => {
      clearInterval(this.backwardInterval);
      this.hurts = false;
    }, 700);
  }

  /**
   * Plays the death animation and ends the game.
   */
  characterDieAnimation() {
    this.WALKING_SOUND.pause();
    stopAllInterval();
    this.characterDieInterval = setInterval(() => {
      this.playAnimation(this.IMAGES_DEAD);
    }, 380);
    setTimeout(() => {
      clearInterval(this.characterDieInterval);
      gameIsOver(false);
    }, 1900);
  }

  /**
   * Animates walking speed and handles idle animations.
   */
  animateWalkingSpeed() {
    setInterval(() => {
      if (this.shouldIdle()) {
        this.handleIdle();
      } else {
        this.longIdle = 0;
      }
    }, 300);
  }

  /**
   * Checks if the character should play idle animation.
   * @returns {boolean} True if idle animation should play.
   */
  shouldIdle() {
    return (
      (!this.keyboard.LEFT && !this.keyboard.RIGHT) ||
      this.position_x <= 0 ||
      this.position_x > this.world.level.level_end_x
    );
  }

  /**
   * Handles idle animation and stops walking sound.
   */
  handleIdle() {
    this.WALKING_SOUND.pause();
    this.stopIncreasingSpeed();
    this.longIdle++;
    if (this.longIdle <= 20) {
      this.playAnimation(this.IMAGES_IDLE);
    } else {
      this.playAnimation(this.IMAGES_LONG_IDLE);
    }
  }

  /**
   * Gradually increases the character's speed and walking sound playback rate.
   */
  increasingSpeed() {
    if (this.speed < 8) {
      this.speed *= 1.01;
      this.speedSound *= 1.008;
    }
  }

  /**
   * Resets the character's speed and walking sound playback rate.
   */
  stopIncreasingSpeed() {
    this.speed = 2.5;
    this.speedSound = 1;
    this.counter = 0;
    this.amountCounter = 0;
  }

  /**
   * Attempts to throw a bottle if cooldown and inventory allow it.
   * Plays a sound if no bottles are available.
   */
  attemptToThrowBottle() {
    if (!this.canThrow) 
      return;
    if (this.collectedBottles <= 0) {
      this.canThrow = false;
      playAudio(SOUNDS.salsaBottle.NO_THROWING_SOUND, 1);
      setTimeout(() => { 
        this.canThrow = true; 
      }, 1000); 
      return;
    }

    this.canThrow = false;
    this.throwingObject();

    setTimeout(() => {
      this.canThrow = true;
    }, 1000);
  }

  /**
   * Creates and throws a new salsa bottle.
   * Updates the bottle inventory and status bar.
   */
  throwingObject() {
    let bottle = new ThrowableObject(this.position_x + 50, this.position_y + 100);
    this.world.throwableObjects.push(bottle);
    this.collectedBottles--;
    this.world.statusBarSalsaBottle.setPercentage(
      Math.min((this.collectedBottles / 10) * 100, 100)
    );
  }
}