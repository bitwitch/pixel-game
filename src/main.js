const canvas = document.getElementById('stage'); 
const ctx = canvas.getContext('2d');

const blueBuildings = new Image(); 
blueBuildings.src = "https://i.imgur.com/hh0O2uW.png";
blueBuildings.onload = function () {
  console.log('image loaded');
}

const grav = 2;
const worldEnd = 10000; 
const blocks = []; 

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
  vely: 0
}

const camera = { 
  x: 0, 
  y: 0,
  boxBound: 400
}

document.addEventListener('keydown', handleKeydown); 
document.addEventListener('keyup', handleKeyup); 
initStage();



function initStage () {
  ctx.drawImage(blueBuildings, 0, 0); 
  ctx.fillStyle = "#d54223";
  ctx.fillRect(pixel.x, pixel.y, pixel.width, pixel.height);

  new Block(0, canvas.height - 100, 10000, 100, "#429b80");
  new Block(200, 350, 300, 100, "#429b80");
  new Block(600, 150, 200, 30, "#429b80");
  new Block(900, 250, 100, 10, "#429b80");
  new Block(1032, 221, 321, 50, "#429b80");
  new Block(1244, 422, 400, 78, "#429b80");
  new Block(1312, 120, 200, 211, "#429b80");
  new Block(1727, 175, 210, 23, "#429b80");
  new Block(1963, 404, 326, 42, "#429b80");
  new Block(2221, 95, 427, 30, "#429b80");
  new Block(2338, 251, 112, 12, "#429b80");
  new Block(3075, 237, 76, 115, "#429b80");
  new Block(3531, 482, 360, 14, "#429b80");
  new Block(4004, 333, 120, 11, "#429b80");
  new Block(4246, 203, 222, 25, "#429b80");

  drawEntities(blocks); 
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
    pixel.vely = -30; 
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
  blocks.push(block); 
  return block;
}

function moveWorld () {
  if (left && camera.x <= 0) {
    return; 
  }

  if (right && (pixel.x + pixel.width >= canvas.width - camera.boxBound)) {
    camera.x += pixel.speed; 
    blocks.forEach(block => block.x -= pixel.speed);
  } else if (left && (pixel.x <= camera.boxBound)) {
    camera.x -= pixel.speed; 
    blocks.forEach(block => block.x += pixel.speed);
  } 
}

function drawEntities (collection) {
  collection.forEach(item => {
    ctx.fillStyle = item.color;
    ctx.fillRect(item.x, item.y, item.width, item.height);
  });
} 

function drawCameraBound () {
  ctx.fillStyle = "#c6c6c6";
  ctx.fillRect(camera.boxBound, 0, canvas.width - (2 * camera.boxBound), canvas.height); 
}

function draw () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  ctx.drawImage(blueBuildings, 0, 0, canvas.width, canvas.height); 
  drawEntities(blocks);
  // drawCameraBound();

  ctx.fillStyle = "#d54223";
  ctx.fillRect(pixel.x, pixel.y, pixel.width, pixel.height); 
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

