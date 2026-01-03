class BackgroundObject extends MovableObjects{
  height = 155;
  width = 300;

  constructor(imgPath, x, y){
    super().loadImage(imgPath);

    this.position_x = x;
    this.position_y = y;
  }
}