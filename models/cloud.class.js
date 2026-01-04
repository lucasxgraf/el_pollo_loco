class Cloud extends MovableObjects{
  position_x = Math.random() * 720;
  position_y = 0;
  height = 480;
  width = 720;

  constructor(){
    super().loadImage('assets/img/5_background/layers/4_clouds/1.png');
  }
}