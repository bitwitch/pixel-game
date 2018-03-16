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







/***/ })
/******/ ]);