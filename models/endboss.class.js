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
  IMAGES_ALERT = ALL_IMAGES.endboss.IMAGES_ALERT;
  IMAGES_WALKING = ALL_IMAGES.endboss.IMAGES_WALKING;
  IMAGES_ATTACK = ALL_IMAGES.endboss.IMAGES_ATTACK;
  IMAGES_HURT = ALL_IMAGES.endboss.IMAGES_HURT;
  IMAGES_DEAD = ALL_IMAGES.endboss.IMAGES_DEAD;
  
  ENDBOSS_SOUND = new Audio (SOUNDS.endboss.ENDBOSS_SOUND);
  ENDBOSS_DIE_SOUND = new Audio (SOUNDS.endboss.ENDBOSS_DIE_SOUND);
  ENDBOSS_HURT_SOUND = new Audio (SOUNDS.endboss.ENDBOSS_HURT_SOUND);

  constructor(){
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadImagesEndboss();
    this.applyGravity();
    this.animate();
  }
  
  loadImagesEndboss(){
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
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
        stopAudio(this.ENDBOSS_SOUND);
        clearInterval(this.animateEndbossInterval);
        clearInterval(this.healthInterval);
        playAudio(this.ENDBOSS_DIE_SOUND, 0.5, 1);
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
    if (gameEnded) 
      return;

    this.meetCounter = 0;
    if (!mute) {
      playAudio(this.ENDBOSS_SOUND, 0.15, 0);
    }
    this.hadFirstContact = true;
    world.statusBarEndboss = new StatusBarEndboss();
  }

  jumpToCharacter() {
    if (!this.isJumping && this.hadFirstContact && !this.isObjectAboveGround()) {
      this.isJumping = true;
      
      this.speedGravityY = 35;
      
      this.jumpInterval = setInterval(() => {
        const direction = world.character.position_x < this.position_x ? -1 : 1;
        const distance = Math.abs(world.character.position_x - this.position_x);
        
        if (this.isObjectAboveGround()) {
          if (distance > 100) {
            this.position_x += direction * 15;
          }
          this.playAnimation(this.IMAGES_ATTACK);
        } else {
          this.isJumping = false;
          clearInterval(this.jumpInterval);
        }
      }, 1000 / 60);
    }
  }

  dashToCharacter() {
    if (!this.isDashing && this.hadFirstContact) {
      this.isDashing = true;
      const direction = world.character.position_x < this.position_x ? -1 : 1;
      const originalSpeed = this.speed;
      this.speed = 30;
      let dashDistance = 0;
      const dashMax = 200;
      
      this.dashInterval = setInterval(() => {
        if (dashDistance < dashMax) {
          this.position_x += direction * 5;
          dashDistance += 5;
        } else {
          clearInterval(this.dashInterval);
          this.speed = originalSpeed;
          this.isDashing = false;
        }
      }, 30);
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