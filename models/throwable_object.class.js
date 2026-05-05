/**
 * @file ThrowableObject.class.js
 * @description Represents a throwable salsa bottle that can be launched by the character.
 * Extends MoveableObject to inherit positioning, animation, and physics capabilities.
 */

/**
 * Class representing a throwable salsa bottle object.
 * Handles throwing mechanics, animation, collision detection, and sound effects.
 * @extends MoveableObject
 */
class ThrowableObject extends MoveableObject {
  position_x = 100;
  position_y = 200;
  height = 75;
  width = 75;
  throwingDirection = world.character.otherDirection;
  animateBottleInterval;
  throwInterval;
  intervalCounter = 80;
  break = false;
  offset = {
    top: 10,
    left: 10,
    right: 10,
    bottom: 10,
  };
  IMAGES_BOTTLE_ROTATION = ALL_IMAGES.salsaBottlesRotation;
  IMAGES_BOTTLE_BREAK = ALL_IMAGES.salsaBottlesBreak;
  THROWING_SOUND = getAudioObject(SOUNDS.salsaBottle.THROWING_SOUND);

  /**
   * Constructs a new ThrowableObject instance.
   * Loads initial image, sets position, and initiates throwing and animation.
   * @param {number} position_x - Starting horizontal position.
   * @param {number} position_y - Starting vertical position.
   */
  constructor(position_x, position_y) {
    super().loadImage('assets/img/6_salsa_bottle/salsa_bottle.png');
    this.loadImages(this.IMAGES_BOTTLE_ROTATION);
    this.loadImages(this.IMAGES_BOTTLE_BREAK);
    this.position_x = position_x;
    this.position_y = position_y;
    this.throw();
  }

  /**
   * Called every frame by World.update() via requestAnimationFrame.
   * @param {number} frameCounter - Global frame counter from the world loop.
   */
  update(frameCounter, dt = 1) {
    if (this.break) {
      if (frameCounter % 5 === 0) this.playAnimation(this.IMAGES_BOTTLE_BREAK);
    } else {
      this.updateGravity(dt);
      this.updateHorizontalMovement(dt);
      if (frameCounter % 5 === 0) this.playAnimation(this.IMAGES_BOTTLE_ROTATION);
    }
  }

  /**
   * Updates horizontal position based on throwing direction.
   */
  updateHorizontalMovement(dt = 1) {
    if (this.throwingDirection) {
      this.position_x -= 7 * dt;
    } else {
      this.position_x += 7 * dt;
    }
  }

  /**
   * Initiates the throwing motion.
   */
  throw() {
    playAudio(this.THROWING_SOUND, 1, 0, true);
    this.speedGravityY = 25;
    world.character.longIdle = 0;
  }

  cleanup() {}
}