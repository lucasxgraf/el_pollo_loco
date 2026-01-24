/**
 * @file StatusBarEndboss.class.js
 * @description Status bar UI element for displaying the endboss's health percentage.
 */

/**
 * Class representing an endboss health status bar.
 * Extends StatusBar to show the endboss's remaining health.
 */
class StatusBarEndboss extends StatusBar {
  IMAGES_STATUS_BAR = ALL_IMAGES.statusbars.IMAGES_STATUS_BAR_ENDBOSS;
  position_x = 500;
  position_y = 10;
  width = 200;
  height = 60;

  /**
   * Constructs a new StatusBarEndboss instance.
   * Loads images and initializes the percentage to 100 (full health).
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES_STATUS_BAR);
    this.setPercentage(100);
  }
}