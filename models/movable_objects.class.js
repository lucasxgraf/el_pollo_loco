class MovableObjects{
  position_x = 0;
  position_y = 180;
  img;

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