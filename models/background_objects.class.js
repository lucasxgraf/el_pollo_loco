/**
 * @file BackgroundObject.class.js
 * @description Represents a static background object for parallax scrolling effects.
 */

/**
 * Class representing a background object.
 * Extends MoveableObject to inherit basic object properties and rendering capabilities.
 */
class BackgroundObject extends MoveableObject {
  height = 480;
  width = 720;
  
  /**
   * Constructs a new BackgroundObject instance.
   * @param {string} imgPath - Path to the background image file.
   * @param {number} position_x - Horizontal position of the background object.
   * @param {number} position_y - Vertical position of the background object.
   */
  constructor(imgPath, position_x, position_y) {
    super().loadImage(imgPath);

    this.position_x = position_x;
    this.position_y = position_y;
  }

  /**
 * Creates and populates the background objects for the level.
 * Iterates through positions to place multiple layers of background images.
 */
  static createBackgroundObjects() {
    const backgroundObjects = [];
    const layers = [
      'assets/img/5_background/layers/air.png',
      'assets/img/5_background/layers/3_third_layer/',
      'assets/img/5_background/layers/2_second_layer/',
      'assets/img/5_background/layers/1_first_layer/',
    ];
  
    for (let i = -1; i < 7; i++) {
      const xPos = i * 719;
      const variant = i % 2 === 0 ? '1.png' : '2.png';
  
      backgroundObjects.push(new BackgroundObject(layers[0], xPos, 0));
      backgroundObjects.push(new BackgroundObject(layers[1] + variant, xPos, 0));
      backgroundObjects.push(new BackgroundObject(layers[2] + variant, xPos, 0));
      backgroundObjects.push(new BackgroundObject(layers[3] + variant, xPos, 0));
    }
    return backgroundObjects;
  }
}