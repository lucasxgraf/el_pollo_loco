/**
 * @file Coin.class.js
 * @description Represents a collectible coin object in the game world.
 */

/**
 * Class representing a collectible coin.
 * Extends MoveableObject to inherit basic object properties and methods.
 */
class Coin extends MoveableObject {
  position_x = 100;
  position_y = 170;
  width = 100;
  height = 100;
  offset = {
    top: 65,
    left: 35,
    right: 35,
    bottom: 65
  };
  IMAGES_ROTATE = ALL_IMAGES.coins;

  /**
   * Constructs a new Coin instance.
   * @param {number} x - Horizontal position of the coin.
   * @param {number} y - Vertical position of the coin.
   * @param {boolean} [isMiddle=false] - Whether the coin is positioned in the middle (affects Y position).
   */
  constructor(x, y, isMiddle = false) {
    super().loadImage(isMiddle ? 'assets/img/8_coin/coin_2.png' : 'assets/img/8_coin/coin_1.png');
    this.loadImages(this.IMAGES_ROTATE);
    this.position_x = x;
    this.position_y = y;
    if (isMiddle) {
      this.position_y = y - 20;
    }
  }
}