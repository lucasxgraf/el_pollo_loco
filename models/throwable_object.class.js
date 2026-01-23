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
    bottom: 10 
  };
  IMAGES_BOTTLE_ROTATION = ALL_IMAGES.salsaBottlesRotation;
  IMAGES_BOTTLE_BREAK = ALL_IMAGES.salsaBottlesBreak;

  THROWING_SOUND = new Audio (SOUNDS.salsaBottle.THROWING_SOUND);
  BREAKING_SOUND = new Audio (SOUNDS.salsaBottle.BREAKING_SOUND);

  constructor(position_x, position_y) {
    super().loadImage('assets/img/6_salsa_bottle/salsa_bottle.png');
    this.loadImages(this.IMAGES_BOTTLE_ROTATION);
    this.loadImages(this.IMAGES_BOTTLE_BREAK);
    this.position_x = position_x;
    this.position_y = position_y;
    this.throw();
    this.animate();
  }

  animate() {
    this.animateBottleInterval = setInterval(() => {
    if (this.break) {
      this.playAnimation(this.IMAGES_BOTTLE_BREAK);
    } else {
      this.playAnimation(this.IMAGES_BOTTLE_ROTATION);
    }
    }, this.intervalCounter);
  }
  
  throw(){
    playAudio(this.THROWING_SOUND, 1)
    this.speedGravityY = 25;
    this.applyGravity();
    world.character.longIdle = 0;
    this.throwInterval = setInterval(() => {
      if (this.direction) {
        this.position_x -= 7;
      } else {
        this.position_x += 7;
      }
    }, 25);
  }
}