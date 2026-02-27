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
  DEAD_SMALL_CHICKEN_SOUND = getAudioObject(SOUNDS.smallChicken.DEAD_SMALL_CHICKEN_SOUND);
  soundPlayed = false;

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
   * Main logic update for the small chicken.
   */
  update() {
    if (this.health <= 0) {
      this.handleDeath();
      return;
    }
    this.applyPhysics();
    this.moveLeft();
    
    // Periodical jump logic can be throttled or moved
    if (Math.random() < 0.005 && !this.isObjectAboveGround()) {
      this.speedGravityY = 20;
    }
  }

  /**
   * Main animation update for the small chicken.
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
      playAudio(this.DEAD_SMALL_CHICKEN_SOUND, 1);
      this.soundPlayed = true;
    }
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