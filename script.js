let canvas;
let world;
let keyboard = new Keyboard();
let mute = false;

let swipeSound = new Audio (SOUNDS.gameSound.SWIPE_SOUND);
let win_Sound = new Audio (SOUNDS.gameSound.WIN_SOUND);
let lose_Sound = new Audio (SOUNDS.gameSound.LOSE_SOUND);

let loadingProgress = 0;
let totalAssets = 0;
let loadedAssets = 0;
let gameStarted = false;
const IMAGE_CACHE = {};

function init() {
  preloadAllImages();
  bindKeyboardBtns();
  bindMobileBtns();
}

function preloadAllImages() {
  const allImages = [];
  Object.values(ALL_IMAGES).forEach(category => {
    Object.values(category).forEach(value => {
      if (Array.isArray(value))
        allImages.push(...value);
    });
  });

  totalAssets = allImages.length;
  loadedAssets = 0;

  allImages.forEach(path => {
    const img = new Image();
    img.onload = updateLoadingProgress;
    img.onerror = updateLoadingProgress;
    img.src = path;
    IMAGE_CACHE[path] = img;
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
  totalAssets = preloadStartImg.length + preloadStartSound.length;
  loadedAssets = 0;
  preloadSound();
  preloadImg();
}

function loadingScreen() {
  document.getElementById('loadingScreen').classList.toggle('d_none');
}

function preloadImg() {
  preloadStartImg.forEach(src => {
    const img = new Image();
    img.onload = updateLoadingProgress;
    img.onerror = updateLoadingProgress;
    img.src = src;
  }); 
}

function preloadSound(){
  preloadStartSound.forEach(src => {
    const audio = new Audio();
    audio.oncanplaythrough = updateLoadingProgress;
    audio.onerror = updateLoadingProgress;
    audio.src = src;
  });
}

function bindKeyboardBtns() {
  window.addEventListener("keydown", (e) => {
    if(e.key == 'ArrowRight' || e.key == 'd'){
      keyboard.RIGHT = true;
    }
    
    if(e.key == 'ArrowDown' || e.key == 's'){
      keyboard.DOWN = true;
    }
    
    if(e.key == 'ArrowLeft' || e.key == 'a'){
      keyboard.LEFT = true;
    }
    
    if(e.key == 'ArrowUp' || e.key == 'w'){
      keyboard.UP = true;
    }
    
    if(e.key == ' '){
      keyboard.SPACE = true;
    }

    if(e.key == 'q'){
      keyboard.Q = true;
    }
  })

  window.addEventListener("keyup", (e) => {
    if(e.key == 'ArrowRight' || e.key == 'd'){
      keyboard.RIGHT = false;
    }
    
    if(e.key == 'ArrowDown' || e.key == 's'){
      keyboard.DOWN = false;
    }
    
    if(e.key == 'ArrowLeft' || e.key == 'a'){
      keyboard.LEFT = false;
    }
    
    if(e.key == 'ArrowUp' || e.key == 'w'){
      keyboard.UP = false;
    }
    
    if(e.key == ' '){
      keyboard.SPACE = false;
    }

    if(e.key == 'q'){
      keyboard.Q = false;
    }
  })
}

function bindMobileBtns() {
  document.getElementById('mobileBtnLeft').addEventListener('touchstart', (e) => {
    if (e.cancelable) {
      e.preventDefault();
    }
    keyboard.LEFT = true;
  })
  document.getElementById('mobileBtnLeft').addEventListener('touchend', (e) => {
    if (e.cancelable) {
      e.preventDefault();
    }
    keyboard.LEFT = false;
  })
  document.getElementById('mobileBtnRight').addEventListener('touchstart', (e) => {
    if (e.cancelable) {
      e.preventDefault();
    }
    keyboard.RIGHT = true;
  })
  document.getElementById('mobileBtnRight').addEventListener('touchend', (e) => {
    if (e.cancelable) {
      e.preventDefault();
    }
    keyboard.RIGHT = false;
  })
  document.getElementById('mobileBtnJump').addEventListener('touchstart', (e) => {
    if (e.cancelable) {
      e.preventDefault();
    }
    keyboard.SPACE = true;
  })
  document.getElementById('mobileBtnJump').addEventListener('touchend', (e) => {
    if (e.cancelable) {
      e.preventDefault();
    }
    keyboard.SPACE = false;
  })
  document.getElementById('mobileBtnThrow').addEventListener('touchstart', (e) => {
    if (e.cancelable) {
      e.preventDefault();
    }
    keyboard.Q = true;
  })
  document.getElementById('mobileBtnThrow').addEventListener('touchend', (e) => {
    if (e.cancelable) {
      e.preventDefault();
    }
    keyboard.Q = false;
  })
}

function toggleVolume() {
  if (mute) {
    displayVolumeUpIcon();
  } else {
    displayVolumeOffIcon();
  }
}

function displayVolumeUpIcon() {
  document.getElementById('volumeBtn').src = 'assets/img/menu_description/volume_up.svg';
  mute = false;
  if (world) {
    world.playBackgroundMusic();
  }
}

function displayVolumeOffIcon() {
  if (world) {
    world.stopBackgroundMusic();
  }
  win_Sound.pause();
  lose_Sound.pause();
  win_Sound.currentTime = 0;
  lose_Sound.currentTime = 0;

  document.getElementById('volumeBtn').src = 'assets/img/menu_description/volume_off.svg';
  mute = true;
}

function toggleKeyboardInstruction(event) {
  if (event) {
    event.stopPropagation();
  }

  let overlay = document.getElementById('keyboardBtnInfo');
  let isOpening = !overlay.classList.contains('show');

  if (isOpening) {
    overlay.classList.add('show');
  } else {
    overlay.classList.remove('show');
  }
  playAudio(swipeSound, 0.5, 0);
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
  stopAllInterval();
  stopEndbossSoundIfLost();

  document.getElementById('canvas').classList.add('d_none');
  if (playerHasWon) {
    playerWin();
  } else {
    playerLost();
  }
  exitFullscreen();
}

function stopEndbossSoundIfLost() {
  if (world && world.level && world.level.enemies) {
    world.level.enemies.forEach(enemy => {
      if (enemy instanceof Endboss) {
        stopAudio(enemy.ENDBOSS_SOUND);
        stopAudio(enemy.ENDBOSS_DIE_SOUND);
      }
    });
  }
}

function playerWin() {
  document.getElementById('youWin').classList.remove('d_none');
  document.getElementById('endgameBtns').classList.remove('d_none');
  playAudio(win_Sound, 1, 0);
  document.getElementById('playBtn').classList.add('d_none');
  document.getElementById('fullscreenBtn').classList.add('d_none');
  document.getElementById('mobileBtn').classList.add('d_none');
}

function playerLost() {
  document.getElementById('youLost').classList.remove('d_none');
  document.getElementById('endgameBtns').classList.remove('d_none');
  playAudio(lose_Sound, 1, 0);
  document.getElementById('playBtn').classList.add('d_none');
  document.getElementById('fullscreenBtn').classList.add('d_none');
  document.getElementById('mobileBtn').classList.add('d_none');
}

function showEndScreenButtons() {
  document.querySelectorAll('.endgame_btns').forEach(container => {
    container.classList.remove('d_none');
  });
  document.querySelectorAll('.restart_btn, .go_back_to_menu').forEach(btn => {
    btn.classList.remove('d_none');
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

function toggleFullscreen() {
  let canvas = document.getElementById('fullscreen');
  enterFullscreen(canvas);
}

function enterFullscreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }
}

function exitFullscreen() {
  if (document.fullscreenElement || document.webkitFullscreenElement) {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
}

window.addEventListener('resize', checkScreenOrientation);
window.addEventListener('orientationchange', checkScreenOrientation);
document.addEventListener('DOMContentLoaded', () => {
  checkScreenOrientation();
});

function checkScreenOrientation() {
  let rotateElement = document.getElementById('rotatePhone');
  if (!rotateElement) 
    return;
  const isPortrait = window.innerHeight > window.innerWidth;

  if (isPortrait) {
    rotateElement.classList.remove('d_none');
  } else {
    rotateElement.classList.add('d_none');
  }
}