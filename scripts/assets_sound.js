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
const SOUNDS = {
  character: {
    WALKING_SOUND : 'assets/sound/walking.mp3',
    JUMP_SOUND : 'assets/sound/jump.mp3',
    HURT_SOUND : 'assets/sound/hurt.mp3'
  },
  chicken: {
    DEAD_CHICKEN_SOUND : 'assets/sound/chicken.mp3'
  },
  smallChicken: {
    DEAD_SMALL_CHICKEN_SOUND : 'assets/sound/chicken_small.mp3'
  },
  endboss: {
    ENDBOSS_SOUND : 'assets/sound/endboss_sound.mp3',
    ENDBOSS_HURT_SOUND : 'assets/sound/chicken.mp3',
    ENDBOSS_DIE_SOUND : 'assets/sound/endboss_die.mp3'
  },
  salsaBottle: {
    THROWING_SOUND : 'assets/sound/throwing.mp3',
    NO_THROWING_SOUND : 'assets/sound/no_throwing_objects.mp3',
    BREAKING_SOUND : 'assets/sound/breaking_bottle.mp3'
  },
  gameSound : {
    SWIPE_SOUND : 'assets/sound/menu_description/swipe.mp3',
    WIN_SOUND : 'assets/sound/win.mp3',
    LOSE_SOUND : 'assets/sound/lose.mp3',
    SALSA_BOTTLE_COLLECT_SOUND : 'assets/sound/bottle_collect.mp3',
    COIN_COLLECT_SOUND : 'assets/sound/coin.mp3',
    BACKGROUND_SOUND : 'assets/sound/sandstorm_background.mp3',
  },
}

function playAudio(path, volume, repeat) {
  if (mute || !path) 
    return;

  const AUDIO = getAudioObject(path);
  if (!isValidAudio(AUDIO)) 
    return;

  setupAndPlayAudio(AUDIO, volume, repeat);
}

function getAudioObject(path) {
  return typeof path === 'string' ? new Audio(path) : path;
}

function isValidAudio(audio) {
  return audio && typeof audio.play === 'function';
}

function setupAndPlayAudio(audio, volume, repeat) {
  audio.volume = volume !== undefined ? volume : 1;
  audio.currentTime = 0;
  audio.loop = repeat == 1;

  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {});
  }
}

function stopAudio(path) {
  if (!path) 
    return;
  
  if (typeof path.pause === 'function') {
    path.pause();
    path.currentTime = 0;
  }
}