/**
 * @file StatusBarCoin.class.js
 * @description Status bar UI element for displaying collected coin count as a percentage.
 */

/**
 * Class representing a coin status bar.
 * Extends StatusBar to show the player's coin collection progress.
 */
class StatusBarCoin extends StatusBar {
  IMAGES_STATUS_BAR = ALL_IMAGES.statusbars.IMAGES_STATUS_BAR_COIN;
  position_x = 20;
  position_y = 50;
  width = 200;
  height = 60;
  
  /**
   * Constructs a new StatusBarCoin instance.
   * Loads images and initializes the percentage to 0.
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES_STATUS_BAR);
    this.setPercentage(0);
  }
}