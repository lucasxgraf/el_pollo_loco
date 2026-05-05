/**
 * @file SmallChicken.class.js
 * @description Represents a small chicken enemy with movement, animation, gravity, and death handling.
 */

/**
 * Class representing a small chicken enemy.
 * Extends MoveableObject to inherit movement and animation capabilities.
 */
class SmallChicken extends MoveableObject {
  position_x = 120 + Math.random() * 3600;
  position_y = 180;
  height = 60;
  width = 60;
  isDead = false;
  animateChickenInterval;
  health = 10;
  offset = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  };
  IMAGES_WALKING = ALL_IMAGES.smallChicken.IMAGES_WALKING;
  IMAGES_DEAD = ALL_IMAGES.smallChicken.IMAGES_DEAD;
  soundPlayed = false;
  gravityCounter = 0;

  /**
   * Constructs a new SmallChicken instance.
   * Loads images, sets speed and position, and starts animation and gravity.
   */
  constructor() {
    super().loadImage('assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png');
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
    this.speed = 0.20 + Math.random() * 0.5;
    this.position_y = 360;
  }

  /**
   * Called every frame by World.update() via requestAnimationFrame.
   * @param {number} frameCounter - Global frame counter from the world loop.
   */
  update(frameCounter, dt = 1) {
    if (this.isDead) return;
    if (this.health <= 0) {
      this.handleDeath();
      return;
    }
    this.moveLeft(dt);
    this.updateGravity(dt);
    if (frameCounter % 6 === 0) this.playAnimation(this.IMAGES_WALKING);
    this.gravityCounter++;
    if (this.gravityCounter >= 180) {
      this.speedGravityY = 20;
      this.gravityCounter = 0;
    }
  }

  cleanup() {}

  /**
   * Handles the death animation, sound, and stops movement.
   * Plays death sound only once.
   */
  handleDeath() {
    this.playAnimation(this.IMAGES_DEAD);
    if (!this.soundPlayed) {
      playAudio(SOUNDS.smallChicken.DEAD_SMALL_CHICKEN_SOUND, 1);
      this.soundPlayed = true;
    }
    clearInterval(this.animateChickenInterval);
    this.isDead = true;
  }

  /**
   * Checks if the chicken is above the ground level.
   * @returns {boolean} True if the chicken is above ground.
   */
  isObjectAboveGround() {
    return this.position_y < 360;
  }
}