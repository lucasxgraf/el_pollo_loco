class Keyboard {
  LEFT = false;
  RIGHT = false; 
  UP = false; 
  DOWN = false; 
  SPACE = false;
  Q = false;
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