class StatusBar extends DrawableObject {

  percentage = 100;

  setPercentage(percentage) {
    this.percentage = percentage;
    let path = this.IMAGES_STATUS_BAR[this.resolveImageIndex()];
    this.img = IMAGE_CACHE[path];
  }

  resolveImageIndex(){
    if (this.percentage == 100) {
      return 5;
    } else if (this.percentage >= 80) {
      return 4;
    } else if (this.percentage >= 60) {
      return 3;
    } else if (this.percentage >= 40) {
      return 2;
    } else if (this.percentage > 0) {
      return 1;
    } else {
      return 0;
    }
  }
}