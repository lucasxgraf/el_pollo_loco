class SmallChicken extends MoveableObject {
  position_x = 120 + Math.random() * 3600;
  position_y = 180;
  height = 60;
  width = 60;
  isDead = false;
  animateChickenInterval;
  health = 10;
  offset = { 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0 
  }
  IMAGES_WALKING = [
    'assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
    'assets/img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
    'assets/img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
  ];
  IMAGES_DEAD = [
    'assets/img/3_enemies_chicken/chicken_small/2_dead/dead.png'
  ];
  soundPlayed = false;
  dead_small_chicken_sound = new Audio('assets/sound/chicken_small.mp3');
  
  constructor(){
    super().loadImage('assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png');
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
    this.speed = 0.20 + Math.random() * 0.5;
    this.position_y = 360;
    this.animate();
    this.applyGravity();
  }

  animate(){
    this.animateChickenInterval = setInterval(() => {
      this.moveLeft();
    }, 1000 / 60)

    setInterval(() => {
      if (this.health <= 0) {
        this.playAnimation(this.IMAGES_DEAD);
        if (!this.soundPlayed) {
          playAudio(this.dead_small_chicken_sound, 1);
          this.soundPlayed = true;
        }
        clearInterval(this.animateChickenInterval);
        this.isDead = true;
      } else {
        this.playAnimation(this.IMAGES_WALKING);
      }
    }, 100 );

    setInterval(() => {
      if (!this.isDead)
          this.speedGravityY = 20;
    }, 3000)
  }

  isObjectAboveGround(){  
    return this.position_y < 360;
  }
}