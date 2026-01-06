class DrawableObject {
  position_x = 0;
  position_y = 180;
  height = 150;
  width = 100;
  img;
  imageCache = {};
  currentImage = 0;

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

  drawObject(ctx){
    ctx.drawImage(this.img, this.position_x, this.position_y, this.width, this.height);
  }
}