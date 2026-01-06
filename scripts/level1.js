const LEVEL_1 = new Level(
  [
    new Chicken(),
    new Chicken(),
    new Chicken(),
    new Chicken(),
    new Chicken(),
    new Endboss(),
    new SmallChicken(),
    new SmallChicken(),
    new SmallChicken(),
  ],
  [
    new Cloud(),
  ],
  [],
  generateCoinRows(),
  [
    new SalsaBottle(),
    new SalsaBottle(),
    new SalsaBottle(),
    new SalsaBottle(),
    new SalsaBottle(),
  ]
);

function generateCoinRows() {
  let coins = [];
  let positions = [];
  
  for (let i = 0; i < 4; i++) {
    positions.push(300 + Math.random() * 1400);
  }
  
  positions.sort((a, b) => a - b);
  
  let numRows = 4 + Math.floor(Math.random() * 2);
  
  for (let i = 0; i < numRows; i++) {
    let x = positions[i];
    let y = 100 + Math.random() * 100;
    let spacing = 80 + Math.random() * 40;
    coins.push(new Coin(x, y));
    coins.push(new Coin(x + spacing, y, true));
    coins.push(new Coin(x + spacing * 2, y));
  }
  
  return coins;
}