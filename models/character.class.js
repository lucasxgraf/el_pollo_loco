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
  justJumped = false;
  jumpAnimationPlayed = false;
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
  WALKING_SOUND = getAudioObject(SOUNDS.character.WALKING_SOUND);
  JUMP_SOUND = getAudioObject(SOUNDS.character.JUMP_SOUND);
  HURT_SOUND = getAudioObject(SOUNDS.character.HURT_SOUND);

  /**
   * Constructs a new Character instance.
   * Loads images, starts animations, and applies gravity.
   */
  constructor() {
    super().loadImage('assets/img/2_character_pepe/1_idle/idle/I-1.png');
    this.keyboard = keyboard;
    this.loadImagesCharacter();
    this.characterMainLoop();
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
   * Main character loop consolidating movement, animations, and physics logic.
   * Runs at 60 FPS but executes different logic at specific frame frequencies.
   */
  characterMainLoop() {
    let frameCounter = 0;
    this.mainLoopInterval = setInterval(() => {
      this.updateMovement();
      
      // Update animations/condition at ~20 FPS (every 3 frames)
      if (frameCounter % 3 === 0) {
        this.updateConditionLogic();
      }

      // Update idle state at ~3 FPS (every 20 frames)
      if (frameCounter % 20 === 0) {
        this.updateIdleState();
      }

      frameCounter++;
      if (frameCounter >= 60) frameCounter = 0;
    }, 1000 / 60);
  }

  /**
   * Handles character movement and sound state.
   */
  updateMovement() {
    let isMoving = false;
    if (this.canMoveRight()) {
      this.moveRight();
      isMoving = true;
    } else if (this.canMoveLeft()) {
      this.moveLeft();
      isMoving = true;
    }

    this.handleMovementSound(isMoving);

    if (this.canMoveUp()) {
      this.jump();
      playAudio(this.JUMP_SOUND, 1);
    }
    
    // Explicit world check to prevent early initialization crashes
    if (this.world) {
      this.world.camera_x = -this.position_x + 100;
    }
  }

  /**
   * Manages the walking sound based on movement state.
   * Optimized to only talk to the Audio API when state changes.
   * @param {boolean} isMoving - Current movement state.
   */
  handleMovementSound(isMoving) {
    const isWalkingOnGround = isMoving && !this.isObjectAboveGround();
    
    if (isWalkingOnGround) {
      if (this.WALKING_SOUND.paused) {
        playAudio(this.WALKING_SOUND, 1, 1, false);
      }
      if (Math.abs(this.WALKING_SOUND.playbackRate - this.speedSound) > 0.01) {
        this.WALKING_SOUND.playbackRate = this.speedSound;
      }
    } else {
      if (!this.WALKING_SOUND.paused) {
        this.WALKING_SOUND.pause();
      }
    }
  }

  /**
   * Renamed and slightly optimized condition logic.
   */
  updateConditionLogic() {
    if (this.isDead()) return this.handleDeath();
    if (this.isHurt(0.7)) return this.handleHurt();
    if (this.isObjectAboveGround()) return this.handleAirborne();
    if (this.walkAnimationRequirements()) return this.handleWalk();
    this.resetWalkCounters();
  }

  /**
   * Handles idle animation timing.
   */
  updateIdleState() {
    if (this.shouldIdle()) {
      this.handleIdle();
    } else {
      this.longIdle = 0;
    }
  }

  /**
   * Checks if move up (jump) key is pressed.
   */
  canMoveUp() {
    return this.canJump();
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
    this.increasingSpeed();
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
    this.increasingSpeed();
  }

  /**
   * Makes the character jump and stops walking sound.
   */
  jump() {
    super.jump();
    this.justJumped = true;
    this.jumpAnimationPlayed = false;
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
   * Handles character behavior when airborne (jumping/falling).
   * Resets idle counter and manages jump animation state.
   */
  handleAirborne() {
    this.longIdle = 0;
    if (!this.jumpAnimationPlayed) {
      this.handleJump();
    }
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
   * Plays the jump animation sequence exactly once.
   * After completion, resumes normal animation checks.
   */
  handleJump() {
    this.jumpAnimationPlayed = true;
    this.currentImage = 0;
    const jumpInterval = setInterval(() => {
      if (this.currentImage < this.IMAGES_JUMPING.length) {
        let path = this.IMAGES_JUMPING[this.currentImage];
        this.img = IMAGE_CACHE[path];
        this.currentImage++;
      } else {
        clearInterval(jumpInterval);
      }
    }, 130);
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
    this.stopIncreasingSpeed();
    if (this.longIdle <= 20) {
      this.playAnimation(this.IMAGES_IDLE);
    } else {
      this.playAnimation(this.IMAGES_LONG_IDLE);
    }
    this.longIdle++;
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