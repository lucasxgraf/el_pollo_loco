class MovableObjects{
  position_x = 0;
  position_y = 180;
  img;
  height = 150;
  width = 100;
  imageCache = {};
  currentImage = 0;
  speed = 0.15;
  otherDirection = false;

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
    }, 1000 / 60 );
  }

  playAnimation(images){
    let i = this.currentImage % this.IMAGES_WALKING.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }
}