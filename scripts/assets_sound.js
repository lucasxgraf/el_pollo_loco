/**
 * @file sounds.js
 * @description Defines sound asset paths and utility functions for playing and stopping audio.
 */

/** 
 * @constant {string[]} List of sound file paths to preload at game start.
 */
const PRELOAD_START_SOUNDS = [
  'assets/sound/walking.mp3',
  'assets/sound/jump.mp3',
  'assets/sound/hurt.mp3',
  'assets/sound/chicken.mp3',
  'assets/sound/small_chicken.mp3',
  'assets/sound/endboss_sound.mp3',
  'assets/sound/chicken.mp3',
  'assets/sound/endboss_die.mp3',
  'assets/sound/throwing.mp3',
  'assets/sound/no_throwing_objects.mp3',
  'assets/sound/breaking_bottle.mp3',
  'assets/sound/menu_description/swipe.mp3',
  'assets/sound/win.mp3',
  'assets/sound/lose.mp3',
  'assets/sound/bottle_collect.mp3',
  'assets/sound/sandstorm_background.mp3'
];

/**
 * @constant {Object} SOUNDS - Organized sound asset paths by category.
 */
const SOUNDS = {
  character: {
    WALKING_SOUND: 'assets/sound/walking.mp3',
    JUMP_SOUND: 'assets/sound/jump.mp3',
    HURT_SOUND: 'assets/sound/hurt.mp3'
  },
  chicken: {
    DEAD_CHICKEN_SOUND: 'assets/sound/chicken.mp3'
  },
  smallChicken: {
    DEAD_SMALL_CHICKEN_SOUND: 'assets/sound/chicken_small.mp3'
  },
  endboss: {
    ENDBOSS_SOUND: 'assets/sound/endboss_sound.mp3',
    ENDBOSS_HURT_SOUND: 'assets/sound/chicken.mp3',
    ENDBOSS_DIE_SOUND: 'assets/sound/endboss_die.mp3'
  },
  salsaBottle: {
    THROWING_SOUND: 'assets/sound/throwing.mp3',
    NO_THROWING_SOUND: 'assets/sound/no_throwing_objects.mp3',
    BREAKING_SOUND: 'assets/sound/breaking_bottle.mp3'
  },
  gameSound: {
    SWIPE_SOUND: 'assets/sound/menu_description/swipe.mp3',
    WIN_SOUND: 'assets/sound/win.mp3',
    LOSE_SOUND: 'assets/sound/lose.mp3',
    SALSA_BOTTLE_COLLECT_SOUND: 'assets/sound/bottle_collect.mp3',
    COIN_COLLECT_SOUND: 'assets/sound/coin.mp3',
    BACKGROUND_SOUND: 'assets/sound/sandstorm_background.mp3',
  },
};

/**
 * @constant {Object} AUDIO_CACHE - Stores Audio objects by path to prevent redundant creation.
 */
const AUDIO_CACHE = {};

/**
 * Plays an audio file or Audio object with specified volume and repeat option.
 * Does nothing if muted or if path is invalid.
 * @param {string|HTMLAudioElement} path - Audio file path or Audio object.
 * @param {number} volume - Volume level (0.0 to 1.0).
 * @param {number} repeat - If 1, audio will loop; otherwise, no loop.
 * @param {boolean} restart - If true, resets audio to start before playing.
 */
function playAudio(path, volume, repeat, restart) {
  if (mute || !path) 
    return;

  const AUDIO = getAudioObject(path);
  if (!isValidAudio(AUDIO)) 
    return;

  setupAndPlayAudio(AUDIO, volume, repeat, restart);
}

/**
 * Returns an Audio object from a path or returns the Audio object if already provided.
 * @param {string|HTMLAudioElement} path - Audio file path or Audio object.
 * @returns {HTMLAudioElement} Audio object.
 */
function getAudioObject(path) {
  if (typeof path !== 'string') return path;
  if (!AUDIO_CACHE[path]) {
    AUDIO_CACHE[path] = new Audio(path);
  }
  return AUDIO_CACHE[path];
}

/**
 * Checks if the provided audio object is valid and can be played.
 * @param {HTMLAudioElement} audio - Audio object to validate.
 * @returns {boolean} True if valid audio object.
 */
function isValidAudio(audio) {
  return audio && typeof audio.play === 'function';
}

/**
 * Configures audio properties and plays the audio.
 * Handles looping and resets playback time.
 * @param {HTMLAudioElement} audio - Audio object to play.
 * @param {number} volume - Volume level (0.0 to 1.0).
 * @param {number} repeat - If 1, audio will loop; otherwise, no loop.
 * @param {boolean} restart - If true, resets audio to start before playing.
 */
function setupAndPlayAudio(audio, volume, repeat, restart) {
  const newVolume = volume !== undefined ? volume : 1;
  if (audio.volume !== newVolume) {
    audio.volume = newVolume;
  }
  
  const isLoop = repeat == 1;
  if (audio.loop !== isLoop) {
    audio.loop = isLoop;
  }
  
  if (restart !== false) {
    audio.currentTime = 0;
  }
  
  if (audio.paused || restart !== false) {
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {});
    }
  }
}

/**
 * Stops and resets an audio playback.
 * @param {string|HTMLAudioElement} path - Audio file path or Audio object.
 */
function stopAudio(path) {
  if (!path) 
    return;
  
  if (typeof path.pause === 'function') {
    path.pause();
    path.currentTime = 0;
  }
}