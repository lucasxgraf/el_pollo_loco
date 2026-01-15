class Cloud extends MoveableObject {
  position_x;
  position_y = 50;
  height = 250;
  width = 720;

  constructor(imagePath, position_x) {
    super();
    this.position_x = position_x;
    this.loadImage(imagePath);
    this.animate();
  }

  animate() {
    setInterval(() => {
      this.position_x -= this.speed;
      if (this.position_x + this.width < 0) {
        this.resetPosition();
      }
    }, 1000 / 60);
  }

  resetPosition() {
    this.position_x = 720 + this.width;
  }
}