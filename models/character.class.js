class Character extends MovableObjects{
  height = 250;
  width = 100;
  IMAGES_WALKING_CHARACTER = [
    'assets/img/2_character_pepe/2_walk/W-21.png',
    'assets/img/2_character_pepe/2_walk/W-22.png',
    'assets/img/2_character_pepe/2_walk/W-23.png',
    'assets/img/2_character_pepe/2_walk/W-24.png',
    'assets/img/2_character_pepe/2_walk/W-25.png',
    'assets/img/2_character_pepe/2_walk/W-26.png'
  ]

  constructor(){
    super().loadImage('assets/img/2_character_pepe/2_walk/W-21.png');
    this.loadImages(this.IMAGES_WALKING_CHARACTER);

    this.animate();
  }

  animate(){
    setInterval(() => {
      let i = this.currentImage % this.IMAGES_WALKING_CHARACTER.length;
      let path = this.IMAGES_WALKING_CHARACTER[i];
      this.img = this.imageCache[path];
      this.currentImage++;
    }, 100 );
  }

  jump(){

  }
}