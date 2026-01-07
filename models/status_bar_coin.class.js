class StatusBarCoin extends StatusBar {
  IMAGES_STATUS_BAR = [
    'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/0.png',
    'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/20.png',
    'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/40.png',
    'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/60.png',
    'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/80.png',
    'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/100.png'
  ];
  position_x = 20;
  position_y = 50;
  width = 200;
  height = 60;
 
  constructor() {
    super();
    this.loadImages(this.IMAGES_STATUS_BAR);
    this.setPercentage(100);
  }
}