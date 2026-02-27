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
  DEAD_CHICKEN_SOUND = getAudioObject(SOUNDS.chicken.DEAD_CHICKEN_SOUND);
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
   * Main logic update for the chicken.
   */
  update() {
    if (this.health <= 0) {
      this.handleDeath();
      return;
    }
    this.moveLeft();
  }

  /**
   * Main animation update for the chicken.
   */
  animate() {
    if (this.health <= 0) {
      this.playAnimation(this.IMAGES_DEAD);
    } else {
      this.playAnimation(this.IMAGES_WALKING);
    }
  }

  /**
   * Handles the death state and sound.
   */
  handleDeath() {
    if (!this.soundPlayed) {
      playAudio(this.DEAD_CHICKEN_SOUND, 1, 0);
      this.soundPlayed = true;
    }
    this.isDead = true;
  }
}