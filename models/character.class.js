class Character extends MovableObjects{
  position_y = 0;
  height = 250;
  width = 100;
  speed = 5;
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
  world;
  walking_sound = new Audio('assets/sound/walking.mp3');
  jump_sound = new Audio('assets/sound/jump.mp3');

  constructor(){
    super().loadImage('assets/img/2_character_pepe/2_walk/W-21.png');
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.applyGravity();
    this.animate();
  }

  animate(){
    setInterval(() => {
      this.walking_sound.pause();
      
      if(this.world.keyboard.RIGHT && this.position_x < this.world.level.level_end_x){
        this.moveRight();
        this.playWalkingSound();
      }

      if(this.world.keyboard.LEFT && this.position_x > 0){
        this.moveLeft();
        this.otherDirection = true;
        this.playWalkingSound();
      }

      if((this.world.keyboard.UP || this.world.keyboard.SPACE) && !this.isCharacterAboveGround()){
        this.jump();
        this.jump_sound.play();
      }

      this.world.camera_x = -this.position_x + 100;
    }, 1000 / 60)

    setInterval(() => {
      if(this.isCharacterAboveGround()){
        this.playAnimation(this.IMAGES_JUMPING);
      } else {
        if(this.world.keyboard.RIGHT || this.world.keyboard.LEFT){
          this.playAnimation(this.IMAGES_WALKING);
        }
      }
    }, 100);
  }

  playWalkingSound(){
    if(!this.isCharacterAboveGround()){
      this.walking_sound.play();
    }
  }

  playJumpSound(){
    this.jump_sound.play();
  }
}