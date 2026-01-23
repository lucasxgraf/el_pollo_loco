class DrawableObject {
  position_x = 0;
  position_y = 180;
  height = 150;
  width = 100;
  img;
  imageCache = {};
  currentImage = 0;
  offset = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  }

  loadImage(imgPath){
    if (window.GLOBAL_IMAGE_CACHE && window.GLOBAL_IMAGE_CACHE[imgPath]) {
      this.img = window.GLOBAL_IMAGE_CACHE[imgPath];
    } else {
      this.img = new Image();
      this.img.src = imgPath;
    }
  }

  loadImages(arr){
    arr.forEach(path => {
      if (window.GLOBAL_IMAGE_CACHE && window.GLOBAL_IMAGE_CACHE[path]) {
        // benutze das vorab geladene Image-Objekt
        this.imageCache[path] = window.GLOBAL_IMAGE_CACHE[path];
      } else {
        let img = new Image();
        img.src = path;
        this.imageCache[path] = img;
      }
    });
  }

  drawObject(ctx){
    ctx.drawImage(this.img, this.position_x, this.position_y, this.width, this.height);
  }

  drawObjectHitbox(ctx){
    if(this instanceof Character || this instanceof Chicken || this instanceof SmallChicken || this instanceof Endboss) {
      ctx.beginPath();
      ctx.lineWidth = '3';
      ctx.strokeStyle = 'blue';
      ctx.rect(this.position_x, this.position_y, this.width, this.height);
      ctx.stroke();
    }
  }

  drawObjectHitboxOffset(ctx){
    if (this instanceof Character || this instanceof Chicken || this instanceof SmallChicken || this instanceof Endboss || this instanceof ThrowableObject || this instanceof Coin || this instanceof SalsaBottle) {
      ctx.beginPath();
      ctx.lineWidth = '3';
      ctx.strokeStyle = 'red';
      ctx.rect(this.position_x + this.offset.left, this.position_y + this.offset.top, this.width - this.offset.left - this.offset.right, this.height - this.offset.bottom - this.offset.top);
      ctx.stroke();
    }
  }
} 