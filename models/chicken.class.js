/**
 * @file Chicken.class.js
 * @description Represents a chicken enemy with movement, animation, and death handling.
 */

/**
 * Class representing a chicken enemy.
 * Extends MoveableObject to inherit movement and animation capabilities.
 */
class Chicken extends MoveableObject {
  position_x = 120 + Math.random() * 3600;
  position_y = 350;
  height = 75;
  width = 75;
  isDead = false;
  animateChickenInterval;
  health = 10;
  offset = {
    top: 10,
    left: 10,
    right: 10,
    bottom: 10
  };
  IMAGES_WALKING = ALL_IMAGES.chicken.IMAGES_WALKING;
  IMAGES_DEAD = ALL_IMAGES.chicken.IMAGES_DEAD;
  soundPlayed = false;

  /**
   * Constructs a new Chicken instance.
   * Loads images, sets speed, and starts animation.
   */
  constructor() {
    super().loadImage('assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
    this.speed = 0.15 + Math.random() * 0.5;
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
  }

  cleanup() {}

  /**
   * Handles the death animation, sound, and stops movement.
   * Plays death sound only once.
   */
  handleDeath() {
    if (!this.soundPlayed) {
      playAudio(SOUNDS.chicken.DEAD_CHICKEN_SOUND, 1, 0);
      this.soundPlayed = true;
    }
    this.playAnimation(this.IMAGES_DEAD);
    clearInterval(this.animateChickenInterval);
    this.isDead = true;
  }
}