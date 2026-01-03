class Cloud extends MovableObjects{
  position_x = Math.random() * 500;
  position_y = 0;
  height = 100;
  width = 350;

  constructor(){
    super().loadImage('assets/img/5_background/layers/4_clouds/1.png');
  }
}