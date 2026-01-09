class ThrowableObject extends MoveableObject {
  position_x = 100;
  position_y = 200;
  height = 75;
  width = 75;
  offset = { 
    top: 10, 
    left: 10, 
    right: 10, 
    bottom: 10 
  };
  
  constructor() {
    super().loadImage('assets/img/6_salsa_bottle/salsa_bottle.png');
    this.throw(this.position_x, this.position_y);
  }
  
  throw(position_x, position_y){
    this.position_x = position_x;
    this.position_y = position_y;
    this.speedGravityY = 25;
    this.applyGravity();
    setInterval(() => {
      this.position_x += 10;
    }, 25);
  }
}