function init() {
  preloadAllImages();
  bindKeyboardBtns();
  bindMobileBtns();
}

async function preloadAllImages() {
  const allImages = collectAllImages();
  totalAssets = allImages.length;
  loadedAssets = 0;

  const promises = allImages.map(createImagePromise);
  await Promise.all(promises);
}

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

function preloadAssets() {
  loadingScreen();
  totalAssets = PRELOAD_START_IMG.length + PRELOAD_START_SOUNDS.length;
  loadedAssets = 0;
  preloadSound();
  preloadImg();
}

function loadingScreen() {
  document.getElementById('loadingScreen').classList.toggle('d_none');
}

function preloadImg() {
  PRELOAD_START_IMG.forEach(src => {
    const img = new Image();
    img.onload = updateLoadingProgress;
    img.onerror = updateLoadingProgress;
    img.src = src;
  }); 
}

function preloadSound(){
  PRELOAD_START_SOUNDS.forEach(src => {
    const audio = new Audio();
    audio.oncanplaythrough = updateLoadingProgress;
    audio.onerror = updateLoadingProgress;
    audio.src = src;
  });
}

function playGame() {
  showStartScreenButtons();
  showGameScreen();
  initLevel1();
  canvas = document.getElementById('canvas');
  world = new World(canvas, keyboard);
}

function showStartScreenButtons() {
  let settings = document.getElementById('settingsContainer');

  if (settings) {
    settings.classList.remove('d_none');
  }

  document.getElementById('youWin').classList.add('d_none');
  document.getElementById('youLost').classList.add('d_none');
  document.getElementById('endgameBtns').classList.add('d_none');
}

function showGameScreen() {
  document.getElementById('playBtn').classList.add('d_none');
  document.getElementById('menu').classList.add('d_none');
  document.getElementById('fullscreen').classList.remove('d_none');
  document.getElementById('fullscreenBtn').classList.remove('d_none');
  document.getElementById('canvas').classList.remove('d_none');
  document.getElementById('mobileBtn').classList.remove('d_none');
}

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

function playerWin() {
  showGameResult(true);
}

function playerLost() {
  showGameResult(false);
}

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

function showEndScreenButtons() {
  document.querySelectorAll('.endgame_btns').forEach(container => {
    container.classList.remove('d_none');
  });
  
  document.querySelectorAll('.restart_btn, .go_back_to_menu').forEach(btn => {
    btn.classList.remove('d_none');
  });
}

function toggleAllSounds() {
  if (mute) {
    handleMutedState();
  } else {
    handleUnmutedState();
  }
}

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

function stopEndbossSounds(endboss) {
  stopAudio(endboss.ENDBOSS_SOUND);
  stopAudio(endboss.ENDBOSS_DIE_SOUND);
  stopAudio(endboss.ENDBOSS_HURT_SOUND);
}

function playEndbossSounds() {
  world.level.enemies.forEach(enemy => {
    if (enemy instanceof Endboss && enemy.hadFirstContact && !enemy.isDead) {
      playAudio(enemy.ENDBOSS_SOUND, 0.15, 0);
    }
  });
}

function restartGame() {
  document.getElementById('youWin').classList.add('d_none');
  document.getElementById('youLost').classList.add('d_none');
  document.getElementById('endgameBtns').classList.add('d_none');
  playGame();
}

function goBackToMenu() {
  window.location.replace('index.html');
}

function stopAllInterval() {
  for (let i = 1; i < 999; i++) window.clearInterval(i);
}