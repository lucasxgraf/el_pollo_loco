/**
 * @file MoveableObject.class.js
 * @description Base class for all movable objects in the game, providing physics, collision, and animation support.
 */

/**
 * Class representing a movable object with physics and animation capabilities.
 * Extends DrawableObject to inherit image rendering functionality.
 */
class MoveableObject extends DrawableObject {
  speed = 0.15;
  otherDirection = false;
  speedGravityY = 0;
  acceleration = 2.5;
  health = 100;
  lastHit = 0;
  
  /**
   * Applies gravity effect to the object, updating its vertical position.
   * This method should be called once per frame from a main loop.
   */
  updateGravity(dt = 1) {
    if (this.isObjectAboveGround() || this.speedGravityY > 0) {
      this.position_y -= this.speedGravityY * dt;
      this.speedGravityY -= this.acceleration * dt;
      this.resetCharacterOnGroundAfterJumpOnEnemy();
    } else {
      this.speedGravityY = 0;
    }
  }

  /**
   * Resets object to ground level after jumping on an enemy.
   * Adjusts position based on object type.
   */
  resetCharacterOnGroundAfterJumpOnEnemy() {
    if (!this.isObjectAboveGround() && this.speedGravityY <= 0) {
      this.speedGravityY = 0;
      if (this instanceof Character) {
        this.position_y = 180;
      } else if (this instanceof SmallChicken) {
        this.position_y = 360;
      } else if (this instanceof Chicken) {
        this.position_y = 350;
      } else if (this instanceof Endboss) {
        this.position_y = 60;
      } else {
        this.position_y = 180;
      }
    }
  }

  /**
   * Checks if the object is currently above the ground.
   * @returns {boolean} True if the object is above ground.
   */
  isObjectAboveGround() {
    if (this instanceof ThrowableObject) {
      return true;
    } else if (this instanceof Endboss) {
      return this.position_y < 60;
    } else {
      return this.position_y < 180;
    }
  }

  /**
   * Checks for collision with another movable object using axis-aligned bounding box (AABB).
   * Optimized with cached offset calculations.
   * @param {MoveableObject} moveableObject - The object to check collision against.
   * @returns {boolean} True if the objects are colliding.
   */
  isColliding(moveableObject) {
    const thisLeft = this.position_x + this.offset.left;
    const thisRight = thisLeft + (this.width - this.offset.left - this.offset.right);
    const thisTop = this.position_y + this.offset.top;
    const thisBottom = thisTop + (this.height - this.offset.top - this.offset.bottom);

    const otherLeft = moveableObject.position_x + moveableObject.offset.left;
    const otherRight = otherLeft + (moveableObject.width - moveableObject.offset.left - moveableObject.offset.right);
    const otherTop = moveableObject.position_y + moveableObject.offset.top;
    const otherBottom = otherTop + (moveableObject.height - moveableObject.offset.top - moveableObject.offset.bottom);

    return (
        thisRight > otherLeft &&
        thisBottom > otherTop &&
        thisLeft < otherRight &&
        thisTop < otherBottom
    );
  }

  /**
   * Moves the object to the right by its speed value.
   */
  moveRight(dt = 1) {
    this.position_x += this.speed * dt;
  }

  /**
   * Moves the object to the left by its speed value.
   */
  moveLeft(dt = 1) {
    this.position_x -= this.speed * dt;
  }

  /**
   * Initiates a jump by setting vertical speed.
   */
  jump() {
    this.speedGravityY = 25;
  }

  /**
   * Plays an animation sequence by cycling through an array of image paths.
   * @param {Array<string>} imagesArray - Array of image paths for the animation frames.
   */
  playAnimation(imagesArray) {
    let i = this.currentImage % imagesArray.length;
    let path = imagesArray[i];
    this.img = IMAGE_CACHE[path];
    this.currentImage++;
  }

  /**
   * Reduces the object's health and updates the last hit timestamp.
   */
  hit() {
    this.health -= 20;
    if (this.health < 0) {
      this.health = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  /**
   * Checks if the object's health has reached zero.
   * @returns {boolean} True if the object is dead.
   */
  isDead() {
    return this.health == 0;
  }

  /**
   * Checks if the object was recently hit (within the last second).
   * @returns {boolean} True if the object is in a hurt state.
   */
  isHurt() {
    let timePassed = new Date().getTime() - this.lastHit;
    timePassed = timePassed / 1000;
    return timePassed < 1;
  }
}