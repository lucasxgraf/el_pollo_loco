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
  IMAGES_WALKING = ALL_IMAGES.smallChicken.IMAGES_WALKING;
  IMAGES_DEAD = ALL_IMAGES.smallChicken.IMAGES_DEAD;

  DEAD_SMALL_CHICKEN_SOUND = new Audio (SOUNDS.smallChicken.DEAD_SMALL_CHICKEN_SOUND);
  soundPlayed = false;
  
  constructor(){
    super().loadImage('assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png');
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
    this.speed = 0.20 + Math.random() * 0.5;
    this.position_y = 360;
    this.animate();
    this.applyGravity();
  }

  animate() {
    this.startMovement();
    this.startAnimation();
    this.startGravity();
  }
  
  startMovement() {
    this.animateChickenInterval = setInterval(() => {
      this.moveLeft();
    }, 1000 / 60);
  }
  
  startAnimation() {
    setInterval(() => {
      if (this.health <= 0) {
        this._handleDeath();
      } else {
        this.playAnimation(this.IMAGES_WALKING);
      }
    }, 100);
  }
  
  startGravity() {
    setInterval(() => {
      if (!this.isDead) this.speedGravityY = 20;
    }, 3000);
  }
  
  handleDeath() {
    this.playAnimation(this.IMAGES_DEAD);
    
    if (!this.soundPlayed) {
      playAudio(this.DEAD_SMALL_CHICKEN_SOUND, 1);
      this.soundPlayed = true;
    }

    clearInterval(this.animateChickenInterval);
    this.isDead = true;
  }

  isObjectAboveGround(){  
    return this.position_y < 360;
  }
}