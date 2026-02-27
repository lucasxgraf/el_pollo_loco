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
  BREAKING_SOUND = getAudioObject(SOUNDS.salsaBottle.BREAKING_SOUND);

  /**
   * Constructs a new ThrowableObject instance.
   * Loads images and initiates throwing.
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
   * Main logic update for the bottle.
   */
  update() {
    this.applyPhysics();
    if (this.direction) {
      this.position_x -= 7;
    } else {
      this.position_x += 7;
    }
  }

  /**
   * Main animation update for the bottle.
   */
  animate() {
    if (this.break) {
      this.playAnimation(this.IMAGES_BOTTLE_BREAK);
    } else {
      this.playAnimation(this.IMAGES_BOTTLE_ROTATION);
    }
  }

  /**
   * Initiates the throwing motion logic.
   */
  throw() {
    playAudio(this.THROWING_SOUND, 1);
    this.speedGravityY = 25;
    world.character.longIdle = 0;
  }

  /**
   * Cleans up throwable object sounds.
   */
  cleanup() {
    stopAudio(this.SPLASH_SOUND);
  }
}