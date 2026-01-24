/**
 * @file StatusBarSalsaBottle.class.js
 * @description Status bar UI element for displaying collected salsa bottle count as a percentage.
 */

/**
 * Class representing a salsa bottle status bar.
 * Extends StatusBar to show the player's salsa bottle collection progress.
 */
class StatusBarSalsaBottle extends StatusBar {
  IMAGES_STATUS_BAR = ALL_IMAGES.statusbars.IMAGES_STATUS_BAR_SALSA_BOTTLE;
  position_x = 20;
  position_y = 100;
  width = 200;
  height = 60;

  /**
   * Constructs a new StatusBarSalsaBottle instance.
   * Loads images and initializes the percentage to 0.
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES_STATUS_BAR);
    this.setPercentage(0);
  }
}