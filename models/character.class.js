class Character extends MoveableObject{
  characterDieInterval;
  characterConditionInterval;
  world;
  position_y = 0;
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
  IMAGES_IDLE = [
    'assets/img/2_character_pepe/1_idle/idle/I-1.png',
    'assets/img/2_character_pepe/1_idle/idle/I-2.png',
    'assets/img/2_character_pepe/1_idle/idle/I-3.png',
    'assets/img/2_character_pepe/1_idle/idle/I-4.png',
    'assets/img/2_character_pepe/1_idle/idle/I-5.png',
    'assets/img/2_character_pepe/1_idle/idle/I-6.png',
    'assets/img/2_character_pepe/1_idle/idle/I-7.png',
    'assets/img/2_character_pepe/1_idle/idle/I-8.png',
    'assets/img/2_character_pepe/1_idle/idle/I-9.png',
    'assets/img/2_character_pepe/1_idle/idle/I-10.png',
  ];
  IMAGES_LONG_IDLE = [
    'assets/img/2_character_pepe/1_idle/long_idle/I-11.png',
    'assets/img/2_character_pepe/1_idle/long_idle/I-12.png',
    'assets/img/2_character_pepe/1_idle/long_idle/I-13.png',
    'assets/img/2_character_pepe/1_idle/long_idle/I-14.png',
    'assets/img/2_character_pepe/1_idle/long_idle/I-15.png',
    'assets/img/2_character_pepe/1_idle/long_idle/I-16.png',
    'assets/img/2_character_pepe/1_idle/long_idle/I-17.png',
    'assets/img/2_character_pepe/1_idle/long_idle/I-18.png',
    'assets/img/2_character_pepe/1_idle/long_idle/I-19.png',
    'assets/img/2_character_pepe/1_idle/long_idle/I-20.png',
  ];
  IMAGES_WALKING = [
    'assets/img/2_character_pepe/2_walk/W-21.png',
    'assets/img/2_character_pepe/2_walk/W-22.png',
    'assets/img/2_character_pepe/2_walk/W-23.png',
    'assets/img/2_character_pepe/2_walk/W-24.png',
    'assets/img/2_character_pepe/2_walk/W-25.png',
    'assets/img/2_character_pepe/2_walk/W-26.png'
  ];
  IMAGES_JUMPING = [
    'assets/img/2_character_pepe/3_jump/J-31.png',
    'assets/img/2_character_pepe/3_jump/J-32.png',
    'assets/img/2_character_pepe/3_jump/J-33.png',
    'assets/img/2_character_pepe/3_jump/J-34.png',
    'assets/img/2_character_pepe/3_jump/J-35.png',
    'assets/img/2_character_pepe/3_jump/J-36.png',
    'assets/img/2_character_pepe/3_jump/J-37.png',
    'assets/img/2_character_pepe/3_jump/J-38.png',
    'assets/img/2_character_pepe/3_jump/J-39.png'
  ];
  IMAGES_DEAD = [
    'assets/img/2_character_pepe/5_dead/D-51.png',
    'assets/img/2_character_pepe/5_dead/D-52.png',
    'assets/img/2_character_pepe/5_dead/D-53.png',
    'assets/img/2_character_pepe/5_dead/D-54.png',
    'assets/img/2_character_pepe/5_dead/D-55.png',
    'assets/img/2_character_pepe/5_dead/D-56.png',
    'assets/img/2_character_pepe/5_dead/D-57.png'
  ];
  IMAGES_HURT = [
    'assets/img/2_character_pepe/4_hurt/H-41.png',
    'assets/img/2_character_pepe/4_hurt/H-42.png',
    'assets/img/2_character_pepe/4_hurt/H-43.png'
  ];
  walking_sound = new Audio('assets/sound/walking.mp3');
  jump_sound = new Audio('assets/sound/jump.mp3');
  hurt_sound = new Audio('assets/sound/hurt.mp3');

  constructor(){
    super().loadImage('assets/img/2_character_pepe/1_idle/idle/I-1.png');
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_LONG_IDLE);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.animateMovement();
    this.animateConditionOfCharacter();
    this.animateWalkingSpeed();
    this.applyGravity();
  }

  animateMovement(){
    setInterval(() => {
      this.walking_sound.pause();
      
      if(this.canMoveRight()){
        this.moveRight();
      } else if (this.canMoveLeft()) {
        this.moveLeft();
        this.otherDirection = true;
      }

      if(this.canJump()){
        this.jump();
        this.jump_sound.play();
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
    return (this.world.keyboard.UP || this.world.keyboard.SPACE) && !this.isCharacterAboveGround();
  }

  moveRight() {
    super.moveRight();
    if (this.otherDirection) this.stopIncreasingSpeed();
    this.otherDirection = false;
    if (!this.isCharacterAboveGround()) {
      playAudio(this.walking_sound, 1);
      this.walking_sound.playbackRate = this.speedSound;
    }
    this.increasingSpeed();
    playAudio(this.walking_sound, 1);
  }

  moveLeft() {
    super.moveLeft();
    if (!this.otherDirection) this.stopIncreasingSpeed();
    this.otherDirection = true;
    if (!this.isCharacterAboveGround) {
        playAudio(this.walking_sound, 1);
        this.walking_sound.playbackRate = this.speedSound;
    }
    this.increasingSpeed();
    playAudio(this.walking_sound, 1)
  }

  jump(){
    super.jump();
    this.walking_sound.pause();
    this.stopIncreasingSpeed();
  }

  animateConditionOfCharacter(){
    this.characterConditionInterval = setInterval(() => {
      if (this.isDead()) {
          this.characterDieAnimation();
        } else if (this.isHurt(0.7)) {
          this.playAnimation(this.IMAGES_HURT);
        } else if (this.jumpAnimationRequirements()) {
          this.characterJumpAnimation();
        } else if (this.walkAnimationRequirements()) {
          this.counter++;
          if (this.counter >= 4) {
            this.playAnimation(this.IMAGES_WALKING);
            this.amountCounter += 0.25;
            this.counter = 0 + this.amountCounter;
          }
      } else {
        this.counter = 0;
        this.amountCounter = 0;
      }
    }, 50);
  }

  jumpAnimationRequirements() {
    return this.isCharacterAboveGround() && this.speed >= 0 && !this.jumpedOnAEnemy;
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
    }, 1200);
  }

  backwardJump() {
    if (!this.hurts) {
      this.hurts = true;
      this.speed = 15;
      this.stopIncreasingSpeed();
      playAudio(this.hurt_sound, 1);

      if (this.otherDirection) {
        this.backwardInterval = setInterval(() => { 
        this.position_x++ }, 1000 / 200);
      } else {
        this.backwardInterval = setInterval(() => { 
        this.position_x-- }, 1000 / 200);
      }
      setTimeout(() => {
          clearInterval(this.backwardInterval);
          this.hurts = false;
      }, 700);
    }
  }
  
  characterDieAnimation() {
    this.walking_sound.pause();
    stopAllInterval();
    this.characterDieInterval = setInterval(() => {
        this.playAnimation(this.IMAGES_DEAD);
    }, 380);
    setTimeout(() => {
        clearInterval(this.characterDieInterval)
        // gameOver(false);
    }, 1900);
  }

  animateWalkingSpeed() {
    setInterval(() => {
      if ((!this.world.keyboard.LEFT && !this.world.keyboard.RIGHT) || this.position_x <= 0 || this.position_x > this.world.level.level_end_x) {
        this.walking_sound.pause(); 
        this.stopIncreasingSpeed();
        this.longIdle++
        if (this.longIdle <= 20) { 
          this.playAnimation(this.IMAGES_IDLE);
        } else this.playAnimation(this.IMAGES_LONG_IDLE);
      } else {
        this.longIdle = 0;
      }
    }, 300);
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