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
   * Loads images.
   */
  constructor() {
    super().loadImage('assets/img/2_character_pepe/1_idle/idle/I-1.png');
    this.keyboard = keyboard;
    this.loadImagesCharacter();
    // Intervals removed for centralized loop (v5)
  }

  /**
   * Main logic update for the character, called every frame.
   */
  update() {
    if (this.isDead()) return;
    this.applyPhysics();
    this.handleMovement();
    this.updateCamera();
    this.updateWalkingSound();
    this.updateTimers();
  }

  /**
   * Main animation update for the character, called every frame.
   */
  animate() {
    if (this.isDead()) {
      this.playAnimation(this.IMAGES_DEAD);
      return;
    }
    if (this.isHurt(0.7)) {
      this.playAnimation(this.IMAGES_HURT);
      return;
    }
    if (this.isObjectAboveGround()) {
      this.playAnimation(this.IMAGES_JUMPING);
      return;
    }
    if (this.walkAnimationRequirements()) {
      this.handleWalk();
      return;
    }
    this.handleIdle();
  }

  /**
   * Updates character movement based on keyboard input.
   */
  handleMovement() {
    if (this.canMoveRight()) {
      this.moveRight();
    } else if (this.canMoveLeft()) {
      this.moveLeft();
    }

    if (this.canJump()) {
      this.jump();
      playAudio(this.JUMP_SOUND, 1);
    }
  }

  /**
   * Syncs camera with character position.
   */
  updateCamera() {
    this.world.camera_x = -this.position_x + 100;
  }

  /**
   * Manages walking sound state.
   */
  updateWalkingSound() {
    const isMoving = (this.keyboard.RIGHT || this.keyboard.LEFT) && !this.hurts;
    if (isMoving && !this.isObjectAboveGround()) {
      playAudio(this.WALKING_SOUND, 1, 1, false);
      const currentRate = this.WALKING_SOUND.playbackRate;
      if (Math.abs(currentRate - this.speedSound) > 0.05) {
        this.WALKING_SOUND.playbackRate = this.speedSound;
      }
    } else {
      this.WALKING_SOUND.pause();
    }
  }

  /**
   * Updates internal counters and timers (idle, cooldowns).
   */
  updateTimers() {
    if (this.shouldIdle()) {
      this.longIdle++;
    } else {
      this.longIdle = 0;
      this.increasingSpeed();
    }
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
   * Handles the walk animation with frame throttling logic.
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
    return (this.keyboard.RIGHT || (this.keyboard.LEFT && this.position_x > 0)) && 
           this.position_x < this.world.level.level_end_x;
  }

  /**
   * Makes the character jump backward when hurt.
   */
  backwardJump() {
    if (this.hurts) return;
    this.hurts = true;
    this.speed = 15;
    this.stopIncreasingSpeed();
    playAudio(this.HURT_SOUND, 1);
    
    // Slight backward movement handled here or could be moved to update loop
    // For now keeping it simple
    setTimeout(() => {
      this.hurts = false;
    }, 700);
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
   * Handles idle animation.
   */
  handleIdle() {
    this.stopIncreasingSpeed();
    if (this.longIdle <= 400) { // Adjusted for 60fps
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
      this.speed *= 1.002; // Adjusted for 60fps
      this.speedSound *= 1.002;
    }
  }

  /**
   * Resets the character's speed and walking sound playback rate.
   */
  stopIncreasingSpeed() {
    this.speed = 5;
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
}