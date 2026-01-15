let canvas;
let world;
let keyboard = new Keyboard();
let mute = false;
let swipeSound = new Audio('assets/sound/menu_description/swipe.mp3');
let win_Sound = new Audio('assets/sound/win.mp3');
let lose_Sound = new Audio('assets/sound/lose.mp3');

function init(){

  bindKeyboardBtn();
}

function bindKeyboardBtn() {
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

function openKeyboardInstruction() {
  document.getElementById('keyboardBtnInfo').classList.add('show');
  playAudio(swipeSound, 0.5, 0);
}

function closeKeyboardInstruction() {
  document.getElementById('keyboardBtnInfo').classList.remove('show');
  playAudio(swipeSound, 0.5, 0);
}

function playAudio(path, volume, repeat) {
  if (mute) { 
    return
  } else {
    path.volume = volume;
    let playPromise = path.play();
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.log('Audio play prevented:', error);
      });
    }
      if (repeat == 1) path.loop = false;
  }
}

function stopAudio(path) {
  if (mute) { 
    return
  } else {
    path.pause();
  }
}

function playGame() {
  showStartScreenButtons();
  document.getElementById('menu').classList.add('d_none');
  document.getElementById('canvas').classList.remove('d_none');
  initLevel1();
  canvas = document.getElementById('canvas');
  world = new World(canvas, keyboard);
}

function showStartScreenButtons() {
  document.getElementById('playBtn').classList.remove('d_none');
  let settings = document.getElementById('settingsContainer');
  if(settings) settings.classList.remove('d_none');
  
  // Sicherstellen, dass die Endscreen-Elemente beim Start weg sind
  document.getElementById('youWin').classList.add('d_none');
  document.getElementById('youLost').classList.add('d_none');
  document.getElementById('endgameBtns').classList.add('d_none');
}

function gameIsOver(playerHasWon) {
  document.getElementById('canvas').classList.add('d_none');
  if (playerHasWon) {
    playerWin();
  } else {
    playerLost();
  }
}

function playerWin() {
  document.getElementById('youWin').classList.remove('d_none');
  document.getElementById('endgameBtns').classList.remove('d_none'); // Sofort anzeigen
  playAudio(win_Sound, 1, 1);
  document.getElementById('playBtn').classList.add('d_none');
}

function playerLost() {
  document.getElementById('youLost').classList.remove('d_none');
  document.getElementById('endgameBtns').classList.remove('d_none'); // Sofort anzeigen
  playAudio(lose_Sound, 1, 1);
  document.getElementById('playBtn').classList.add('d_none');
}

function showEndScreenButtons() {
  document.getElementById('playBtn').classList.add('d_none');
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
  document.getElementById('endgameBtns').classList.add('d_none'); // Buttons wieder verstecken
  playGame();
}

function goBackToMenu() {
  window.location.replace('index.html');
}

function stopAllInterval() {
  for (let i = 1; i < 999; i++) window.clearInterval(i);
}
