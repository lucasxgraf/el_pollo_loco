/**
 * @file Cloud.class.js
 * @description Represents a cloud object that moves across the sky in the background.
 */

/**
 * Class representing a cloud background object.
 * Extends MoveableObject to inherit basic object properties and movement capabilities.
 */
class Cloud extends MoveableObject {
  position_x;
  position_y = 50;
  height = 250;
  width = 720;
  
  /**
   * Constructs a new Cloud instance.
   * @param {string} imagePath - Path to the cloud image file.
   * @param {number} position_x - Initial horizontal position of the cloud.
   */
  constructor(imagePath, position_x) {
    super().loadImage(imagePath);
    this.position_x = position_x;
    this.animate();
  }

  /**
   * Animates the cloud by moving it left continuously.
   * Resets position when it moves off-screen.
   */
  animate() {
    setInterval(() => {
      this.position_x -= this.speed;
      if (this.position_x + this.width < 0) {
        this.resetPosition();
      }
    }, 1000 / 60);
  }

  /**
   * Resets the cloud's position to the right side of the screen.
   */
  resetPosition() {
    this.position_x = 720 + this.width;
  }

  /**
   * Creates cloud objects for the sky background.
   */
  static createClouds() {
    const clouds = [];
    const cloudImages = ALL_IMAGES.clouds || ['assets/img/cloud1.png', 'assets/img/cloud2.png'];
    const numberOfClouds = 6;
    const cloudWidth = 720;
    const spacingBetweenClouds = cloudWidth;
    for (let i = 0; i < numberOfClouds; i++) {
      const imagePath = cloudImages[i % cloudImages.length];
      const position_x = i * spacingBetweenClouds + 720;
      clouds.push(new Cloud(imagePath, position_x));
    }
    return clouds;
  }
}