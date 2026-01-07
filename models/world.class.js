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
  statusBarHealth = new StatusBarHealth();
  statusBarCoin = new StatusBarCoin();
  statusBarSalsaBottle = new StatusBarSalsaBottle();
  throwableObjects = [
    new ThrowableObject(),
  ];

  constructor(canvas, keyboard){
    this.ctx = canvas.getContext('2d');
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.drawWorld();
    this.setWorld();
    this.run();
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
    this.addObjectsToMap(this.throwableObjects);
    this.addToMap(this.character);
    
    this.ctx.translate(-this.camera_x, 0);
    this.addToMap(this.statusBarHealth);
    this.addToMap(this.statusBarCoin);
    this.addToMap(this.statusBarSalsaBottle);
    this.ctx.translate(this.camera_x, 0);

    this.ctx.translate(-this.camera_x, 0);

    let self = this;
    requestAnimationFrame(function(){
      self.drawWorld();
    });
  }

  setWorld(){
    this.character.world = this;
  }

  run(){
    setInterval(() => {
      this.checkCollisions();
      this.checkThrowObjects();
    }, 200);
  }

  checkCollisions(){
    this.level.enemies.forEach((enemy) => {
      if(this.character.isColliding(enemy)){
        this.character.hit();
        this.statusBarHealth.setPercentage(this.character.health);
      }
    });
  }

  checkThrowObjects(){
    if (this.keyboard.Q && this.character.canThrowBottle) {
      let bottle = new ThrowableObject(this.character.position_x + 100, this.character.position_y + 100);
      this.throwableObjects.push(bottle);
      this.character.canThrowBottle = false;
      setTimeout(() => {
        this.character.canThrowBottle = true;
      }, 1000);
    }
  }

  addObjectsToMap(objects){
    objects.forEach(o => {
      this.addToMap(o);
    });
  }

  addToMap(moveableObject){
    if(moveableObject.otherDirection){
      this.flipImage(moveableObject);
    }

    moveableObject.drawObject(this.ctx);
    moveableObject.drawObjectHitbox(this.ctx);

    if(moveableObject.otherDirection){
      this.flipImageBack(moveableObject);
    }
  }

  flipImage(moveableObject){
    this.ctx.save();
    this.ctx.translate(moveableObject.width, 0);
    this.ctx.scale(-1, 1);
    moveableObject.position_x = moveableObject.position_x * -1;
  }

  flipImageBack(moveableObject){
    moveableObject.position_x = moveableObject.position_x * -1;
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