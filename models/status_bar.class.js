/**
 * @file StatusBar.class.js
 * @description Base class for status bars that visually represent a percentage value.
 */

/**
 * Class representing a status bar UI element.
 * Extends DrawableObject to handle image rendering.
 */
class StatusBar extends DrawableObject {
  percentage = 100;

  /**
   * Sets the percentage value and updates the displayed image accordingly.
   * @param {number} percentage - The new percentage value to display.
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    let path = this.IMAGES_STATUS_BAR[this.resolveImageIndex()];
    this.img = IMAGE_CACHE[path];
  }

  /**
   * Determines the index of the image to display based on the current percentage.
   * @returns {number} Index of the image in the IMAGES_STATUS_BAR array.
   */
  resolveImageIndex() {
    if (this.percentage == 100) {
      return 5;
    } else if (this.percentage >= 80) {
      return 4;
    } else if (this.percentage >= 60) {
      return 3;
    } else if (this.percentage >= 40) {
      return 2;
    } else if (this.percentage > 0) {
      return 1;
    } else {
      return 0;
    }
  }
}