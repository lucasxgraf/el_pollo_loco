class StatusBarEndboss extends StatusBar {
  IMAGES_STATUS_BAR = [
    'assets/img/7_statusbars/2_statusbar_endboss/green/green0.png',
    'assets/img/7_statusbars/2_statusbar_endboss/green/green20.png',
    'assets/img/7_statusbars/2_statusbar_endboss/green/green40.png',
    'assets/img/7_statusbars/2_statusbar_endboss/green/green60.png',
    'assets/img/7_statusbars/2_statusbar_endboss/green/green80.png',
    'assets/img/7_statusbars/2_statusbar_endboss/green/green100.png'

  ];
  position_x = 500;
  position_y = 10;
  width = 200;
  height = 60;
 
  constructor() {
    super();
    this.loadImages(this.IMAGES_STATUS_BAR);
    this.setPercentage(100);
  }
}