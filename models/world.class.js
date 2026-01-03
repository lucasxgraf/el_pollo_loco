class World {
  character = new Character();
  enemies = [
    new Chicken(),
    new Chicken(),
    new Chicken(),
  ];
  clouds = [
    new Cloud()
  ];
  backgroundObjects = [
    new BackgroundObject('assets/img/5_background/layers/1_first_layer/1.png', 0, 0)
  ];
  canvas;
  ctx;

  constructor(canvas){
    this.ctx = canvas.getContext('2d');
    this.canvas = canvas;
    this.drawWorld();
  }


  drawWorld(){
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.addToCharacterMap(this.character);

    this.addObjectsToMap(this.enemies);
    this.addObjectsToMap(this.clouds);
    this.addObjectsToMap(this.backgroundObjects);

    let self = this;
    requestAnimationFrame(function(){
      self.drawWorld();
    });
  }

  addToCharacterMap(movableCharacter){
    this.ctx.drawImage(movableCharacter.img, movableCharacter.position_x, movableCharacter.position_y, movableCharacter.width, movableCharacter.height);
  }

  addObjectsToMap(objects){
    objects.forEach(object => {
      this.ctx.drawImage(object.img, object.position_x, object.position_y, object.width, object.height);
    });
  }

}