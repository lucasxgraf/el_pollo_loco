class MoveableObject extends DrawableObject {
  speed = 0.15;
  otherDirection = false;
  speedGravityY = 0;
  acceleration = 2.5;
  health = 100;
  lastHit = 0;

  applyGravity(){
    setInterval(() => {
      if (this.isObjectAboveGround() || this.speedGravityY > 0) {
        this.position_y -= this.speedGravityY;
        this.speedGravityY -= this.acceleration;
        this.resetCharacterOnGroundAfterJumpOnEnemy();
      } else {
        this.speedGravityY = 0;
      }
    } , 1000 / 25);
  }

  resetCharacterOnGroundAfterJumpOnEnemy() {
    if (!this.isObjectAboveGround() && this.speedGravityY <= 0) {
      this.speedGravityY = 0;
      if (this instanceof Character) {
        this.position_y = 180;
      } else if (this instanceof SmallChicken) {
        this.position_y = 360;
      } else if (this instanceof Chicken) {
        this.position_y = 350;
      } else if (this instanceof Endboss) {
        this.position_y = 60;
      } else {
        this.position_y = 180;
      }
    }
  }

  isObjectAboveGround() {
    if (this instanceof ThrowableObject) {
      return true;
    } else if (this instanceof Endboss) {
      return this.position_y < 60;
    } else {
      return this.position_y < 180;
    }
  }

  isColliding(moveableObject){
    return this.position_x + this.offset.left + (this.width - this.offset.left - this.offset.right) > moveableObject.position_x + moveableObject.offset.left &&
      this.position_y + this.offset.top + (this.height - this.offset.top - this.offset.bottom) > moveableObject.position_y + moveableObject.offset.top &&
      this.position_x + this.offset.left < moveableObject.position_x + moveableObject.offset.left + (moveableObject.width - moveableObject.offset.left - moveableObject.offset.right) &&
      this.position_y + this.offset.top < moveableObject.position_y + moveableObject.offset.top + (moveableObject.height - moveableObject.offset.top - moveableObject.offset.bottom);
  }

  moveRight(){
    this.position_x += this.speed;
  }

  moveLeft() {
    this.position_x -= this.speed;
  }

  jump(){
    this.speedGravityY = 25;
  }

  playAnimation(images){
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  hit(){
    this.health -= 20;
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