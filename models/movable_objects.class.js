class MovableObjects{
  position_x = 0;
  position_y = 180;
  img;
  imageCache = {};
  currentImage = 0;
  speed = 0.15;

  loadImage(imgPath){
    this.img = new Image();
    this.img.src = imgPath;
  }

  loadImages(arr){
    arr.forEach(path => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  moveRight(){
    console.log('Moving right');
  }

  moveLeft() {
    setInterval(() => {
      this.position_x -= this.speed;
      // if(this.position_x < -720){
      //   this.position_x = 720;
      // }
    }, 1000 / 60 );
  }
}