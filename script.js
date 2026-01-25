/**
 * @file script.js
 * @description Main entry point for the El Pollo Loco game logic, handling UI, sound, and screen orientation.
 */
let canvas;
let world;
let keyboard = new Keyboard();
let mute = false;
let swipeSound = new Audio(SOUNDS.gameSound.SWIPE_SOUND);
let win_Sound = new Audio(SOUNDS.gameSound.WIN_SOUND);
let lose_Sound = new Audio(SOUNDS.gameSound.LOSE_SOUND);
let loadingProgress = 0;
let totalAssets = 0;
let loadedAssets = 0;
let gameStarted = false;
let gameEnded = false;
let gameRunning = false;
let gameIsOverCalled = false;
const IMAGE_CACHE = {};

/**
 * Toggles the game volume between muted and unmuted states.
 */
function toggleVolume() {
  if (mute) {
    displayVolumeUpIcon();
  } else {
    displayVolumeOffIcon();
  }
}

/**
 * Unmutes the game, updates the UI icon, and resumes background music.
 */
function displayVolumeUpIcon() {
  document.getElementById('volumeBtn').src = 'assets/img/menu_description/volume_up.svg';
  mute = false;
  if (world) {
    playBackgroundMusic(world);
  }
  toggleAllSounds();
}

/**
 * Mutes the game, updates the UI icon, and stops all active game sounds.
 */
function displayVolumeOffIcon() {
  if (world) {
    stopBackgroundMusic(world);
  }
  win_Sound.pause();
  lose_Sound.pause();
  win_Sound.currentTime = 0;
  lose_Sound.currentTime = 0;
  document.getElementById('volumeBtn').src = 'assets/img/menu_description/volume_off.svg';
  mute = true;
  toggleAllSounds();
}

/**
 * Toggles the visibility of the keyboard instructions panel.
 * @param {Event} event - The trigger event.
 */
function toggleKeyboardInstruction(event) {
  toggleElementVisibility(event, 'keyboardBtnInfo');
}

/**
 * Toggles the visibility of the impressum (legal notice) panel.
 * @param {Event} event - The trigger event.
 */
function toggleImpressum(event) {
  toggleElementVisibility(event, 'impressumBtnInfo');
}

/**
 * Generic function to toggle the visibility of a UI element by adding/removing the 'show' class.
 * @param {Event} event - The trigger event.
 * @param {string} elementId - The ID of the DOM element to toggle.
 */
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

/**
 * Requests the fullscreen mode for the game container.
 */
function toggleFullscreen() {
  let canvas = document.getElementById('fullscreen');
  enterFullscreen(canvas);
}

/**
 * Cross-browser implementation to enter fullscreen mode.
 * @param {HTMLElement} element - The element to display in fullscreen.
 */
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

/**
 * Cross-browser implementation to exit fullscreen mode.
 */
function exitFullscreen() {
  if (document.fullscreenElement || document.webkitFullscreenElement) {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
}

/**
 * Event listeners for handling screen orientation changes.
 */
window.addEventListener('resize', checkScreenOrientation);
window.addEventListener('orientationchange', checkScreenOrientation);
document.addEventListener('DOMContentLoaded', () => {
  checkScreenOrientation();
});

/**
 * Checks if the device is in portrait mode and displays a rotation prompt if necessary.
 */
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

/**
 * Initializes close buttons for UI panels once the DOM is fully loaded.
 */
document.addEventListener('DOMContentLoaded', () => {
  setupCloseButton('closeInstructionsBtn', 'keyboardBtnInfo');
  setupCloseButton('closeImpressumBtn', 'impressumBtnInfo');
});

/**
 * Sets up a click listener for a close button to hide a specific info panel.
 * @param {string} closeBtnId - The ID of the button element.
 * @param {string} infoPanelId - The ID of the panel to be closed.
 */
function setupCloseButton(closeBtnId, infoPanelId) {
  const CLOSE_BTN = document.getElementById(closeBtnId);
  const INFO_PANEL = document.getElementById(infoPanelId);
  CLOSE_BTN.addEventListener('click', (event) => {
    event.stopPropagation();
    INFO_PANEL.classList.remove('show');
    playAudio(swipeSound, 0.5, 0);
  });
}