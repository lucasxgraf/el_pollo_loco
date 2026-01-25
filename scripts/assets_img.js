/**
 * @file images.js
 * @description Contains arrays of image paths for preloading and organized image assets for the game.
 */

/**
 * @constant {string[]} PRELOAD_START_IMG - List of image paths to preload at game start.
 */
const PRELOAD_START_IMG = [
  'assets/img/menu_description/arrow_left.svg',
  'assets/img/menu_description/arrow_right.svg',
  'assets/img/menu_description/arrow_upward.svg',
  'assets/img/menu_description/fullscreen_exit.svg',
  'assets/img/menu_description/fullscreen.svg',
  'assets/img/menu_description/key_a.svg',
  'assets/img/menu_description/key_d.svg',
  'assets/img/menu_description/key_q.svg',
  'assets/img/menu_description/key_w.svg',
  'assets/img/menu_description/keyboard.svg',
  'assets/img/menu_description/mobile_arrow_left.svg',
  'assets/img/menu_description/mobile_arrow_right.svg',
  'assets/img/menu_description/mobile_arrow_upward.svg',
  'assets/img/menu_description/mobile_btn_bottle.svg',
  'assets/img/menu_description/rotate_phone.png',
  'assets/img/menu_description/space_bar.svg',
  'assets/img/menu_description/volume_off.svg',
  'assets/img/menu_description/volume_up.svg',
  'assets/img/You won, you lost/You Win A.png',
  'assets/img/You won, you lost/You lost.png'
];

/**
 * @constant {Object} ALL_IMAGES - Organized image asset paths by category and animation type.
 */
const ALL_IMAGES = {
  character: {
    IMAGES_IDLE: [
      'assets/img/2_character_pepe/1_idle/idle/I-1.png',
      'assets/img/2_character_pepe/1_idle/idle/I-2.png',
      'assets/img/2_character_pepe/1_idle/idle/I-3.png',
      'assets/img/2_character_pepe/1_idle/idle/I-4.png',
      'assets/img/2_character_pepe/1_idle/idle/I-5.png',
      'assets/img/2_character_pepe/1_idle/idle/I-6.png',
      'assets/img/2_character_pepe/1_idle/idle/I-7.png',
      'assets/img/2_character_pepe/1_idle/idle/I-8.png',
      'assets/img/2_character_pepe/1_idle/idle/I-9.png',
      'assets/img/2_character_pepe/1_idle/idle/I-10.png',
    ],
    IMAGES_LONG_IDLE: [
      'assets/img/2_character_pepe/1_idle/long_idle/I-11.png',
      'assets/img/2_character_pepe/1_idle/long_idle/I-12.png',
      'assets/img/2_character_pepe/1_idle/long_idle/I-13.png',
      'assets/img/2_character_pepe/1_idle/long_idle/I-14.png',
      'assets/img/2_character_pepe/1_idle/long_idle/I-15.png',
      'assets/img/2_character_pepe/1_idle/long_idle/I-16.png',
      'assets/img/2_character_pepe/1_idle/long_idle/I-17.png',
      'assets/img/2_character_pepe/1_idle/long_idle/I-18.png',
      'assets/img/2_character_pepe/1_idle/long_idle/I-19.png',
      'assets/img/2_character_pepe/1_idle/long_idle/I-20.png',
    ],
    IMAGES_WALKING: [
      'assets/img/2_character_pepe/2_walk/W-21.png',
      'assets/img/2_character_pepe/2_walk/W-22.png',
      'assets/img/2_character_pepe/2_walk/W-23.png',
      'assets/img/2_character_pepe/2_walk/W-24.png',
      'assets/img/2_character_pepe/2_walk/W-25.png',
      'assets/img/2_character_pepe/2_walk/W-26.png',
    ],
    IMAGES_JUMPING: [
      'assets/img/2_character_pepe/3_jump/J-31.png',
      'assets/img/2_character_pepe/3_jump/J-32.png',
      'assets/img/2_character_pepe/3_jump/J-33.png',
      'assets/img/2_character_pepe/3_jump/J-34.png',
      'assets/img/2_character_pepe/3_jump/J-35.png',
      'assets/img/2_character_pepe/3_jump/J-36.png',
      'assets/img/2_character_pepe/3_jump/J-37.png',
      'assets/img/2_character_pepe/3_jump/J-38.png',
      'assets/img/2_character_pepe/3_jump/J-39.png',
    ],
    IMAGES_DEAD: [
      'assets/img/2_character_pepe/5_dead/D-51.png',
      'assets/img/2_character_pepe/5_dead/D-52.png',
      'assets/img/2_character_pepe/5_dead/D-53.png',
      'assets/img/2_character_pepe/5_dead/D-54.png',
      'assets/img/2_character_pepe/5_dead/D-55.png',
      'assets/img/2_character_pepe/5_dead/D-56.png',
      'assets/img/2_character_pepe/5_dead/D-57.png',
    ],
    IMAGES_HURT: [
      'assets/img/2_character_pepe/4_hurt/H-41.png',
      'assets/img/2_character_pepe/4_hurt/H-42.png',
      'assets/img/2_character_pepe/4_hurt/H-43.png',
    ],
  },
  endboss: {
    IMAGES_ALERT: [
      'assets/img/4_enemie_boss_chicken/2_alert/G5.png',
      'assets/img/4_enemie_boss_chicken/2_alert/G6.png',
      'assets/img/4_enemie_boss_chicken/2_alert/G7.png',
      'assets/img/4_enemie_boss_chicken/2_alert/G8.png',
      'assets/img/4_enemie_boss_chicken/2_alert/G9.png',
      'assets/img/4_enemie_boss_chicken/2_alert/G10.png',
      'assets/img/4_enemie_boss_chicken/2_alert/G11.png',
      'assets/img/4_enemie_boss_chicken/2_alert/G12.png',
    ],
    IMAGES_WALKING: [
      'assets/img/4_enemie_boss_chicken/1_walk/G1.png',
      'assets/img/4_enemie_boss_chicken/1_walk/G2.png',
      'assets/img/4_enemie_boss_chicken/1_walk/G3.png',
      'assets/img/4_enemie_boss_chicken/1_walk/G4.png',
    ],
    IMAGES_ATTACK: [
      'assets/img/4_enemie_boss_chicken/3_attack/G13.png',
      'assets/img/4_enemie_boss_chicken/3_attack/G14.png',
      'assets/img/4_enemie_boss_chicken/3_attack/G15.png',
      'assets/img/4_enemie_boss_chicken/3_attack/G16.png',
      'assets/img/4_enemie_boss_chicken/3_attack/G17.png',
      'assets/img/4_enemie_boss_chicken/3_attack/G18.png',
      'assets/img/4_enemie_boss_chicken/3_attack/G19.png',
      'assets/img/4_enemie_boss_chicken/3_attack/G20.png',
    ],
    IMAGES_HURT: [
      'assets/img/4_enemie_boss_chicken/4_hurt/G21.png',
      'assets/img/4_enemie_boss_chicken/4_hurt/G22.png',
      'assets/img/4_enemie_boss_chicken/4_hurt/G23.png',
    ],
    IMAGES_DEAD: [
      'assets/img/4_enemie_boss_chicken/5_dead/G24.png',
      'assets/img/4_enemie_boss_chicken/5_dead/G25.png',
      'assets/img/4_enemie_boss_chicken/5_dead/G26.png',
    ],
  },
  chicken: {
    IMAGES_WALKING:[
      'assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
      'assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
      'assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png',
    ],
    IMAGES_DEAD:[
      'assets/img/3_enemies_chicken/chicken_normal/2_dead/dead.png',
    ]
  },
  smallChicken: {
    IMAGES_WALKING:[
      'assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
      'assets/img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
      'assets/img/3_enemies_chicken/chicken_small/1_walk/3_w.png',
    ],
    IMAGES_DEAD:[
      'assets/img/3_enemies_chicken/chicken_small/2_dead/dead.png',
    ]
  },
  clouds: [
    'assets/img/5_background/layers/4_clouds/1.png',
    'assets/img/5_background/layers/4_clouds/2.png',
  ],
  backgroundLayers: [
    'assets/img/5_background/layers/air.png',
    'assets/img/5_background/layers/3_third_layer/1.png',
    'assets/img/5_background/layers/2_second_layer/1.png',
    'assets/img/5_background/layers/1_first_layer/1.png',
    'assets/img/5_background/layers/3_third_layer/2.png',
    'assets/img/5_background/layers/2_second_layer/2.png',
    'assets/img/5_background/layers/1_first_layer/2.png',
  ],
  coins: [
    'assets/img/8_coin/coin_1.png',
    'assets/img/8_coin/coin_2.png',
  ],
  salsaBottles: [
    'assets/img/6_salsa_bottle/salsa_bottle.png',
    'assets/img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
    'assets/img/6_salsa_bottle/2_salsa_bottle_on_ground.png',
  ],
  salsaBottlesRotation: [
    'assets/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
    'assets/img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
    'assets/img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
    'assets/img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png',
  ],
  salsaBottlesBreak: [
    'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
    'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
    'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
    'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
    'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
    'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png',
  ],
  statusbars: {
    IMAGES_STATUS_BAR_HEALTH: [
      'assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png',
      'assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png',
      'assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png',
      'assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png',
      'assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png',
      'assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png',
    ],
    IMAGES_STATUS_BAR_COIN: [
      'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/0.png',
      'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/20.png',
      'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/40.png',
      'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/60.png',
      'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/80.png',
      'assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/100.png',
    ],
    IMAGES_STATUS_BAR_SALSA_BOTTLE: [
      'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/0.png',
      'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/20.png',
      'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/40.png',
      'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/60.png',
      'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/80.png',
      'assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/100.png',
    ],
    IMAGES_STATUS_BAR_ENDBOSS: [
      'assets/img/7_statusbars/2_statusbar_endboss/green/green0.png',
      'assets/img/7_statusbars/2_statusbar_endboss/green/green20.png',
      'assets/img/7_statusbars/2_statusbar_endboss/green/green40.png',
      'assets/img/7_statusbars/2_statusbar_endboss/green/green60.png',
      'assets/img/7_statusbars/2_statusbar_endboss/green/green80.png',
      'assets/img/7_statusbars/2_statusbar_endboss/green/green100.png',
    ],
  }
};