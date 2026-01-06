class MoveableObject extends DrawableObject {
  speed = 0.15;
  otherDirection = false;
  speedGravityY = 0;
  acceleration = 2.5;
  health = 100;
  lastHit = 0;

  applyGravity(){
    setInterval(() => {
      if (this.isCharacterAboveGround() || this.speedGravityY > 0)
        this.position_y -= this.speedGravityY;
        this.speedGravityY -= this.acceleration;
    } , 1000 / 25);
  }

  isCharacterAboveGround(){  
    return this.position_y < 180;
  }

  drawObjectHitbox(ctx){
    if(this instanceof Character || this instanceof Chicken || this instanceof SmallChicken || this instanceof  Endboss){
      ctx.beginPath();
      ctx.lineWidth = '3';
      ctx.strokeStyle = 'blue';
      ctx.rect(this.position_x, this.position_y, this.width, this.height);
      ctx.stroke();
    }
  }

  isColliding(moveableObject){
    return this.position_x + this.width > moveableObject.position_x &&
           this.position_y + this.height > moveableObject.position_y &&
           this.position_x < moveableObject.position_x + moveableObject.width &&
           this.position_y < moveableObject.position_y + moveableObject.height;
  }

  moveRight(){
    this.position_x += this.speed;
    this.otherDirection = false;
  }

  moveLeft() {
    this.position_x -= this.speed;
  }

  jump(){
    this.speedGravityY = 30;
  }

  playAnimation(images){
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  hit(){
    this.health -= 10;
    if(this.health < 0){
      this.health = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  isDead(){
    return this.health == 0;
  }

  isHurt(){
    let timePassed = new Date().getTime() - this.lastHit;
    timePassed = timePassed / 1000;
    return timePassed < 1;
  }
}