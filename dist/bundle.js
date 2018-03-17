/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

const canvas = document.getElementById('stage'); 
const ctx = canvas.getContext('2d');
const grav = 2;
const cameraBounds = 300; 
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
  speed: 7,
  vely: 0
}

document.addEventListener('keydown', handleKeydown); 
document.addEventListener('keyup', handleKeyup); 
initStage();

function initStage () {
  ctx.fillStyle = "#FF0000";
  ctx.fillRect(pixel.x, pixel.y, pixel.width, pixel.height);
  new Block(0, canvas.height - 100, canvas.width, 100, "#000000");
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

function movePixel () {
  if (!detectCollisionX(pixel)) {
    if (left && !right) {
      pixel.x -= pixel.speed;
    } else if (right && !left) {
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
  if (right && (pixel.x + pixel.width > canvas.width - cameraBounds)) {
    blocks.forEach(block => {
      block.x -= pixel.speed;
    });
  } else if (left && (pixel.x < cameraBounds)) {
    blocks.forEach(block => {
      block.x += pixel.speed;
    });
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
  ctx.fillRect(300, 0, canvas.width - 600, canvas.height); 
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
  // moveWorld();
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



/***/ })
/******/ ]);