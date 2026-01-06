class Cloud extends MoveableObject{
  position_x = Math.random() * 720;
  position_y = 0;
  height = 480;
  width = 720;

  constructor(){
    super().loadImage('assets/img/5_background/layers/4_clouds/1.png');
    this.animate();
  }

  animate(){
    setInterval(() => {
      this.position_x -= this.speed;
    }, 1000 / 60 );
  }
}