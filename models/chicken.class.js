class Chicken extends MovableObjects{
  position_x = 120 + Math.random() * 600;
  position_y = 350;
  height = 75;
  width = 75;

  constructor(){
    super().loadImage('assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
  }

}