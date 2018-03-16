const canvas = document.getElementById('stage'); 
const ctx = canvas.getContext('2d');
const grav = 2;

let started = false; 
let ground = canvas.height - 100; 
let left, right, jump = false; 
let canJump = true; 
let grounded = false;

const pixel = {
  position: {x: 20, y: 40},
  size: 50,
  speed: 7,
  vely: 0
}

document.addEventListener('keydown', handleKeydown); 
document.addEventListener('keyup', handleKeyup); 
initStage();

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

function moveLeft () {
  console.log('moveLeft'); 
}

function moveRight () {  
  console.log('moveRight'); 
}

function bounce () {
  console.log('jump'); 
}

function initStage () {
  ctx.fillStyle = "#FF0000";
  ctx.fillRect(pixel.position.x, pixel.position.y, pixel.size, pixel.size);
  
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, canvas.height - 100, canvas.width, 100);
}

function startGame () {
  requestAnimationFrame(update); 
}

function movePixel () {
  if (left && !right) {
    pixel.position.x -= pixel.speed;
  } else if (right && !left) {
    pixel.position.x += pixel.speed; 
  }

  if (grounded && canJump && jump) {
    pixel.vely = -30; 
    canJump = false; 
    grounded = false; 
  }

  if (!grounded) {
    pixel.position.y += pixel.vely; 
    pixel.vely += grav; 
  }

  if ((pixel.position.y + pixel.size) + pixel.vely >= ground) {
    grounded = true;
    canJump = true; 
    pixel.vely = 0; 
    pixel.position.y = ground - pixel.size;
  } 

}

function draw () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  ctx.fillStyle = "#ff0000";
  ctx.fillRect(pixel.position.x, pixel.position.y, pixel.size, pixel.size); 
  
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, canvas.height - 100, canvas.width, 100);
}

function update (time) { // browser generated timestamp
  movePixel(); 
  draw(); 
  requestAnimationFrame(update);
}


// setInterval(draw, 10);

/*
  Get User Input
  - add event listeners to key down events 
  - wasd/arrows, space/j

  draw rectangle based on user input 

  scroll screen based on users position in the 'world' 

*/





