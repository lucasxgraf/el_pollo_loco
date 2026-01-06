class Coin extends MoveableObject {
  position_x = 100;
  position_y = 170;
  width = 100;
  height = 100;

  IMAGES_ROTATE = [
    'assets/img/8_coin/coin_1.png',
    'assets/img/8_coin/coin_2.png',
  ];

  constructor(x, y, isMiddle = false) {
    super().loadImage(isMiddle ? 'assets/img/8_coin/coin_2.png' : 'assets/img/8_coin/coin_1.png');
    this.loadImages(this.IMAGES_ROTATE);
    this.position_x = x;
    this.position_y = y;
    if (isMiddle) {
      this.position_y = y - 20;
    }
  }
}