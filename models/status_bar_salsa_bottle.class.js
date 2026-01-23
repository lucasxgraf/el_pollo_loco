class StatusBarSalsaBottle extends StatusBar {
  IMAGES_STATUS_BAR = ALL_IMAGES.statusbars.IMAGES_STATUS_BAR_SALSA_BOTTLE;
  position_x = 20;
  position_y = 100;
  width = 200;
  height = 60;
 
  constructor() {
    super();
    this.loadImages(this.IMAGES_STATUS_BAR);
    this.setPercentage(0);
  }
}