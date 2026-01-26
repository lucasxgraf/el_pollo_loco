/**
 * @file worldUtils.js
 * @description Utility functions for managing world state, cleanup, and audio.
 */

/**
 * Cleans up all game objects and intervals in the world to prevent memory leaks.
 * @param {World} world - The world instance to clean up.
 */
function cleanup(world) {
  cleanupCharacter(world);
  cleanupEnemies(world);
  cleanupThrowableObjects(world);
  stopBackgroundMusic(world);

  world.character = null;
  world.level = null;
  world.enemies = null;
  world.clouds = null;
  world.coins = null;
  world.salsaBottles = null;
  world.throwableObjects = [];
}

/**
 * Cleans up character intervals to prevent memory leaks.
 * @param {World} world - The world instance containing the character.
 */
function cleanupCharacter(world) {
  if (world.character) {
    clearInterval(world.character.characterConditionInterval);
    clearInterval(world.character.characterDieInterval);
    clearInterval(world.character.backwardInterval);
    clearInterval(world.character.characterJumpInterval);
  }
}

/**
 * Cleans up all enemies in the world by calling their individual cleanup methods.
 * @param {World} world - The world instance containing the enemies.
 */
function cleanupEnemies(world) {
  if (!world.level || !world.level.enemies) return;

  world.level.enemies.forEach(enemy => {
    if (enemy.cleanup) enemy.cleanup();
  });
}

/**
 * Cleans up all throwable objects by calling their individual cleanup methods.
 * @param {World} world - The world instance containing the throwable objects.
 */
function cleanupThrowableObjects(world) {
  world.throwableObjects.forEach(bottle => {
    if (bottle.cleanup) bottle.cleanup();
  });
}

/**
 * Plays the background music for the current level.
 * @param {World} world - The world instance containing the level with background music.
 */
function playBackgroundMusic(world) {
  if (mute) return;
  playAudio(world.level.backgroundMusic, 0.5);
}

/**
 * Stops the background music for the current level.
 * @param {World} world - The world instance containing the level with background music.
 */
function stopBackgroundMusic(world) {
  stopAudio(world.level.backgroundMusic);
}

/**
 * Checks if the game is still winnable.
 * If the endboss is alive but no bottles are left (in inventory or on ground), the game ends.
 * @param {World} world - The current game world instance.
 */
function checkIfGameIsStillWinnable(world) {
  const endboss = world.level.enemies.find(e => e instanceof Endboss);
  if (!endboss || endboss.isDead) return;
  const bottlesInInventory = world.character.collectedBottles;
  const bottlesOnGround = world.level.salsaBottles.length;
  const bottlesInAir = world.throwableObjects.length;
  if (bottlesInInventory === 0 && bottlesOnGround === 0 && bottlesInAir === 0) {
    setTimeout(() => {
      if (gameRunning) {
        gameIsOver(false);
      }
    }, 2000);
  }
}

