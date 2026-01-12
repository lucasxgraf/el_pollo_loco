class Endboss extends MoveableObject {
  position_x = 3900;
  position_y = 145;
  height = 300;
  width = 300;
  speed = 15;
  meetCounter = -1;
  hadFirstContact = false;
  isDead = false;
  healthInterval;
  animateEndbossInterval;
  endbossDieInterval;
  offset = {
    top: 90,
    left: 40,
    right: 35,
    bottom: 10
  }
  IMAGES_ALERT = [
    'assets/img/4_enemie_boss_chicken/2_alert/G5.png',
    'assets/img/4_enemie_boss_chicken/2_alert/G6.png',
    'assets/img/4_enemie_boss_chicken/2_alert/G7.png',
    'assets/img/4_enemie_boss_chicken/2_alert/G8.png',
    'assets/img/4_enemie_boss_chicken/2_alert/G9.png',
    'assets/img/4_enemie_boss_chicken/2_alert/G10.png',
    'assets/img/4_enemie_boss_chicken/2_alert/G11.png',
    'assets/img/4_enemie_boss_chicken/2_alert/G12.png'
  ];
  IMAGES_WALKING = [
    'assets/img/4_enemie_boss_chicken/1_walk/G1.png',
    'assets/img/4_enemie_boss_chicken/1_walk/G2.png',
    'assets/img/4_enemie_boss_chicken/1_walk/G3.png',
    'assets/img/4_enemie_boss_chicken/1_walk/G4.png'
  ];
  IMAGES_ATTACK = [
    'assets/img/4_enemie_boss_chicken/3_attack/G13.png',
    'assets/img/4_enemie_boss_chicken/3_attack/G14.png',
    'assets/img/4_enemie_boss_chicken/3_attack/G15.png',
    'assets/img/4_enemie_boss_chicken/3_attack/G16.png',
    'assets/img/4_enemie_boss_chicken/3_attack/G17.png',
    'assets/img/4_enemie_boss_chicken/3_attack/G18.png',
    'assets/img/4_enemie_boss_chicken/3_attack/G19.png',
    'assets/img/4_enemie_boss_chicken/3_attack/G20.png'
  ];
  IMAGES_HURT = [
    'assets/img/4_enemie_boss_chicken/4_hurt/G21.png',
    'assets/img/4_enemie_boss_chicken/4_hurt/G22.png',
    'assets/img/4_enemie_boss_chicken/4_hurt/G23.png'
  ];
  IMAGES_DEAD = [
    'assets/img/4_enemie_boss_chicken/5_dead/G24.png',
    'assets/img/4_enemie_boss_chicken/5_dead/G25.png',
    'assets/img/4_enemie_boss_chicken/5_dead/G26.png'
  ];
  endboss_sound = new Audio('assets/sound/endboss_sound.mp3');
  endboss_die_sound = new Audio('assets/sound/endboss_die.mp3');
  endboss_hurt_sound = new Audio('assets/sound/chicken.mp3');

  constructor(){
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.animate();
  }

  animate() {
    this.animateEndbossInterval = setInterval(() => {
      if (this.meetCounter < 16 && this.meetCounter >= 0) {
        this.endbossAlert();
      } else if (this.hadFirstContact && !this.isHurt(1.5)) {
        this.endbossWalking();
      } else if (this.hadFirstContact) {
        this.playAnimation(this.IMAGES_HURT);
      }
      if (world.character.position_x >= this.position_x - 450 && !this.hadFirstContact) {          this.firstContactWithEndboss();
      }
      if (world.character.x >= this.x - 900 && !this.hadFirstContact) {          world.throwing = false;
      }
    }, 150);

    this.healthInterval = setInterval(() => {
      if (this.health <= 0) {
        this.endbossDieAnimation();
        stopAudio(this.endboss_sound);
        clearInterval(this.animateEndbossInterval);
        clearInterval(this.healthInterval);
        playAudio(this.endboss_die_sound, 0.5, 1);
      }
    }, 200);
  }

  endbossAlert() {
    this.playAnimation(this.IMAGES_ALERT);
    this.meetCounter++;
    if (this.meetCounter == 14) {
      world.throwing = true;
    }
  }

  endbossWalking() {
    this.playAnimation(this.IMAGES_WALKING);
    this.moveLeft();
  }

  firstContactWithEndboss() {
    this.meetCounter = 0;
    playAudio(this.endboss_sound, 0.15, 0);
    this.hadFirstContact = true;
    world.statusBarEndboss = new StatusBarEndboss();

  }

  endbossDieAnimation() {
    this.endbossDieInterval = setInterval(() => {
      this.playAnimation(this.IMAGES_DEAD);
    }, 700);
    setTimeout(() => {
      clearInterval(this.endbossDieInterval);
      // gameOver(true);
    }, 2300);
  }
}