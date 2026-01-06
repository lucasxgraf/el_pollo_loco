class SalsaBottle extends MovableObjects {
  position_x = 100 + Math.random() * 1800;
  position_y = 360;
  height = 70;
  width = 50;

  IMAGES_SALSA_BOTTLE = [
    'assets/img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
    'assets/img/6_salsa_bottle/2_salsa_bottle_on_ground.png',
  ];

  constructor() {
    super().loadImage('assets/img/6_salsa_bottle/1_salsa_bottle_on_ground.png');
    this.loadImages(this.IMAGES_SALSA_BOTTLE);
  }
}