const canvas = document.getElementById('stage'); 
const ctx = canvas.getContext('2d');
const grav = 2;

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
  speed: 7,
  vely: 0
}
const blocks = []; 

document.addEventListener('keydown', handleKeydown); 
document.addEventListener('keyup', handleKeyup); 
initStage();

function initStage () {
  ctx.fillStyle = "#FF0000";
  ctx.fillRect(pixel.x, pixel.y, pixel.width, pixel.height);
  new Block(0, canvas.height - 100, canvas.width, 100, "#000000");
  drawBlocks(); 
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

function movePixel () {
  if (!detectCollisionX(pixel)) {
    if (left && !right) {
      pixel.x -= pixel.speed;
    } else if (right && !left) {
      pixel.x += pixel.speed; 
    }
  }

  if (grounded && canJump && jump) {
    pixel.vely = -30; 
    canJump = false; 
    grounded = false; 
  }

  if (!grounded) {
    pixel.y += pixel.vely; 
    pixel.vely += grav; 

    if (detectGroundCollision(pixel)) {
      grounded = true;
      canJump = true; 
      pixel.vely = 0; 
      pixel.y = ground - pixel.height;
    } 
  }
}

function detectCollisionX (entity) {
  return false; 
}

// TODO: finish implementing 
function detectGroundCollision (entity) {
  const { length } = blocks; 
  for (let i=0; i<length; i++) {
    let block = blocks[i]; 
    if (isBelow(block, entity)) {
      // check if entity is ABOUT to collide with block 
      if ((entity.y + entity.height) + entity.vely >= block.y) {
        return true; 
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

function drawBlocks () {
  blocks.forEach(block => {
    ctx.fillStyle = block.color;
    ctx.fillRect(block.x, block.y, block.width, block.height);
  });
}

function draw () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  drawBlocks(); 

  ctx.fillStyle = "#ff0000";
  ctx.fillRect(pixel.x, pixel.y, pixel.width, pixel.height); 
}

function update (time) { // browser generated timestamp
  movePixel(); 
  draw(); 
  requestAnimationFrame(update);
}

/*
  Get User Input
  - add event listeners to key down events 
  - wasd/arrows, space/j

  draw rectangle based on user input 

  scroll screen based on users position in the 'world' 

*/

