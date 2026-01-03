class MovableObjects{
  position_x = 0;
  position_y = 45;
  img;
  height = 100;
  width = 50;

  loadImage(imgPath){
    this.img = new Image();
    this.img.src = imgPath;
  }

  moveRight(){
    console.log('Moving right');
  }

  moveLeft() {
  
  }
}