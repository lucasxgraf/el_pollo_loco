class Character extends MovableObjects{
  height = 250;
  width = 100;
  speed = 5;
  IMAGES_WALKING_CHARACTER = [
    'assets/img/2_character_pepe/2_walk/W-21.png',
    'assets/img/2_character_pepe/2_walk/W-22.png',
    'assets/img/2_character_pepe/2_walk/W-23.png',
    'assets/img/2_character_pepe/2_walk/W-24.png',
    'assets/img/2_character_pepe/2_walk/W-25.png',
    'assets/img/2_character_pepe/2_walk/W-26.png'
  ]
  world;

  constructor(){
    super().loadImage('assets/img/2_character_pepe/2_walk/W-21.png');
    this.loadImages(this.IMAGES_WALKING_CHARACTER);

    this.animate();
  }

  animate(){
    setInterval(() => {
      if(this.world.keyboard.RIGHT){
        this.position_x += this.speed;
        this.otherDirection = false;
      }
      if(this.world.keyboard.LEFT){
        this.position_x -= this.speed;
        this.otherDirection = true;
      }
      this.world.camera_x = -this.position_x;
    }, 1000 / 60)

    setInterval(() => {
      if(this.world.keyboard.RIGHT || this.world.keyboard.LEFT){
        let i = this.currentImage % this.IMAGES_WALKING_CHARACTER.length;
        let path = this.IMAGES_WALKING_CHARACTER[i];
        this.img = this.imageCache[path];
        this.currentImage++;
      }
    }, 50);
  }

  jump(){

  }
}