class SmallChicken extends MoveableObject {
  position_x = 120 + Math.random() * 1800;
  position_y = 365;
  height = 60;
  width = 60;
  IMAGES_WALKING = [
    'assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
    'assets/img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
    'assets/img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
  ];
  
  constructor(){
    super().loadImage('assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png');
    this.loadImages(this.IMAGES_WALKING);
    this.speed = 0.20 + Math.random() * 0.5;
    this.animate();
  }

  animate(){
    setInterval(() => {
      this.moveLeft();
    })

    setInterval(() => {
      this.playAnimation(this.IMAGES_WALKING);
    }, 100 );
  }
}