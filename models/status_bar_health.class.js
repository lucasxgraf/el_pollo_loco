/**
 * @file StatusBarHealth.class.js
 * @description Status bar UI element for displaying the player's health percentage.
 */

/**
 * Class representing a player health status bar.
 * Extends StatusBar to show the player's remaining health.
 */
class StatusBarHealth extends StatusBar {
  IMAGES_STATUS_BAR = ALL_IMAGES.statusbars.IMAGES_STATUS_BAR_HEALTH;
  position_x = 20;
  position_y = 0;
  width = 200;
  height = 60;

  /**
   * Constructs a new StatusBarHealth instance.
   * Loads images and initializes the percentage to 100 (full health).
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES_STATUS_BAR);
    this.setPercentage(100);
  }
}