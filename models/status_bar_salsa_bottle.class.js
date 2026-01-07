class StatusBarSalsaBottle extends StatusBar {
  IMAGES_STATUS_BAR = [
    'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/0.png',
    'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/20.png',
    'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/40.png',
    'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/60.png',
    'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/80.png',
    'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/100.png'
  ];
  position_x = 20;
  position_y = 100;
  width = 200;
  height = 60;
 
  constructor() {
    super();
    this.loadImages(this.IMAGES_STATUS_BAR);
    this.setPercentage(100);
  }
}