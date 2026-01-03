class MovableObjects{
  position_x = 100;
  position_y = 0;
  img;
  height = 150;
  width = 100;

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