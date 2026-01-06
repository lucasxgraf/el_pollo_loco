class Chicken extends MovableObjects{
  position_x = 120 + Math.random() * 1800;
  position_y = 350;
  height = 75;
  width = 75;
  IMAGES_WALKING = [
    'assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
    'assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
    'assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
  ];
  
  constructor(){
    super().loadImage('assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
    this.loadImages(this.IMAGES_WALKING);
    this.speed = 0.15 + Math.random() * 0.5;
    this.animate();
  }

  animate(){
    this.moveLeft();
    setInterval(() => {
      this.playAnimation(this.IMAGES_WALKING);
    }, 100 );
  }
}