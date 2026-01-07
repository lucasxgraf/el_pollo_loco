class StatusBarHealth extends StatusBar {
  IMAGES_STATUS_BAR = [
    'assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png',
    'assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png',
    'assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png',
    'assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png',
    'assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png',
    'assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png'
  ];
  position_x = 20;
  position_y = 0;
  width = 200;
  height = 60;
 
  constructor() {
    super();
    this.loadImages(this.IMAGES_STATUS_BAR);
    this.setPercentage(100);
  }
}