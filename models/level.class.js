class Level {
  enemies;
  clouds;
  backgroundObjects;
  coins;
  salsaBottles;
  level_end_x = 4000;
  backgroundMusic;

  constructor(enemies, clouds, backgroundObjects, coins, salsaBottles, backgroundMusic) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.coins = coins;
    this.salsaBottles = salsaBottles;
    this.backgroundMusic = backgroundMusic;
  }
}