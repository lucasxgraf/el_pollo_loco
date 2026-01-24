/**
 * @file DrawableObject.class.js
 * @description Base class for all drawable objects in the game, handling image loading, rendering, and hitbox visualization.
 */

/**
 * Class representing a drawable object with image rendering capabilities.
 * Provides methods for loading images, drawing objects, and visualizing hitboxes.
 */
class DrawableObject {
  position_x = 0;
  position_y = 180;
  height = 150;
  width = 100;
  img;
  images = [];
  currentImage = 0;
  offset = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  };

  /**
   * Loads a single image from a path, using cache if available.
   * @param {string} path - Path to the image file.
   */
  loadImage(path) {
    if (IMAGE_CACHE && IMAGE_CACHE[path]) {
      this.img = IMAGE_CACHE[path];
    } else {
      this.img = new Image();
      this.img.src = path;
      if (IMAGE_CACHE) {
        IMAGE_CACHE[path] = this.img;
      }
    }
  }

  /**
   * Loads multiple images from an array of paths, using cache if available.
   * @param {Array<string>} arr - Array of image paths to load.
   */
  loadImages(arr) {
    arr.forEach((path) => {
      if (IMAGE_CACHE && IMAGE_CACHE[path]) {
        this.images.push(IMAGE_CACHE[path]);
      } else {
        let img = new Image();
        img.src = path;
        this.images.push(img);
        if (IMAGE_CACHE) {
          IMAGE_CACHE[path] = img;
        }
      }
    });
  }

  /**
   * Draws the object's current image onto the canvas context.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   */
  drawObject(ctx) {
    if (this.img) {
      ctx.drawImage(this.img, this.position_x, this.position_y, this.width, this.height);
    }
  }

  /**
   * Draws a blue bounding box around the object for debugging collision detection.
   * Only applies to specific game entities.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   */
  drawObjectHitbox(ctx) {
    if (
      this instanceof Character ||
      this instanceof Chicken ||
      this instanceof SmallChicken ||
      this instanceof Endboss
    ) {
      ctx.beginPath();
      ctx.lineWidth = '3';
      ctx.strokeStyle = 'blue';
      ctx.rect(this.position_x, this.position_y, this.width, this.height);
      ctx.stroke();
    }
  }

  /**
   * Draws a red offset-adjusted hitbox around the object for precise collision detection.
   * Applies to various game entities.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   */
  drawObjectHitboxOffset(ctx) {
    if (
      this instanceof Character ||
      this instanceof Chicken ||
      this instanceof SmallChicken ||
      this instanceof Endboss ||
      this instanceof ThrowableObject ||
      this instanceof Coin ||
      this instanceof SalsaBottle
    ) {
      ctx.beginPath();
      ctx.lineWidth = '3';
      ctx.strokeStyle = 'red';
      ctx.rect(
        this.position_x + this.offset.left,
        this.position_y + this.offset.top,
        this.width - this.offset.left - this.offset.right,
        this.height - this.offset.bottom - this.offset.top
      );
      ctx.stroke();
    }
  }
}