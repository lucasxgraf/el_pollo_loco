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
  IMAGES_BOTTLE_ROTATION = [
    'assets/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
    'assets/img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
    'assets/img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
    'assets/img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
  ];
  IMAGES_BOTTLE_BREAK = [
    'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
    'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
    'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
    'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
    'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
    'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
  ];
  throwing_sound = new Audio('assets/sound/throwing.mp3');
  breaking_sound = new Audio('assets/sound/breaking_bottle.mp3');

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
    playAudio(this.throwing_sound, 1)
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