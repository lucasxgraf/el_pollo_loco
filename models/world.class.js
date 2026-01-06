class World {
  character = new Character();
  level = LEVEL_1;
  enemies = LEVEL_1.enemies;
  clouds = LEVEL_1.clouds;
  coins = LEVEL_1.coins;
  salsaBottles = LEVEL_1.salsaBottles;
  backgroundObjects = [];
  canvas;
  ctx;
  keyboard;
  camera_x = -100;

  constructor(canvas, keyboard){
    this.ctx = canvas.getContext('2d');
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.drawWorld();
    this.setWorld();
    this.createBackgroundObjects();
  }

  drawWorld(){
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.translate(this.camera_x, 0);
    
    this.addObjectsToMap(this.backgroundObjects);
    this.addToCharacterMap(this.character);
    this.addObjectsToMap(this.enemies);
    this.addObjectsToMap(this.clouds);
    this.addObjectsToMap(this.coins);
    this.addObjectsToMap(this.salsaBottles);

    this.ctx.translate(-this.camera_x, 0);

    let self = this;
    requestAnimationFrame(function(){
      self.drawWorld();
    });
  }

  setWorld(){
    this.character.world = this;
  }

  addToCharacterMap(movableCharacter){
    if(movableCharacter.otherDirection){
      this.ctx.save();
      this.ctx.translate(movableCharacter.width, 0);
      this.ctx.scale(-1, 1);
      movableCharacter.position_x = movableCharacter.position_x * -1;
    }

    this.ctx.drawImage(movableCharacter.img, movableCharacter.position_x, movableCharacter.position_y, movableCharacter.width, movableCharacter.height);

    if(movableCharacter.otherDirection){
      movableCharacter.position_x = movableCharacter.position_x * -1;
      this.ctx.restore();
    }
  }

  addObjectsToMap(objects){
    objects.forEach(object => {
      this.ctx.drawImage(object.img, object.position_x, object.position_y, object.width, object.height);
    });
  }

  createBackgroundObjects() {
    const layers = [
      'assets/img/5_background/layers/air.png',
      'assets/img/5_background/layers/3_third_layer/',
      'assets/img/5_background/layers/2_second_layer/',
      'assets/img/5_background/layers/1_first_layer/'
    ];
    
    for (let i = -1; i < 5; i++) {
      const MULTIPLIED_BY_720 = i * 720;
      const IMAGE_VARIANT = i % 2 === 0 ? '1.png' : '2.png';
      
      this.backgroundObjects.push(new BackgroundObject(layers[0], MULTIPLIED_BY_720, 0));
      this.backgroundObjects.push(new BackgroundObject(layers[1] + IMAGE_VARIANT, MULTIPLIED_BY_720, 0));
      this.backgroundObjects.push(new BackgroundObject(layers[2] + IMAGE_VARIANT, MULTIPLIED_BY_720, 0));
      this.backgroundObjects.push(new BackgroundObject(layers[3] + IMAGE_VARIANT, MULTIPLIED_BY_720, 0));
    }
  }
}