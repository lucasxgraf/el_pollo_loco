class Chicken extends MoveableObject{
  position_x = 120 + Math.random() * 3600;
  position_y = 350;
  height = 75;
  width = 75;
  isDead = false;
  animateChickenInterval;
  health = 10;
  offset = { 
    top: 10, 
    left: 10, 
    right: 10, 
    bottom: 10 
  }
  IMAGES_WALKING = ALL_IMAGES.chicken.IMAGES_WALKING;
  IMAGES_DEAD = ALL_IMAGES.chicken.IMAGES_DEAD;

  DEAD_CHICKEN_SOUND = new Audio(SOUNDS.chicken.DEAD_CHICKEN_SOUND);
  soundPlayed = false;
  
  constructor(){
    super().loadImage('assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
    this.speed = 0.15 + Math.random() * 0.5;
    this.animate();
  }

  animate() {
    this.startMovement();
    this.startAnimation();
  }
  
  startMovement() {
    this.animateChickenInterval = setInterval(() => {
      this.moveLeft();
    }, 1000 / 60);
  }
  
  startAnimation() {
    setInterval(() => {
      if (this.health <= 0) {
        this.handleDeath();
      } else {
        this.playAnimation(this.IMAGES_WALKING);
      }
    }, 100);
  }
  
  handleDeath() {
    if (!this.soundPlayed) {
      playAudio(this.DEAD_CHICKEN_SOUND, 1, 0);
      this.soundPlayed = true;
    }

    this.playAnimation(this.IMAGES_DEAD);
    clearInterval(this.animateChickenInterval);
    this.isDead = true;
  }
}