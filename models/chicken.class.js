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
  IMAGES_WALKING = [
    'assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
    'assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
    'assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
  ];
  IMAGES_DEAD = [
    'assets/img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
  ];
  dead_chicken_sound = new Audio('assets/sound/chicken.mp3');
  soundPlayed = false;
  
  constructor(){
    super().loadImage('assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
    this.speed = 0.15 + Math.random() * 0.5;
    this.animate();
  }

  animate(){
    this.animateChickenInterval = setInterval(() => {
      this.moveLeft();
    }, 1000 / 60 );

    setInterval(() => {
      if (this.health <= 0) {
        if (!this.soundPlayed) {
          playAudio(this.dead_chicken_sound, 1, 0);
          this.soundPlayed = true;
        }
        this.playAnimation(this.IMAGES_DEAD);
        clearInterval(this.animateChickenInterval);
        this.isDead = true;
      } else {
        this.playAnimation(this.IMAGES_WALKING);
      }
    }, 100 );
  }
}