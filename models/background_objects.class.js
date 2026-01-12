class BackgroundObject extends MoveableObject{
  height = 480;
  width = 720;

  constructor(imgPath, position_x, position_y){
    super().loadImage(imgPath);

    this.position_x = position_x;
    this.position_y = position_y;
  }
}