let canvas;
let world;
let keyboard = new Keyboard();
let mute = false;

function init(){
  canvas = document.getElementById('canvas');
  world = new World(canvas, keyboard);

  console.log('My character is', world.character);
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

function playAudio(path, volume, repeat) {
    if (mute) { 
      return
    } else {
        path.volume = volume;
        path.play();
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
