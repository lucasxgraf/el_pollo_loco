let LEVEL_1;

function initLevel1() {
  LEVEL_1 = new Level(
    [
      new Endboss(),
      new Chicken(),
      new Chicken(),
      new Chicken(),
      new Chicken(),
      new Chicken(),
      new SmallChicken(),
      new SmallChicken(),
      new SmallChicken(),
      new SmallChicken(),
      new SmallChicken(),
    ],
    [
      new Cloud('assets/img/5_background/layers/4_clouds/1.png', 0),    
    ],
    [],
    [
      new Coin(480, 180),
      new Coin(540, 180),
      new Coin(600, 180),
      new Coin(1280, 200),
      new Coin(1280, 140),
      new Coin(1340, 200),
      new Coin(1340, 140),
      new Coin(1800, 170),
      new Coin(1850, 170),
      new Coin(1900, 170),
      new Coin(1950, 170),
      new Coin(2675, 170),
      new Coin(2740, 170),
      new Coin(2800, 170),
      new Coin(3200, 250),
      new Coin(3300, 170),
      new Coin(3400, 250),
      new Coin(3500, 170),
      new Coin(3600, 250),
    ],
    [
      new SalsaBottle(),
      new SalsaBottle(),
      new SalsaBottle(),
      new SalsaBottle(),
      new SalsaBottle(),
      new SalsaBottle(),
    ],
    new Audio('assets/sound/sandstorm_background.mp3')

  );
}