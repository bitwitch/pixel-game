const canvas = document.getElementById('stage'); 
const ctx = canvas.getContext('2d');
const grav = 2;
const cameraBounds = 400; 
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
  y: 0 
}

document.addEventListener('keydown', handleKeydown); 
document.addEventListener('keyup', handleKeyup); 
initStage();

function initStage () {
  ctx.fillStyle = "#FF0000";
  ctx.fillRect(pixel.x, pixel.y, pixel.width, pixel.height);
  new Block(0, canvas.height - 100, 10000, 100, "#000000");
  new Block(200, 350, 300, 100, "#000000");
  new Block(600, 150, 200, 30, "#000000");
  new Block(900, 250, 100, 10, "#000000");
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

function canMoveLeft () {
  return (
    left && 
    !right &&
    pixel.x > 0 && 
    (
      camera.x <= 0 || 
      pixel.x > cameraBounds 
    )
  )
}

function canMoveRight () {
  return (
    right && 
    !left && 
    pixel.x + pixel.width < canvas.width - cameraBounds
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

  if (right && (pixel.x + pixel.width >= canvas.width - cameraBounds)) {
    camera.x += pixel.speed; 
    blocks.forEach(block => block.x -= pixel.speed);
  } else if (left && (pixel.x <= cameraBounds)) {
    camera.x -= pixel.speed; 
    blocks.forEach(block => block.x += pixel.speed);
  } 
}

function drawBlocks () {
  blocks.forEach(block => {
    ctx.fillStyle = block.color;
    ctx.fillRect(block.x, block.y, block.width, block.height);
  });
}

function drawCameraBounds () {
  ctx.fillStyle = "#c6c6c6";
  ctx.fillRect(cameraBounds, 0, canvas.width - (2 * cameraBounds), canvas.height); 
}

function draw () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawCameraBounds();

  drawBlocks(); 

  ctx.fillStyle = "#ff0000";
  ctx.fillRect(pixel.x, pixel.y, pixel.width, pixel.height); 
}

function update (time) { // browser generated timestamp
  movePixel();
  moveWorld();
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

