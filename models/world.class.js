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
    this.checkCollisions();
    this.createBackgroundObjects();
  }

  drawWorld(){
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.translate(this.camera_x, 0);
    
    this.addObjectsToMap(this.backgroundObjects);
    this.addObjectsToMap(this.enemies);
    this.addObjectsToMap(this.clouds);
    this.addObjectsToMap(this.coins);
    this.addObjectsToMap(this.salsaBottles);
    this.addToMap(this.character);

    this.ctx.translate(-this.camera_x, 0);

    let self = this;
    requestAnimationFrame(function(){
      self.drawWorld();
    });
  }

  setWorld(){
    this.character.world = this;
  }

  checkCollisions(){
    setInterval(() => {
      this.level.enemies.forEach((enemy) => {
        if(this.character.isColliding(enemy)){
          this.character.hit();
          console.log('Collision with enemy detected! health:', this.character.health);
        }
      });
    }, 200);
  }

  addObjectsToMap(objects){
    objects.forEach(o => {
      this.addToMap(o);
    });
  }

  addToMap(movableObject){
    if(movableObject.otherDirection){
      this.flipImage(movableObject);
    }

    movableObject.drawObject(this.ctx);
    movableObject.drawObjectHitbox(this.ctx);

    if(movableObject.otherDirection){
      this.flipImageBack(movableObject);
    }
  }

  flipImage(movableObject){
    this.ctx.save();
    this.ctx.translate(movableObject.width, 0);
    this.ctx.scale(-1, 1);
    movableObject.position_x = movableObject.position_x * -1;
  }

  flipImageBack(movableObject){
    movableObject.position_x = movableObject.position_x * -1;
    this.ctx.restore();
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