class Character extends MoveableObject{
  characterDieInterval;
  characterConditionInterval;
  world;
  position_y = 180;
  height = 250;
  width = 100;
  collectedCoins = 0;
  collectedBottles = 0;
  stop = true;
  jumpedOnEnemy = false;
  counter = 0;
  longIdle = 0;
  amountCounter = 0;
  speed = 5;
  speedSound = 1;
  offset = { 
    top: 120, 
    left: 40, 
    right: 35, 
    bottom: 10
   };
  IMAGES_IDLE = ALL_IMAGES.character.IMAGES_IDLE;
  IMAGES_LONG_IDLE = ALL_IMAGES.character.IMAGES_LONG_IDLE;
  IMAGES_WALKING = ALL_IMAGES.character.IMAGES_WALKING;
  IMAGES_JUMPING = ALL_IMAGES.character.IMAGES_JUMPING;
  IMAGES_DEAD = ALL_IMAGES.character.IMAGES_DEAD;
  IMAGES_HURT = ALL_IMAGES.character.IMAGES_HURT;

  WALKING_SOUND = new Audio (SOUNDS.character.WALKING_SOUND);
  JUMP_SOUND = new Audio (SOUNDS.character.JUMP_SOUND);
  HURT_SOUND = new Audio (SOUNDS.character.HURT_SOUND);

  constructor(){
    super().loadImage('assets/img/2_character_pepe/1_idle/idle/I-1.png');
    this.loadImagesCharacter();
    this.animateMovement();
    this.animateConditionOfCharacter();
    this.animateWalkingSpeed();
    this.applyGravity();
  }
  
  loadImagesCharacter(){
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_LONG_IDLE);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
  }

  animateMovement(){
    setInterval(() => {
      this.WALKING_SOUND.pause();
      
      if(this.canMoveRight()){
        this.moveRight();
      } else if (this.canMoveLeft()) {
        this.moveLeft();
        this.otherDirection = true;
      }

      if(this.canJump()){
        this.jump();
        playAudio(this.JUMP_SOUND, 1);
      }

      this.world.camera_x = -this.position_x + 100;
    }, 1000 / 60)
  }

  canMoveRight() { 
    return this.world.keyboard.RIGHT && this.position_x < this.world.level.level_end_x && !this.hurts; 
  }

  canMoveLeft() {
    return this.world.keyboard.LEFT && this.position_x > 0 && !this.hurts;
  }

  canJump() {
    return (this.world.keyboard.UP || this.world.keyboard.SPACE) && !this.isObjectAboveGround();
  }

  moveRight() {
    super.moveRight();
    if (this.otherDirection) {
      this.stopIncreasingSpeed();
    }

    this.otherDirection = false;

    if (!this.isObjectAboveGround()) {
      playAudio(this.WALKING_SOUND, 1);
      this.WALKING_SOUND.playbackRate = this.speedSound;
    }

    this.increasingSpeed();
    playAudio(this.WALKING_SOUND, 1);
  }

  moveLeft() {
    super.moveLeft();
    if (!this.otherDirection) {
      this.stopIncreasingSpeed();
    }

    this.otherDirection = true;

    if (!this.isObjectAboveGround) {
      playAudio(this.WALKING_SOUND, 1);
      this.WALKING_SOUND.playbackRate = this.speedSound;
    }

    this.increasingSpeed();
    playAudio(this.WALKING_SOUND, 1)
  }

  jump(){
    super.jump();
    this.WALKING_SOUND.pause();
    this.stopIncreasingSpeed();
  }

  jumpOnEnemy(){
    this.speedGravityY = 10;
    this.WALKING_SOUND.pause();
  }

  animateConditionOfCharacter() {
    this.characterConditionInterval = setInterval(() => {
      if (this.isDead()) 
        return this.handleDeath();
      if (this.isHurt(0.7)) 
        return this.handleHurt();
      if (this.jumpAnimationRequirements()) 
        return this.handleJump();
      if (this.walkAnimationRequirements()) 
        return this.handleWalk();
      this.resetWalkCounters();
    }, 50);
  }

  handleDeath() {
    this.characterDieAnimation();
  }

  handleHurt() {
    this.playAnimation(this.IMAGES_HURT);
  }

  handleJump() {
    this.characterJumpAnimation();
  }

  handleWalk() {
    this.counter++;

    if (this.counter >= 4) {
      this.playAnimation(this.IMAGES_WALKING);
      this.amountCounter += 0.25;
      this.counter = 0 + this.amountCounter;
    }
  }

  resetWalkCounters() {
    this.counter = 0;
    this.amountCounter = 0;
  }

  jumpAnimationRequirements() {
    return this.isObjectAboveGround() && this.speed >= 0 && !this.jumpedOnAEnemy;
  }

  walkAnimationRequirements() {
    return (this.world.keyboard.RIGHT || this.world.keyboard.LEFT && this.position_x > 0) && this.position_x < this.world.level.level_end_x;
  }

  characterJumpAnimation() {
    clearInterval(this.characterConditionInterval);
    this.longIdle = 0;
    this.characterJumpInterval = setInterval(() => {
      this.playAnimation(this.IMAGES_JUMPING);
    }, 220);

    setTimeout(() => {
      this.currentImage = 0;
      this.animateConditionOfCharacter();
      clearInterval(this.characterJumpInterval);
    }, 850);
  }

  backwardJump() {
    if (this.hurts) 
      return;
    
    this.initiateBackwardJump();
    this.startBackwardMovement();
    this.endBackwardJump();
  }

  initiateBackwardJump() {
    this.hurts = true;
    this.speed = 15;
    this.stopIncreasingSpeed();
    playAudio(this.HURT_SOUND, 1);
  }

  startBackwardMovement() {
    this.backwardInterval = setInterval(() => { 
      this.position_x--; 
    }, 1000 / 200);
  }

  endBackwardJump() {
    setTimeout(() => {
      clearInterval(this.backwardInterval);
      this.hurts = false;
    }, 700);
  }
  
  characterDieAnimation() {
    this.WALKING_SOUND.pause();
    stopAllInterval();

    this.characterDieInterval = setInterval(() => {
      this.playAnimation(this.IMAGES_DEAD);
    }, 380);

    setTimeout(() => {
      clearInterval(this.characterDieInterval)
      gameIsOver(false);
    }, 1900);
  }

  animateWalkingSpeed() {
    setInterval(() => {
      if (this.shouldIdle()) {
        this.handleIdle();
      } else {
        this.longIdle = 0;
      }
    }, 300);
  }

  shouldIdle() {
    return (!this.world.keyboard.LEFT && !this.world.keyboard.RIGHT) ||
      this.position_x <= 0 ||
      this.position_x > this.world.level.level_end_x;
  }

  handleIdle() {
    this.WALKING_SOUND.pause();
    this.stopIncreasingSpeed();
    this.longIdle++;

    if (this.longIdle <= 20) {
      this.playAnimation(this.IMAGES_IDLE);
    } else {
      this.playAnimation(this.IMAGES_LONG_IDLE);
    }
  }

  increasingSpeed() {
    if (this.speed < 8) {
      this.speed *= 1.01;
      this.speedSound *= 1.008;
    }
  }
  
  stopIncreasingSpeed() {
    this.speed = 2.5;
    this.speedSound = 1;
    this.counter = 0;
    this.amountCounter = 0;
  }
}