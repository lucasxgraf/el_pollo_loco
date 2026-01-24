/**
 * @file Level.class.js
 * @description Represents a game level, containing all entities, environmental objects, and level-specific settings.
 */

/**
 * Class representing a game level.
 * Stores collections of enemies, clouds, background objects, and collectibles.
 */
class Level {
  enemies;
  clouds;
  backgroundObjects;
  coins;
  salsaBottles;
  level_end_x = 4000;
  backgroundMusic;

  /**
   * Constructs a new Level instance.
   * @param {Array<Enemy>} enemies - The enemies to populate the level.
   * @param {Array<Cloud>} clouds - The clouds for the background.
   * @param {Array<BackgroundObject>} backgroundObjects - The background layers.
   * @param {Array<Coin>} coins - The coins to be placed in the level.
   * @param {Array<SalsaBottle>} salsaBottles - The salsa bottles to be placed in the level.
   * @param {HTMLAudioElement} backgroundMusic - The audio track for the level.
   */
  constructor(enemies, clouds, backgroundObjects, coins, salsaBottles, backgroundMusic) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.coins = coins;
    this.salsaBottles = salsaBottles;
    this.backgroundMusic = backgroundMusic;
  }
}