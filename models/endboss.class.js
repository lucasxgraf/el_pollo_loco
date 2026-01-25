/**
 * @file Endboss.class.js
 * @description Represents the end boss enemy with complex AI behavior including alert, walking, jumping, dashing, and death animations.
 */

/**
 * Class representing the end boss enemy.
 * Extends MoveableObject to inherit movement, animation, and physics.
 */
class Endboss extends MoveableObject {
  position_x = 3900;
  position_y = 50;
  height = 400;
  width = 400;
  speed = 15;
  meetCounter = -1;
  hadFirstContact = false;
  isDead = false;
  isJumping = false;
  isDashing = false;
  endbossDieAnimationStarted = false;
  healthInterval;
  animateEndbossInterval;
  endbossDieInterval;
  jumpInterval;
  dashInterval;
  offset = {
    top: 90,
    left: 40,
    right: 35,
    bottom: 10
  };

  IMAGES_ALERT = ALL_IMAGES.endboss.IMAGES_ALERT;
  IMAGES_WALKING = ALL_IMAGES.endboss.IMAGES_WALKING;
  IMAGES_ATTACK = ALL_IMAGES.endboss.IMAGES_ATTACK;
  IMAGES_HURT = ALL_IMAGES.endboss.IMAGES_HURT;
  IMAGES_DEAD = ALL_IMAGES.endboss.IMAGES_DEAD;
  ENDBOSS_SOUND = new Audio(SOUNDS.endboss.ENDBOSS_SOUND);
  ENDBOSS_DIE_SOUND = new Audio(SOUNDS.endboss.ENDBOSS_DIE_SOUND);
  ENDBOSS_HURT_SOUND = new Audio(SOUNDS.endboss.ENDBOSS_HURT_SOUND);

  /**
   * Constructs a new Endboss instance.
   * Loads initial image, all animation images, applies gravity, and starts animation.
   */
  constructor() {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadImagesEndboss();
    this.applyGravity();
    this.animate();
  }

  /**
   * Loads all endboss animation images.
   */
  loadImagesEndboss() {
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
  }

  /**
   * Starts endboss animation and health check intervals.
   */
  animate() {
    this.animateEndbossInterval = setInterval(() => {
      this.handleEndbossBehavior();
      this.checkFirstContact();
    }, 150);

    this.healthInterval = setInterval(() => {
      this.checkHealth();
    }, 200);
  }

  /**
   * Handles the endboss behavior based on its current state.
   * Manages death animation, alert state, walking, and combat actions.
   */
  handleEndbossBehavior() {
    if (this.isDead) {
      this.handleDeath();
      return;
    }

    this.endbossDieAnimationStarted = false;

    if (this.meetCounter < 16 && this.meetCounter >= 0) {
      this.endbossAlert();
    } else if (this.hadFirstContact && !this.isHurt(1.5)) {
      this.endbossWalking();
      this.randomJumpOrDash();
    } else if (this.hadFirstContact) {
      this.playAnimation(this.IMAGES_HURT);
    }
  }

  /**
   * Handles the endboss death state and starts the death animation if not already started.
   */
  handleDeath() {
    if (!this.endbossDieAnimationStarted) {
      this.endbossDieAnimationStarted = true;
      this.endbossDieAnimation();
    }
  }

  /**
   * Randomly triggers jump or dash attacks.
   */
  randomJumpOrDash() {
    const rand = Math.random();
    if (rand < 0.05) {
      this.jumpToCharacter();
    } else if (rand < 0.10) {
      this.dashToCharacter();
    }
  }

  /**
   * Checks for first contact with player to initiate alert phase.
   */
  checkFirstContact() {
    if (world.character.position_x >= this.position_x - 450 && !this.hadFirstContact) {
      this.firstContactWithEndboss();
    }
    if (world.character.x >= this.x - 900 && !this.hadFirstContact) {
      world.throwing = false;
    }
  }

  /**
   * Checks endboss health and handles death.
   */
  checkHealth() {
    if (this.health <= 0 && !this.isDead) {
      this.isDead = true;
      if (!this.endbossDieAnimationStarted) {
        this.endbossDieAnimationStarted = true;
        this.endbossDieAnimation();
      }
      stopAudio(this.ENDBOSS_SOUND);
      clearInterval(this.animateEndbossInterval);
      clearInterval(this.healthInterval);
      playAudio(this.ENDBOSS_DIE_SOUND, 0.5, 1);
    }
  }

  /**
   * Plays alert animation during meeting phase.
   */
  endbossAlert() {
    this.playAnimation(this.IMAGES_ALERT);
    this.meetCounter++;

    if (this.meetCounter == 14) {
      world.throwing = true;
    }
  }

  /**
   * Plays walking animation and moves endboss left.
   */
  endbossWalking() {
    this.playAnimation(this.IMAGES_WALKING);
    this.moveLeft();
  }

  /**
   * Initiates first contact with player, starting alert phase.
   */
  firstContactWithEndboss() {
    if (gameEnded) 
      return;

    this.meetCounter = 0;
    if (!mute) {
      playAudio(this.ENDBOSS_SOUND, 0.15, 0);
    }

    this.hadFirstContact = true;
    world.statusBarEndboss = new StatusBarEndboss();
  }

  /**
   * Makes the endboss jump toward the player.
   */
  jumpToCharacter() {
    if (!this.canJump()) 
      return;
    
    this.initiateJump();
    this.startJumpMovement();
  }

  /**
   * Checks if endboss can jump.
   * @returns {boolean} True if jump is allowed.
   */
  canJump() {
    return !this.isJumping && this.hadFirstContact && !this.isObjectAboveGround();
  }

  /**
   * Initiates the jump state.
   */
  initiateJump() {
    this.isJumping = true;
    this.speedGravityY = 35;
  }

  /**
   * Starts jump movement toward player.
   */
  startJumpMovement() {
    this.jumpInterval = setInterval(() => {
      const direction = world.character.position_x < this.position_x ? -1 : 1;
      const distance = Math.abs(world.character.position_x - this.position_x);
      
      if (this.isObjectAboveGround()) {
        this.handleJumpMovement(direction, distance);
      } else {
        this.endJump();
      }
    }, 1000 / 60);
  }

  /**
   * Handles jump movement physics.
   * @param {number} direction - Direction of movement (-1 for left, 1 for right).
   * @param {number} distance - Distance to player.
   */
  handleJumpMovement(direction, distance) {
    if (distance > 100) {
      this.position_x += direction * 15;
    }

    this.playAnimation(this.IMAGES_ATTACK);
  }

  /**
   * Ends the jump state.
   */
  endJump() {
    this.isJumping = false;
    clearInterval(this.jumpInterval);
  }

  /**
   * Makes the endboss dash toward the player.
   */
  dashToCharacter() {
    if (!this.canDash()) 
      return;
  
    this.initiateDash();
    this.startDashMovement();
  }

  /**
   * Checks if endboss can dash.
   * @returns {boolean} True if dash is allowed.
   */
  canDash() {
    return !this.isDashing && this.hadFirstContact;
  }

  /**
   * Initiates the dash state.
   */
  initiateDash() {
    this.isDashing = true;
    this.direction = world.character.position_x < this.position_x ? -1 : 1;
    this.originalSpeed = this.speed;
    this.speed = 30;
    this.dashDistance = 0;
    this.dashMax = 200;
    this.playAnimation(this.IMAGES_ATTACK);
  }

  /**
   * Starts dash movement toward player.
   */
  startDashMovement() {
    this.dashInterval = setInterval(() => {
      if (this.dashDistance < this.dashMax) {
        this.continueDash();
      } else {
        this.endDash();
      }
    }, 30);
  }

  /**
   * Continues dash movement.
   */
  continueDash() {
    this.position_x += this.direction * 5;
    this.dashDistance += 5;
  }

  /**
   * Ends the dash state.
   */
  endDash() {
    clearInterval(this.dashInterval);
    this.speed = this.originalSpeed;
    this.isDashing = false;
  }

  /**
   * Plays the death animation and ends the game.
   */
  endbossDieAnimation() {
    this.endbossDieInterval = setInterval(() => {
      this.playAnimation(this.IMAGES_DEAD);
    }, 700);
    
    this.endbossDieTimeout = setTimeout(() => {
      clearInterval(this.endbossDieInterval);
      if (gameRunning) {
        gameIsOver(true);
      }
    }, 2300);
  }

  /**
   * Resets the endboss to its initial state.
   * Clears all intervals and timeouts, resets properties, and restarts animation.
   */
  resetGameEndboss() {
    this.clearAllIntervals();
    this.clearTimeouts();
    this.resetProperties();
    this.restartAnimation();
  }

  /**
   * Clears all active intervals for the endboss.
   */
  clearAllIntervals() {
    clearInterval(this.animateEndbossInterval);
    clearInterval(this.healthInterval);
    clearInterval(this.jumpInterval);
    clearInterval(this.dashInterval);
    clearInterval(this.endbossDieInterval);
  }

  /**
   * Clears all active timeouts for the endboss.
   */
  clearTimeouts() {
    if (this.endbossDieTimeout) {
      clearTimeout(this.endbossDieTimeout);
    }
  }

  /**
   * Resets all endboss properties to their initial values.
   */
  resetProperties() {
    this.health = 100;
    this.meetCounter = -1;
    this.hadFirstContact = false;
    this.isDead = false;
    this.isJumping = false;
    this.isDashing = false;
    this.endbossDieAnimationStarted = false;
  }

  /**
   * Loads the initial walking image and restarts the animation.
   */
  restartAnimation() {
    this.loadImage(this.IMAGES_WALKING[0]);
    this.animate();
  }
}