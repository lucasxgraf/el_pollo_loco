/**
 * @file gameInit.js
 * @description Game initialization logic including asset preloading, UI setup, and game flow control.
 */

/**
 * Entry point for initializing the game.
 * Preloads all images and binds keyboard/mobile controls.
 */
function init() {
  preloadAllImages();
  bindKeyboardBtns();
  bindMobileBtns();
}

/**
 * Asynchronously preloads all game images by collecting paths and creating image promises.
 * Updates loading progress as each image loads.
 */
async function preloadAllImages() {
  const allImages = collectAllImages();
  totalAssets = allImages.length;
  loadedAssets = 0;

  const promises = allImages.map(createImagePromise);
  await Promise.all(promises);
}

/**
 * Collects all image paths from the ALL_IMAGES object structure.
 * Handles both arrays and individual string paths.
 * @returns {string[]} Array of image file paths.
 */
function collectAllImages() {
  const allImages = [];
  Object.values(ALL_IMAGES).forEach(category => {
    Object.values(category).forEach(value => {
      if (Array.isArray(value)) allImages.push(...value);
      else if (typeof value === 'string') allImages.push(value);
    });
  });
  return allImages;
}

/**
 * Creates a promise for loading a single image.
 * Resolves regardless of success or failure to prevent hanging during preload.
 * @param {string} path - Path to the image file.
 * @returns {Promise<void>} A resolved promise when the image finishes loading or fails.
 */
function createImagePromise(path) {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = path;
    img.onload = () => {
      updateLoadingProgress();
      resolve();
    };
    img.onerror = () => {
      updateLoadingProgress();
      resolve();
    };
  });
}

/**
 * Updates the loading progress bar and percentage text.
 * Triggers the loading screen transition once all assets are loaded.
 */
function updateLoadingProgress() {
  loadedAssets++;
  loadingProgress = Math.round((loadedAssets / totalAssets) * 100);
  document.getElementById('loadingPercentage').textContent = loadingProgress + '%';
  document.getElementById('loadingBar').style.width = loadingProgress + '%';

  if (loadedAssets === totalAssets) {
    loadingScreen();
    gameStarted = true;
  }
}

/**
 * Initiates the asset preloading process for initial game assets.
 * Counts images and sounds to track overall loading progress.
 */
function preloadAssets() {
  loadingScreen();
  totalAssets = PRELOAD_START_IMG.length + PRELOAD_START_SOUNDS.length;
  loadedAssets = 0;
  preloadSound();
  preloadImg();
}

/**
 * Toggles visibility of the loading screen element.
 */
function loadingScreen() {
  document.getElementById('loadingScreen').classList.toggle('d_none');
}

/**
 * Preloads initial game images by setting their source and tracking load progress.
 */
function preloadImg() {
  PRELOAD_START_IMG.forEach(src => {
    const img = new Image();
    img.onload = updateLoadingProgress;
    img.onerror = updateLoadingProgress;
    img.src = src;
  }); 
}

/**
 * Preloads initial game sounds by setting their source and tracking load progress.
 */
function preloadSound(){
  PRELOAD_START_SOUNDS.forEach(src => {
    const audio = new Audio();
    audio.oncanplaythrough = updateLoadingProgress;
    audio.onerror = updateLoadingProgress;
    audio.src = src;
  });
}

/**
 * Starts the actual gameplay by showing the game screen,
 * initializing the level, and creating the game world.
 */
function playGame() {
  showStartScreenButtons();
  showGameScreen();
  initLevel1();
  canvas = document.getElementById('canvas');
  world = new World(canvas, keyboard);
}

/**
 * Shows/hides appropriate UI elements for the start screen.
 */
function showStartScreenButtons() {
  let settings = document.getElementById('settingsContainer');

  if (settings) {
    settings.classList.remove('d_none');
  }

  document.getElementById('youWin').classList.add('d_none');
  document.getElementById('youLost').classList.add('d_none');
  document.getElementById('endgameBtns').classList.add('d_none');
}

/**
 * Displays the main game screen UI elements and hides menu elements.
 */
function showGameScreen() {
  document.getElementById('playBtn').classList.add('d_none');
  document.getElementById('menu').classList.add('d_none');
  document.getElementById('fullscreen').classList.remove('d_none');
  document.getElementById('fullscreenBtn').classList.remove('d_none');
  document.getElementById('canvas').classList.remove('d_none');
  document.getElementById('mobileBtn').classList.remove('d_none');
}

/**
 * Ends the game and shows win/loss result screen.
 * @param {boolean} playerHasWon - Whether the player won the game.
 */
function gameIsOver(playerHasWon) {
  gameEnded = true;
  stopAllInterval();
  stopAllEndbossSounds();

  document.getElementById('canvas').classList.add('d_none');

  if (playerHasWon) {
    playerWin();
  } else {
    playerLost();
  }

  exitFullscreen();
}

/**
 * Stops all active sounds from Endboss enemies.
 */
function stopAllEndbossSounds() {
  if (world && world.level && world.level.enemies) {
    world.level.enemies.forEach(enemy => {
      if (enemy instanceof Endboss) {
        stopAudio(enemy.ENDBOSS_SOUND);
        stopAudio(enemy.ENDBOSS_DIE_SOUND);
        stopAudio(enemy.ENDBOSS_HURT_SOUND);
      }
    });
  }
}

/**
 * Handles player victory scenario.
 */
function playerWin() {
  showGameResult(true);
}

/**
 * Handles player loss scenario.
 */
function playerLost() {
  showGameResult(false);
}

/**
 * Displays the appropriate game result screen (win or loss).
 * Plays corresponding sound effect if not muted.
 * @param {boolean} isWin - Whether the player won.
 */
function showGameResult(isWin) {
  document.getElementById('endgameBtns').classList.remove('d_none');
  document.getElementById('playBtn').classList.add('d_none');
  document.getElementById('fullscreenBtn').classList.add('d_none');
  document.getElementById('mobileBtn').classList.add('d_none');

  if (isWin) {
    document.getElementById('youWin').classList.remove('d_none');
    if (!mute) {
      playAudio(win_Sound, 1, 0);
    }
  } else {
    document.getElementById('youLost').classList.remove('d_none');
    if (!mute) {
      playAudio(lose_Sound, 1, 0);
    }
  }
}

/**
 * Shows end-game navigation buttons.
 */
function showEndScreenButtons() {
  document.querySelectorAll('.endgame_btns').forEach(container => {
    container.classList.remove('d_none');
  });
  
  document.querySelectorAll('.restart_btn, .go_back_to_menu').forEach(btn => {
    btn.classList.remove('d_none');
  });
}

/**
 * Toggles all game sounds based on mute state.
 */
function toggleAllSounds() {
  if (mute) {
    handleMutedState();
  } else {
    handleUnmutedState();
  }
}

/**
 * Handles muting all game sounds.
 */
function handleMutedState() {
  if (!world || !world.level || !world.level.enemies) 
    return;
  
  world.level.enemies.forEach(enemy => {
    if (enemy instanceof Endboss) {
      stopEndbossSounds(enemy);
    }
  });
  
  win_Sound.pause();
  lose_Sound.pause();
}

/**
 * Handles unmuting all game sounds.
 */
function handleUnmutedState() {
  if (gameEnded) 
    return;
  
  if (world) {
    world.playBackgroundMusic();
  }
  
  if (world && world.level && world.level.enemies) {
    playEndbossSounds();
  }
}

/**
 * Stops all sounds associated with an Endboss instance.
 * @param {Endboss} endboss - The Endboss instance whose sounds should be stopped.
 */
function stopEndbossSounds(endboss) {
  stopAudio(endboss.ENDBOSS_SOUND);
  stopAudio(endboss.ENDBOSS_DIE_SOUND);
  stopAudio(endboss.ENDBOSS_HURT_SOUND);
}

/**
 * Plays sounds for active Endboss enemies.
 */
function playEndbossSounds() {
  world.level.enemies.forEach(enemy => {
    if (enemy instanceof Endboss && enemy.hadFirstContact && !enemy.isDead) {
      playAudio(enemy.ENDBOSS_SOUND, 0.15, 0);
    }
  });
}

/**
 * Restarts the game by hiding result screens and starting gameplay again.
 */
function restartGame() {
  document.getElementById('youWin').classList.add('d_none');
  document.getElementById('youLost').classList.add('d_none');
  document.getElementById('endgameBtns').classList.add('d_none');
  playGame();
}

/**
 * Returns the player to the main menu by reloading the index page.
 */
function goBackToMenu() {
  window.location.replace('index.html');
}

/**
 * Clears all active intervals to prevent memory leaks or unexpected behavior.
 */
function stopAllInterval() {
  for (let i = 1; i < 999; i++) window.clearInterval(i);
}