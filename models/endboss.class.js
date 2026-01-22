class Endboss extends MoveableObject {
  position_x = 3900;
  position_y = 50;
  height = 400;
  width = 400;
  speed = 15;
  meetCounter = -1;
  hadFirstContact = false;
  isDead = false;
  isJumping = false;
  isDashing = false;
  healthInterval;
  animateEndbossInterval;
  endbossDieInterval;
  jumpInterval;
  dashInterval;
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
    this.applyGravity();
    this.animate();
  }

  animate() {
    this.animateEndbossInterval = setInterval(() => {
      if (this.meetCounter < 16 && this.meetCounter >= 0) {
        this.endbossAlert();
      } else if (this.hadFirstContact && !this.isHurt(1.5)) {
        this.endbossWalking();
        
        // Randomly trigger jump or dash attacks
        if (Math.random() < 0.05) { // 2% chance each frame to jump
          this.jumpToCharacter();
        } else if (Math.random() < 0.10) { // 1.5% chance each frame to dash
          this.dashToCharacter();
        }
      } else if (this.hadFirstContact) {
        this.playAnimation(this.IMAGES_HURT);
      }
      if (world.character.position_x >= this.position_x - 450 && !this.hadFirstContact) {
        this.firstContactWithEndboss();
      }
      if (world.character.x >= this.x - 900 && !this.hadFirstContact) {          
        world.throwing = false;
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

  jumpToCharacter() {
    if (!this.isJumping && this.hadFirstContact && !this.isObjectAboveGround()) {
      this.isJumping = true;
      
      this.speedGravityY = 35; // High jump force
      
      // Horizontal movement logic during the jump
      this.jumpInterval = setInterval(() => {
        // Recalculate direction and distance in each frame to ensure movement
        const direction = world.character.position_x < this.position_x ? -1 : 1;
        const distance = Math.abs(world.character.position_x - this.position_x);
        
        if (this.isObjectAboveGround()) {
          // Only move horizontally if we are further than 100 units away
          if (distance > 100) {
            this.position_x += direction * 15; // Fixed speed for reliable movement
          }
          this.playAnimation(this.IMAGES_ATTACK);
        } else {
          this.isJumping = false;
          clearInterval(this.jumpInterval);
        }
      }, 1000 / 60);
    }
  }

  /**
   * Makes the endboss dash towards the character with increased speed
   */
  dashToCharacter() {
    if (!this.isDashing && this.hadFirstContact) {
      this.isDashing = true;
      const direction = world.character.position_x < this.position_x ? -1 : 1;
      
      // Increase speed significantly for the dash
      const originalSpeed = this.speed;
      this.speed = 30; // Much faster than normal
      
      // Move in the direction of the character for a short duration
      let dashDistance = 0;
      const dashMax = 200; // Maximum distance for dash
      
      this.dashInterval = setInterval(() => {
        if (dashDistance < dashMax) {
          this.position_x += direction * 5; // Move forward quickly
          dashDistance += 5;
        } else {
          clearInterval(this.dashInterval);
          this.speed = originalSpeed; // Restore original speed
          this.isDashing = false;
        }
      }, 30);
      
      // Play attack animation during dash
      this.playAnimation(this.IMAGES_ATTACK);
    }
  }

  endbossDieAnimation() {
    this.endbossDieInterval = setInterval(() => {
      this.playAnimation(this.IMAGES_DEAD);
    }, 700);
    setTimeout(() => {
      clearInterval(this.endbossDieInterval);
      gameIsOver(true);
    }, 2300);
  }
}