class BackgroundObject extends MoveableObject{
  height = 480;
  width = 720;

  constructor(imgPath, x, y){
    super().loadImage(imgPath);

    this.position_x = x;
    this.position_y = y;
  }
}