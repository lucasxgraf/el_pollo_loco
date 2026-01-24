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
let gameEnded = false;
const IMAGE_CACHE = {};

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

  toggleAllSounds();
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

  toggleAllSounds();
}

function toggleKeyboardInstruction(event) {
  toggleElementVisibility(event, 'keyboardBtnInfo');
}

function toggleImpressum(event) {
  toggleElementVisibility(event, 'impressumBtnInfo');
}

function toggleElementVisibility(event, elementId) {
  if (event) {
    event.stopPropagation();
  }

  let element = document.getElementById(elementId);
  let isOpen = !element.classList.contains('show');

  if (isOpen) {
    element.classList.add('show');
  } else {
    element.classList.remove('show');
  }

  playAudio(swipeSound, 0.5, 0);
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

  const IS_PORTRAIT = window.innerHeight > window.innerWidth;

  if (IS_PORTRAIT) {
    rotateElement.classList.remove('d_none');
  } else {
    rotateElement.classList.add('d_none');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  setupCloseButton('closeInstructionsBtn', 'keyboardBtnInfo');
  setupCloseButton('closeImpressumBtn', 'impressumBtnInfo');
});

function setupCloseButton(closeBtnId, infoPanelId) {
  const CLOSE_BTN = document.getElementById(closeBtnId);
  const INFO_PANEL = document.getElementById(infoPanelId);

  CLOSE_BTN.addEventListener('click', (event) => {
    event.stopPropagation();
    INFO_PANEL.classList.remove('show');
    playAudio(swipeSound, 0.5, 0);
  });
}