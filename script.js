let canvas;
let world;
let keyboard = new Keyboard();
let mute = false;
let swipeSound = new Audio('assets/sound/menu_description/swipe.mp3');

function init(){
  canvas = document.getElementById('canvas');
  world = new World(canvas, keyboard);
}

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





function stopAllInterval() {
    for (let i = 1; i < 999; i++) window.clearInterval(i);
}
