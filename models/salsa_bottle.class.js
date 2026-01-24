/**
 * @file SalsaBottle.class.js
 * @description Represents a collectible salsa bottle object in the game world.
 */

/**
 * Class representing a collectible salsa bottle.
 * Extends MoveableObject to inherit basic object properties and methods.
 */
class SalsaBottle extends MoveableObject {
  position_x = 100 + Math.random() * 1800;
  position_y = 360;
  height = 70;
  width = 50;
  offset = {
    top: 12,
    left: 30,
    right: 30,
    bottom: 10
  };
  IMAGES_SALSA_BOTTLE = ALL_IMAGES.salsaBottles;

  /**
   * Constructs a new SalsaBottle instance.
   * Loads the initial image and all salsa bottle images.
   */
  constructor() {
    super().loadImage('assets/img/6_salsa_bottle/1_salsa_bottle_on_ground.png');
    this.loadImages(this.IMAGES_SALSA_BOTTLE);
  }
}