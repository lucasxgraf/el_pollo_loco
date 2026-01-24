/**
 * @file keyboard.js
 * @description Handles keyboard and mobile touch input for player controls.
 */

/**
 * Class representing the keyboard input state.
 * Tracks which keys are currently pressed.
 */
class Keyboard {
  /** @type {boolean} Whether the left movement key is pressed. */
  LEFT = false;

  /** @type {boolean} Whether the right movement key is pressed. */
  RIGHT = false;

  /** @type {boolean} Whether the up movement key is pressed. */
  UP = false;

  /** @type {boolean} Whether the down movement key is pressed. */
  DOWN = false;

  /** @type {boolean} Whether the jump (space) key is pressed. */
  SPACE = false;

  /** @type {boolean} Whether the throw (Q) key is pressed. */
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
 * Supports left, right, jump, and throw buttons for mobile controls.
 */
function bindMobileBtns() {
  document.getElementById('mobileBtnLeft').addEventListener('touchstart', (e) => {
    if (e.cancelable) {
      e.preventDefault();
    }
    keyboard.LEFT = true;
  });
  document.getElementById('mobileBtnLeft').addEventListener('touchend', (e) => {
    if (e.cancelable) {
      e.preventDefault();
    }
    keyboard.LEFT = false;
  });
  document.getElementById('mobileBtnRight').addEventListener('touchstart', (e) => {
    if (e.cancelable) {
      e.preventDefault();
    }
    keyboard.RIGHT = true;
  });
  document.getElementById('mobileBtnRight').addEventListener('touchend', (e) => {
    if (e.cancelable) {
      e.preventDefault();
    }
    keyboard.RIGHT = false;
  });
  document.getElementById('mobileBtnJump').addEventListener('touchstart', (e) => {
    if (e.cancelable) {
      e.preventDefault();
    }
    keyboard.SPACE = true;
  });
  document.getElementById('mobileBtnJump').addEventListener('touchend', (e) => {
    if (e.cancelable) {
      e.preventDefault();
    }
    keyboard.SPACE = false;
  });
  document.getElementById('mobileBtnThrow').addEventListener('touchstart', (e) => {
    if (e.cancelable) {
      e.preventDefault();
    }
    keyboard.Q = true;
  });
  document.getElementById('mobileBtnThrow').addEventListener('touchend', (e) => {
    if (e.cancelable) {
      e.preventDefault();
    }
    keyboard.Q = false;
  });
}