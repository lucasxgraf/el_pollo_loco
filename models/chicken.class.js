class Chicken extends MovableObjects{
  position_x = 120 + Math.random() * 600;
  position_y = 350;
  height = 75;
  width = 75;
  IMAGES_WALKING_CHICKEN = [
    'assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
    'assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
    'assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
  ];
  
  constructor(){
    super().loadImage('assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
    this.loadImages(this.IMAGES_WALKING_CHICKEN);
    this.speed = 0.15 + Math.random() * 0.5;

    this.animate();
  }

  animate(){

    this.moveLeft();
    setInterval(() => {
      let i = this.currentImage % this.IMAGES_WALKING_CHICKEN.length;
      let path = this.IMAGES_WALKING_CHICKEN[i];
      this.img = this.imageCache[path];
      this.currentImage++;
    }, 100 );
  }
}