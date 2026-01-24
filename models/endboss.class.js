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
      this.handleEndbossBehavior();
      this.checkFirstContact();
    }, 150);
  
    this.healthInterval = setInterval(() => {
      this.checkHealth();
    }, 200);
  }
  
  handleEndbossBehavior() {
    if (this.meetCounter < 16 && this.meetCounter >= 0) {
      this.endbossAlert();
    } else if (this.hadFirstContact && !this.isHurt(1.5)) {
      this.endbossWalking();
      this.randomJumpOrDash();
    } else if (this.hadFirstContact) {
      this.playAnimation(this.IMAGES_HURT);
    }
  }
  
  randomJumpOrDash() {
    const rand = Math.random();
    if (rand < 0.05) {
      this.jumpToCharacter();
    } else if (rand < 0.10) {
      this.dashToCharacter();
    }
  }
  
  checkFirstContact() {
    if (world.character.position_x >= this.position_x - 450 && !this.hadFirstContact) {
      this.firstContactWithEndboss();
    }
    if (world.character.x >= this.x - 900 && !this.hadFirstContact) {
      world.throwing = false;
    }
  }
  
  checkHealth() {
    if (this.health <= 0) {
      this.endbossDieAnimation();
      stopAudio(this.ENDBOSS_SOUND);
      clearInterval(this.animateEndbossInterval);
      clearInterval(this.healthInterval);
      playAudio(this.ENDBOSS_DIE_SOUND, 0.5, 1);
    }
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
    if (!this.canJump()) 
      return;
    
    this.initiateJump();
    this.startJumpMovement();
  }

  canJump() {
    return !this.isJumping && this.hadFirstContact && !this.isObjectAboveGround();
  }

  initiateJump() {
    this.isJumping = true;
    this.speedGravityY = 35;
  }

  startJumpMovement() {
    this.jumpInterval = setInterval(() => {
      const direction = world.character.position_x < this.position_x ? -1 : 1;
      const distance = Math.abs(world.character.position_x - this.position_x);
      
      if (this.isObjectAboveGround()) {
        this.handleJumpMovement(direction, distance);
      } else {
        this.endJump();
      }
    }, 1000 / 60);
  }

  handleJumpMovement(direction, distance) {
    if (distance > 100) {
      this.position_x += direction * 15;
    }

    this.playAnimation(this.IMAGES_ATTACK);
  }

  endJump() {
    this.isJumping = false;
    clearInterval(this.jumpInterval);
  }

  dashToCharacter() {
  if (!this.canDash()) 
    return;
  
  this.initiateDash();
  this.startDashMovement();
}

  canDash() {
    return !this.isDashing && this.hadFirstContact;
  }

  initiateDash() {
    this.isDashing = true;
    this.direction = world.character.position_x < this.position_x ? -1 : 1;
    this.originalSpeed = this.speed;
    this.speed = 30;
    this.dashDistance = 0;
    this.dashMax = 200;
    this.playAnimation(this.IMAGES_ATTACK);
  }

  startDashMovement() {
    this.dashInterval = setInterval(() => {
      if (this.dashDistance < this.dashMax) {
        this.continueDash();
      } else {
        this.endDash();
      }
    }, 30);
  }

  continueDash() {
    this.position_x += this.direction * 5;
    this.dashDistance += 5;
  }

  endDash() {
    clearInterval(this.dashInterval);
    this.speed = this.originalSpeed;
    this.isDashing = false;
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