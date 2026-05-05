/**
 * @file keyboard.js
 * @description Handles keyboard and mobile touch input for player controls.
 */

/**
 * Class representing the keyboard input state.
 * Tracks which keys are currently pressed.
 */
class Keyboard {
  LEFT = false;
  RIGHT = false;
  UP = false;
  DOWN = false;
  SPACE = false;
  Q = false;
}

/**
 * Binds keyboard event listeners to update the Keyboard instance state.
 * Supports arrow keys and WASD for movement, space for jump, and Q for throwing.
 */
function bindKeyboardBtns() {
  window.addEventListener("keydown", (e) => {
    if (e.key == 'ArrowRight' || e.key == 'd') {
      keyboard.RIGHT = true;
    }
    if (e.key == 'ArrowDown' || e.key == 's') {
      keyboard.DOWN = true;
    }
    if (e.key == 'ArrowLeft' || e.key == 'a') {
      keyboard.LEFT = true;
    }
    if (e.key == 'ArrowUp' || e.key == 'w') {
      keyboard.UP = true;
    }
    if (e.key == ' ') {
      keyboard.SPACE = true;
    }
    if (e.key == 'q') {
      keyboard.Q = true;
    }
  });

  window.addEventListener("keyup", (e) => {
    if (e.key == 'ArrowRight' || e.key == 'd') {
      keyboard.RIGHT = false;
    }
    if (e.key == 'ArrowDown' || e.key == 's') {
      keyboard.DOWN = false;
    }
    if (e.key == 'ArrowLeft' || e.key == 'a') {
      keyboard.LEFT = false;
    }
    if (e.key == 'ArrowUp' || e.key == 'w') {
      keyboard.UP = false;
    }
    if (e.key == ' ') {
      keyboard.SPACE = false;
    }
    if (e.key == 'q') {
      keyboard.Q = false;
    }
  });
}

/**
 * Binds mobile touch event listeners to update the Keyboard instance state.
 * Uses passive:false so preventDefault() can suppress the long-press context menu.
 * touchcancel resets state when the OS interrupts a touch (e.g. swipe gesture).
 */
function bindMobileBtns() {
  bindMobileBtn('mobileBtnLeft',  () => keyboard.LEFT  = true,  () => keyboard.LEFT  = false);
  bindMobileBtn('mobileBtnRight', () => keyboard.RIGHT = true,  () => keyboard.RIGHT = false);
  bindMobileBtn('mobileBtnJump',  () => keyboard.SPACE = true,  () => keyboard.SPACE = false);
  bindMobileBtn('mobileBtnThrow', () => keyboard.Q     = true,  () => keyboard.Q     = false);
}

/**
 * Attaches touchstart, touchend, touchcancel and contextmenu listeners to a mobile button.
 * @param {string} id - Element id of the button.
 * @param {Function} onPress - Called when the button is pressed.
 * @param {Function} onRelease - Called when the button is released or cancelled.
 */
function bindMobileBtn(id, onPress, onRelease) {
  const btn = document.getElementById(id);
  btn.addEventListener('touchstart',  (e) => { e.preventDefault(); onPress();   }, { passive: false });
  btn.addEventListener('touchend',    (e) => { e.preventDefault(); onRelease(); }, { passive: false });
  btn.addEventListener('touchcancel', () => onRelease());
  btn.addEventListener('contextmenu', (e) => e.preventDefault());
}