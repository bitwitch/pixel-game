const canvas = document.getElementById('stage'); 
const ctx = canvas.getContext('2d');

const blueBuildings = new Image(); 
blueBuildings.src = "https://i.imgur.com/1EQIOPV.png";
blueBuildings.onload = function () {
  console.log('image loaded');
}

const grav = 2;
const worldEnd = 11000; 
const darkGreen = "#367f69"; 
const entities = []; 
const blocks = []; 
const buildings = [];
const foreground = []; 

let started = false; 
let ground = canvas.height - 100; 
let canJump = true; 
let grounded = false;
let left, right, jump = false; 

const pixel = {
  x: 20, 
  y: 40,
  width: 50,
  height: 50,
  speed: 10,
  jumpSpeed: 30,
  vely: 0
}

const camera = { 
  x: 0, 
  y: 0,
  boxBound: 450
}

document.addEventListener('keydown', handleKeydown); 
document.addEventListener('keyup', handleKeyup); 
initStage();


function initStage () {
  ctx.drawImage(blueBuildings, 0, 0); 
  ctx.fillStyle = "#d54223";
  ctx.fillRect(pixel.x, pixel.y, pixel.width, pixel.height);

  new Block(0, canvas.height - 180, 190, 180, darkGreen);
  new Block(200, canvas.height - 100, 400, 100, darkGreen);
  new Block(650, canvas.height - 100, 600, 100, darkGreen);
  new Block(1350, canvas.height - 100, 500, 100, darkGreen);
  new Block(1950, canvas.height - 100, 500, 100, darkGreen);

  new Block(2600, canvas.height - 200, 300, 200, darkGreen);
  new Block(2900, canvas.height - 100, 300, 100, darkGreen);

  new Block(3300, canvas.height - 150, 300, 150, darkGreen);
  new Block(3500, canvas.height - 300, 300, 300, darkGreen);
  new Block(3750, canvas.height - 100, 300, 100, darkGreen);

  // tall skinny section
  new Block(4200, canvas.height - 250, 60, 250, darkGreen);
  new Block(4500, canvas.height - 400, 60, 400, darkGreen);
  new Block(4900, canvas.height - 50, 60, 50, darkGreen);

  new Block(5200, canvas.height - 127, 200, 127, darkGreen);
  new Block(5400, canvas.height - 100, 400, 10, darkGreen);
  new Block(5800, canvas.height - 127, 200, 127, darkGreen);

  new Block(6300, canvas.height - 50, 400, 50, darkGreen);
  new Block(6900, canvas.height - 200, 200, 200, darkGreen);
  new Block(7300, canvas.height - 400, 200, 400, darkGreen);

  // inside building 
  new Building(7750, canvas.height - 450, 1200, 250, "#57cca8");
  new Foreground(7950, canvas.height - 450, 40, 250, darkGreen);
  new Foreground(8150, canvas.height - 450, 40, 250, darkGreen);
  new Foreground(8350, canvas.height - 450, 40, 250, darkGreen);
  new Foreground(8550, canvas.height - 450, 40, 250, darkGreen);
  new Foreground(8750, canvas.height - 450, 40, 250, darkGreen);
  new Block(7750, canvas.height - 200, 1200, 200, darkGreen);
  new Block(7750, 0, 1200, canvas.height - 450, darkGreen);

  new Block(9100, canvas.height - 300, 300, 300, darkGreen);
  new Block(9400, canvas.height - 150, 200, 150, darkGreen);

  new Block(9800, canvas.height - 350, 100, 350, darkGreen);
  
  // drawEntities(blocks); 
}

function startGame () {
  requestAnimationFrame(update); 
}

function handleKeydown (e) {
  if (!started && e.code === "Enter") {
    startGame();
    started = true; 
  } else if (e.code === "KeyA" || e.code === "ArrowLeft") {
    left = true; 
  } else if (e.code === "KeyD" || e.code === "ArrowRight") {
    right = true;  
  } else if (e.code === "Space" || e.code === "KeyJ") {
    jump = true;
  }
}

function handleKeyup (e) {
  if (e.code === "KeyA" || e.code === "ArrowLeft") {
    left = false; 
  } else if (e.code === "KeyD" || e.code === "ArrowRight") {
    right = false;  
  } else if (e.code === "Space" || e.code === "KeyJ") {
    jump = false;
  }
}

function canMoveLeft () {
  return (
    left && 
    !right &&
    pixel.x > 0 && 
    (
      camera.x <= 0 || 
      pixel.x > camera.boxBound 
    )
  )
}

function canMoveRight () {
  return (
    right && 
    !left && 
    pixel.x + pixel.width < canvas.width &&
    (
      camera.x + canvas.width >= worldEnd || 
      pixel.x + pixel.width < canvas.width - camera.boxBound
    )
  )
}

function movePixel () {
  if (!detectCollisionX(pixel)) {
    if (canMoveLeft()) {
      pixel.x -= pixel.speed;
    } else if (canMoveRight()) {
      pixel.x += pixel.speed; 
    }
  }
  
  let collision = detectGroundCollision(pixel);
  if (collision) {
    grounded = true;
    canJump = true;
    pixel.vely = 0; 
    pixel.y = collision.y - pixel.height;
  }  else {
    grounded = false;
  }

  if (!grounded) {
    pixel.y += pixel.vely; 
    pixel.vely += grav;
  }

  if (grounded && canJump && jump) {
    pixel.vely = -pixel.jumpSpeed; 
    canJump = false; 
    grounded = false; 
  }
}

function detectCollisionX (entity) {
  return false; 
}

function detectGroundCollision (entity) {
  const { length } = blocks; 
  for (let i=0; i<length; i++) {
    let block = blocks[i]; 
    if (isBelow(block, entity)) {
      // check if entity is ABOUT to collide with block
      if (entity.y + entity.height + entity.vely >= block.y) {
        return block; 
      }
    }
  }
  return false; 
}

function isBelow (block, entity) {
  return (
    block.y >= entity.y + entity.height && 
    block.x < entity.x + entity.width && 
    block.x + block.width > entity.x
  );
}

function Block (x, y, width, height, color) {
  const block = { x, y, width, height, color }; 
  entities.push(block); 
  blocks.push(block); 
  return block;
}

function Building (x, y, width, height, color) {
  const building = { x, y, width, height, color }; 
  entities.push(building); 
  buildings.push(building); 
  return building;
}

function Foreground (x, y, width, height, color) {
  const item = { x, y, width, height, color }; 
  entities.push(item); 
  foreground.push(item); 
  return item;
}

function moveWorld () {
  if (left && camera.x <= 0) {
    return; 
  }

  if (right && (pixel.x + pixel.width >= canvas.width - camera.boxBound)) {
    camera.x += pixel.speed; 
    for (let i=0, len = entities.length; i < len; i++) {
      entities[i].x -= pixel.speed; 
    }
  } else if (left && (pixel.x <= camera.boxBound)) {
    camera.x -= pixel.speed; 
    for (let i=0, len = entities.length; i < len; i++) {
      entities[i].x += pixel.speed; 
    }
  } 
}

function drawEntities (collection) {
  for (let i=0, len=collection.length; i<len; i++) {
    let item = collection[i]; 
    ctx.fillStyle = item.color;
    ctx.fillRect(item.x, item.y, item.width, item.height);
  }
} 

function drawCameraBound () {
  ctx.fillStyle = "#c6c6c6";
  ctx.fillRect(camera.boxBound, 0, canvas.width - (2 * camera.boxBound), canvas.height); 
}

function draw () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  ctx.drawImage(blueBuildings, 0, 0, canvas.width, canvas.height); 
  // drawCameraBound();
  drawEntities(entities);
  // drawEntities(buildings);
  
  ctx.fillStyle = "#d54223";
  ctx.fillRect(pixel.x, pixel.y, pixel.width, pixel.height); 
  drawEntities(foreground);
}

function update (time) { // browser generated timestamp
  movePixel();
  moveWorld();
  draw();
  requestAnimationFrame(update);
}

 
/*

  COLOR PALLETTE: 

    buildings: 
      lighter blue #00b0bf
      mid blue #00818d
      mid blue #005862
      dark blue #00414a


    purple #dacbf0
    pink #f5b9f4
    orange #f8cb92


  Get User Input
  - add event listeners to key down events 
  - wasd/arrows, space/j

  draw rectangle based on user input 

  scroll screen based on users position in the 'world' 

*/

