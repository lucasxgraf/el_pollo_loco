class Chicken extends MovableObjects{
  position_x = 100 + Math.random() * 500;
  position_y = 100;
  height = 30;
  width = 30;

  constructor(){
    super().loadImage('assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png');
  }

}