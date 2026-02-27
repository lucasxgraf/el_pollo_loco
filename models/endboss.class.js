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
  ENDBOSS_SOUND = getAudioObject(SOUNDS.endboss.ENDBOSS_SOUND);
  ENDBOSS_DIE_SOUND = getAudioObject(SOUNDS.endboss.ENDBOSS_DIE_SOUND);
  ENDBOSS_HURT_SOUND = getAudioObject(SOUNDS.endboss.ENDBOSS_HURT_SOUND);
  
  /**
   * Constructs a new Endboss instance.
   * Loads images.
   */
  constructor() {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadImagesEndboss();
    // Intervals removed for centralized loop (v5)
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
   * Main logic update for the endboss.
   */
  update() {
    if (this.isDead) {
      this.handleDeathLogic();
      return;
    }
    
    this.applyPhysics();
    this.checkFirstContact();
    this.handleAI();
    this.handleAttacks();
  }

  /**
   * Main animation update for the endboss.
   */
  animate() {
    if (this.isDead) {
      this.playAnimation(this.IMAGES_DEAD);
      return;
    }
    
    if (this.meetCounter < 16 && this.meetCounter >= 0) {
      this.playAnimation(this.IMAGES_ALERT);
    } else if (this.hadFirstContact && !this.isHurt(1.5)) {
      if (this.isJumping || this.isDashing) {
        this.playAnimation(this.IMAGES_ATTACK);
      } else {
        this.playAnimation(this.IMAGES_WALKING);
      }
    } else if (this.hadFirstContact) {
      this.playAnimation(this.IMAGES_HURT);
    }
  }

  /**
   * Handles high-level AI state transitions.
   */
  handleAI() {
    if (this.meetCounter < 16 && this.meetCounter >= 0) {
      this.meetCounter++;
      if (this.meetCounter == 14) world.throwing = true;
    } else if (this.hadFirstContact && !this.isHurt(1.5) && !this.isJumping && !this.isDashing) {
      this.moveLeft();
      this.randomAttackTrigger();
    }
  }

  /**
   * Handles ongoing attack movement (Jump/Dash).
   */
  handleAttacks() {
    if (this.isJumping) {
      this.continueJump();
    } else if (this.isDashing) {
      this.continueDashAction();
    }
  }

  /**
   * Randomly triggers jump or dash attacks.
   */
  randomAttackTrigger() {
    if (Math.random() < 0.01) {
      const rand = Math.random();
      if (rand < 0.5) this.initiateJumpAction();
      else this.initiateDashAction();
    }
  }

  /**
   * Initiates the jump state.
   */
  initiateJumpAction() {
    if (this.isObjectAboveGround()) return;
    this.isJumping = true;
    this.speedGravityY = 35;
    this.jumpTargetX = world.character.position_x < this.position_x ? -1 : 1;
  }

  /**
   * Continues the jump movement logic.
   */
  continueJump() {
    if (this.isObjectAboveGround()) {
      const distance = Math.abs(world.character.position_x - this.position_x);
      if (distance > 100) {
        this.position_x += this.jumpTargetX * 15;
      }
    } else {
      this.isJumping = false;
    }
  }

  /**
   * Initiates the dash state.
   */
  initiateDashAction() {
    this.isDashing = true;
    this.dashDirection = world.character.position_x < this.position_x ? -1 : 1;
    this.dashDistance = 0;
    this.dashMax = 200;
  }

  /**
   * Continues the dash movement logic.
   */
  continueDashAction() {
    if (this.dashDistance < this.dashMax) {
      this.position_x += this.dashDirection * 15;
      this.dashDistance += 15;
    } else {
      this.isDashing = false;
    }
  }

  /**
   * Handles death sound and flag.
   */
  handleDeathLogic() {
    if (!this.soundPlayed) {
      playAudio(this.ENDBOSS_DIE_SOUND, 0.5, 0);
      this.soundPlayed = true;
    }
  }

  /**
   * Checks for first contact with player to initiate alert phase.
   */
  checkFirstContact() {
    if (world.character.position_x >= this.position_x - 450 && !this.hadFirstContact) {
      this.firstContactWithEndboss();
    }
  }

  /**
   * Initiates first contact with player, starting alert phase.
   */
  firstContactWithEndboss() {
    if (gameEnded) return;
    this.meetCounter = 0;
    if (!mute) {
      playAudio(this.ENDBOSS_SOUND, 0.15, 0);
    }
    this.hadFirstContact = true;
    world.statusBarEndboss = new StatusBarEndboss();
  }

  /**
   * Resets the endboss to its initial state.
   */
  resetGameEndboss() {
    stopAudio(this.ENDBOSS_SOUND);
    this.resetProperties();
    this.loadImage(this.IMAGES_WALKING[0]);
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
    this.soundPlayed = false;
  }

  /**
   * Placeholder for cleanup (intervals removed).
   */
  cleanup() {
    stopAudio(this.ENDBOSS_SOUND);
    stopAudio(this.ENDBOSS_DIE_SOUND);
    stopAudio(this.ENDBOSS_HURT_SOUND);
  }
}