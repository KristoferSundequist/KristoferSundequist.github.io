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
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/Utils.ts":
/*!**********************!*\
  !*** ./src/Utils.ts ***!
  \**********************/
/*! exports provided: Sigmoid, Linear, deepCopy, uniformRandom, randomKey, multinomial, softmax, logit, argMax, Range, sleep, falloffMap */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Sigmoid", function() { return Sigmoid; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Linear", function() { return Linear; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "deepCopy", function() { return deepCopy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "uniformRandom", function() { return uniformRandom; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "randomKey", function() { return randomKey; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "multinomial", function() { return multinomial; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "softmax", function() { return softmax; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "logit", function() { return logit; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "argMax", function() { return argMax; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Range", function() { return Range; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sleep", function() { return sleep; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "falloffMap", function() { return falloffMap; });
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const Sigmoid = v => 1 / (1 + Math.exp((-4.9) * v));
const Linear = v => v;
function deepCopy(o) {
    return JSON.parse(JSON.stringify(o));
}
function uniformRandom() {
    return (Math.random() * 2) - 1;
}
function randomKey(obj) {
    const keys = Object.keys(obj);
    return keys[keys.length * Math.random() << 0];
}
function multinomial(probs) {
    const v = Math.random();
    let acc = 0;
    for (let i = 0; i < probs.length; i++) {
        acc += probs[i];
        if (acc >= v) {
            return i;
        }
    }
    return probs.length - 1;
}
function softmax(input) {
    const sum = input.reduce((acc, v) => Math.exp(v) + acc, 0);
    return input.map(v => Math.exp(v) / sum);
}
const logit = (p) => Math.log(p / (1 - p));
function argMax(arr) {
    let curIndex = 0;
    let curValue = -Infinity;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] > curValue) {
            curValue = arr[i];
            curIndex = i;
        }
    }
    return curIndex;
}
function Range(n) {
    return [...Array(n).keys()];
}
function sleep(time) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(resolve => setTimeout(resolve, time));
    });
}
function falloffMap(center, length, fallOff) {
    let falloffMap = Range(length).map(_ => 0);
    let falloff = 1;
    falloffMap[center] = falloff;
    for (let i = 1; i < length; i++) {
        falloff *= fallOff;
        if (center + i < length) {
            falloffMap[center + i] = falloff;
        }
        if (center - i >= 0) {
            falloffMap[center - i] = falloff;
        }
    }
    return falloffMap;
}


/***/ }),

/***/ "./src/banditswarmRaw/FullyConnectedLayer.ts":
/*!***************************************************!*\
  !*** ./src/banditswarmRaw/FullyConnectedLayer.ts ***!
  \***************************************************/
/*! exports provided: FullyConnectedLayer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FullyConnectedLayer", function() { return FullyConnectedLayer; });
/* harmony import */ var _Weight__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Weight */ "./src/banditswarmRaw/Weight.ts");
/* harmony import */ var _Utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./../Utils */ "./src/Utils.ts");


class FullyConnectedLayer {
    constructor(nInputs, nOutputs, numPossibleWeights, activation) {
        this.nInputs = nInputs;
        this.nOutputs = nOutputs;
        this.activation = activation;
        this.weights = this.initWeights(nInputs, nOutputs, numPossibleWeights);
        this.biases = this.initBiases(nOutputs, numPossibleWeights);
    }
    initWeights(nInputs, nOutputs, numPossibleWeights) {
        return Object(_Utils__WEBPACK_IMPORTED_MODULE_1__["Range"])(nInputs).map(_ => Object(_Utils__WEBPACK_IMPORTED_MODULE_1__["Range"])(nOutputs).map(_ => new _Weight__WEBPACK_IMPORTED_MODULE_0__["Weight"](numPossibleWeights)));
    }
    initBiases(nOutputs, numPossibleWeights) {
        return Object(_Utils__WEBPACK_IMPORTED_MODULE_1__["Range"])(nOutputs).map(_ => new _Weight__WEBPACK_IMPORTED_MODULE_0__["Weight"](numPossibleWeights));
    }
    update(reward, decay) {
        // update weights
        for (let wi of this.weights) {
            for (let wij of wi) {
                wij.update(reward, decay);
            }
        }
        // update biases
        this.biases.forEach(w => w.update(reward, decay));
    }
    forward(input) {
        let output = Object(_Utils__WEBPACK_IMPORTED_MODULE_1__["Range"])(this.nOutputs).map(_ => 0);
        // do weight calc
        for (let i = 0; i < this.nInputs; i++) {
            for (let j = 0; j < this.nOutputs; j++) {
                output[j] += this.weights[i][j].forward(input[i]);
            }
        }
        // apply bias
        for (let i = 0; i < this.nOutputs; i++) {
            output[i] += this.biases[i].forward(1);
        }
        return output.map(this.activation);
    }
}


/***/ }),

/***/ "./src/banditswarmRaw/Logger.ts":
/*!**************************************!*\
  !*** ./src/banditswarmRaw/Logger.ts ***!
  \**************************************/
/*! exports provided: Logger */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Logger", function() { return Logger; });
class Logger {
    constructor(decay) {
        this.reward_log = [];
        this.running_avg_reward = 0;
        this.decay = decay;
    }
    push(reward) {
        this.reward_log.push(reward);
        this.running_avg_reward = this.decay * this.running_avg_reward + (1 - this.decay) * reward;
    }
    getRunningAvg() {
        return this.running_avg_reward;
    }
    getLatest() {
        if (this.reward_log == []) {
            return NaN;
        }
        return this.reward_log[this.reward_log.length - 1];
    }
}


/***/ }),

/***/ "./src/banditswarmRaw/Model.ts":
/*!*************************************!*\
  !*** ./src/banditswarmRaw/Model.ts ***!
  \*************************************/
/*! exports provided: Model */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Model", function() { return Model; });
/* harmony import */ var _Network__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Network */ "./src/banditswarmRaw/Network.ts");
/* harmony import */ var _FullyConnectedLayer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./FullyConnectedLayer */ "./src/banditswarmRaw/FullyConnectedLayer.ts");
/* harmony import */ var _Utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./../Utils */ "./src/Utils.ts");



class Model {
    constructor(nInputs, nOutputs, weightBuckets) {
        this.network = new _Network__WEBPACK_IMPORTED_MODULE_0__["Network"]();
        this.network.addLayer(new _FullyConnectedLayer__WEBPACK_IMPORTED_MODULE_1__["FullyConnectedLayer"](nInputs, 64, weightBuckets, Math.tanh));
        this.network.addLayer(new _FullyConnectedLayer__WEBPACK_IMPORTED_MODULE_1__["FullyConnectedLayer"](64, 64, weightBuckets, Math.tanh));
        this.network.addLayer(new _FullyConnectedLayer__WEBPACK_IMPORTED_MODULE_1__["FullyConnectedLayer"](64, nOutputs, weightBuckets, n => n));
    }
    forward(n) {
        return this.network.forward(n);
    }
    act_softmax(n) {
        return Object(_Utils__WEBPACK_IMPORTED_MODULE_2__["multinomial"])(Object(_Utils__WEBPACK_IMPORTED_MODULE_2__["softmax"])(this.forward(n)));
    }
    act_Q(n) {
        return Object(_Utils__WEBPACK_IMPORTED_MODULE_2__["argMax"])(this.forward(n));
    }
    update(reward, decay) {
        this.network.update(reward, decay);
    }
}


/***/ }),

/***/ "./src/banditswarmRaw/Network.ts":
/*!***************************************!*\
  !*** ./src/banditswarmRaw/Network.ts ***!
  \***************************************/
/*! exports provided: Network */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Network", function() { return Network; });
class Network {
    constructor() {
        this.layers = [];
    }
    update(reward, decay) {
        for (let l of this.layers) {
            l.update(reward, decay);
        }
    }
    forward(input) {
        let current = input;
        for (let l of this.layers) {
            current = l.forward(current);
        }
        return current;
    }
    addLayer(newLayer) {
        // make sure layer nInputs/nOutputs match
        if (this.layers.length > 0 && newLayer.nInputs != this.layers[this.layers.length - 1].nOutputs) {
            throw Error("inputs of new layer doesnt add nOutputs of current last layer");
        }
        this.layers.push(newLayer);
    }
}


/***/ }),

/***/ "./src/banditswarmRaw/Weight.ts":
/*!**************************************!*\
  !*** ./src/banditswarmRaw/Weight.ts ***!
  \**************************************/
/*! exports provided: Weight */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Weight", function() { return Weight; });
/* harmony import */ var _Utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../Utils */ "./src/Utils.ts");

class Weight {
    constructor(numPossibleValues) {
        // init possibleValues
        this.possibleWeightValues =
            Object(_Utils__WEBPACK_IMPORTED_MODULE_0__["Range"])(numPossibleValues)
                .map(v => Object(_Utils__WEBPACK_IMPORTED_MODULE_0__["logit"])((v + 1) / (numPossibleValues + 1)));
        // init numPossibleValues
        this.numPossibleValues = numPossibleValues;
        // init banditValues
        this.banditValues =
            Object(_Utils__WEBPACK_IMPORTED_MODULE_0__["Range"])(numPossibleValues)
                .map(_ => Math.random());
        //.map(_ => Math.random()*2 - 1)
        this.setWeightToBestBandit();
        this.falloffMaps = this.getFalloffMaps();
    }
    getFalloffMaps() {
        let maps = [];
        for (let i = 0; i < this.numPossibleValues; i++) {
            maps.push(Object(_Utils__WEBPACK_IMPORTED_MODULE_0__["falloffMap"])(i, this.numPossibleValues, 0.6));
        }
        return maps;
    }
    setWeightToBestBandit() {
        this.currentWeight = this.possibleWeightValues[Object(_Utils__WEBPACK_IMPORTED_MODULE_0__["argMax"])(this.banditValues)];
    }
    updateBanditWeight(index, reward, alpha, scale) {
        this.banditValues[index] += scale * alpha * (reward - this.banditValues[index]);
    }
    update(reward, decay) {
        const alpha = 1 - decay;
        const i = Object(_Utils__WEBPACK_IMPORTED_MODULE_0__["argMax"])(this.banditValues); // OBS: assumes last weight used is highest value (i.e greedy policy)
        this.falloffMaps[i].forEach(falloff => {
            this.updateBanditWeight(i, reward, alpha, falloff);
        });
        this.setWeightToBestBandit();
    }
    forward(v) {
        return v * this.currentWeight;
    }
}


/***/ }),

/***/ "./src/banditswarmRaw/banditswarm.ts":
/*!*******************************************!*\
  !*** ./src/banditswarmRaw/banditswarm.ts ***!
  \*******************************************/
/*! exports provided: model, logger, train, agent_loop */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "model", function() { return model; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "logger", function() { return logger; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "train", function() { return train; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "agent_loop", function() { return agent_loop; });
/* harmony import */ var _games_game_slide_Game__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../games/game_slide/Game */ "./src/games/game_slide/Game.ts");
/* harmony import */ var _Utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Utils */ "./src/Utils.ts");
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./../index */ "./src/index.ts");
/* harmony import */ var _Model__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Model */ "./src/banditswarmRaw/Model.ts");
/* harmony import */ var _Logger__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Logger */ "./src/banditswarmRaw/Logger.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};





const model = new _Model__WEBPACK_IMPORTED_MODULE_3__["Model"](_games_game_slide_Game__WEBPACK_IMPORTED_MODULE_0__["Game"].action_space_size, _games_game_slide_Game__WEBPACK_IMPORTED_MODULE_0__["Game"].action_space_size, 32);
const logger = new _Logger__WEBPACK_IMPORTED_MODULE_4__["Logger"](0.9);
function train(iters, decay, epsilon = 0) {
    let g = new _games_game_slide_Game__WEBPACK_IMPORTED_MODULE_0__["Game"](_index__WEBPACK_IMPORTED_MODULE_2__["context"], _index__WEBPACK_IMPORTED_MODULE_2__["canvas_width"], _index__WEBPACK_IMPORTED_MODULE_2__["canvas_height"]);
    let reward_count = 0;
    let time = performance.now();
    for (let i = 0; i < iters; i++) {
        //const action = (Math.random() < epsilon) ? (Math.random()*Game.action_space_size << 0) : model.act_softmax(g.getState())
        const action = model.act_Q(g.getState());
        const reward = g.step(action);
        model.update(reward * (1 / (1 - decay)), decay);
        reward_count += reward;
        if (i != 0 && i % 3000 == 0) {
            const new_time = performance.now();
            g = new _games_game_slide_Game__WEBPACK_IMPORTED_MODULE_0__["Game"](_index__WEBPACK_IMPORTED_MODULE_2__["context"], _index__WEBPACK_IMPORTED_MODULE_2__["canvas_width"], _index__WEBPACK_IMPORTED_MODULE_2__["canvas_height"]);
            logger.push(reward_count);
            console.log((i / iters) * 100, "%", "reward:", reward_count, "time elapsed:", new_time - time, "running avg reward:", logger.getRunningAvg());
            time = new_time;
            reward_count = 0;
        }
    }
}
function agent_loop(iters, epsilon = 0) {
    return __awaiter(this, void 0, void 0, function* () {
        const g = new _games_game_slide_Game__WEBPACK_IMPORTED_MODULE_0__["Game"](_index__WEBPACK_IMPORTED_MODULE_2__["context"], _index__WEBPACK_IMPORTED_MODULE_2__["canvas_width"], _index__WEBPACK_IMPORTED_MODULE_2__["canvas_height"]);
        for (let i = 0; i < iters; i++) {
            //const action = (Math.random() < epsilon) ? (Math.random()*Game.action_space_size << 0) : model.act_softmax(g.getState())
            const action = model.act_Q(g.getState());
            const reward = g.step(action);
            g.render();
            yield Object(_Utils__WEBPACK_IMPORTED_MODULE_1__["sleep"])(10);
        }
    });
}


/***/ }),

/***/ "./src/games/game_slide/Circle.ts":
/*!****************************************!*\
  !*** ./src/games/game_slide/Circle.ts ***!
  \****************************************/
/*! exports provided: Circle */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Circle", function() { return Circle; });
/* harmony import */ var _Point__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Point */ "./src/games/game_slide/Point.ts");

class Circle {
    constructor(coords, radius) {
        this.coords = coords;
        this.radius = radius;
    }
    static Intersect(a, b) {
        return _Point__WEBPACK_IMPORTED_MODULE_0__["Point"].distance(a.coords, b.coords) < a.radius + b.radius;
    }
}


/***/ }),

/***/ "./src/games/game_slide/Game.ts":
/*!**************************************!*\
  !*** ./src/games/game_slide/Game.ts ***!
  \**************************************/
/*! exports provided: Game */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Game", function() { return Game; });
/* harmony import */ var _Jumper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Jumper */ "./src/games/game_slide/Jumper.ts");
/* harmony import */ var _Point__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Point */ "./src/games/game_slide/Point.ts");
/* harmony import */ var _Circle__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Circle */ "./src/games/game_slide/Circle.ts");
/* harmony import */ var _Reward__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Reward */ "./src/games/game_slide/Reward.ts");




class Game {
    constructor(context, width, height) {
        this.jumperSpeed = 10;
        this.context = context;
        this.width = width;
        this.height = height;
        this.jumper = new _Jumper__WEBPACK_IMPORTED_MODULE_0__["Jumper"](new _Circle__WEBPACK_IMPORTED_MODULE_2__["Circle"](new _Point__WEBPACK_IMPORTED_MODULE_1__["Point"](Math.random() * this.width, Math.random() * this.height), 30), this.jumperSpeed, 0.5, context, width, height);
        this.reward = new _Reward__WEBPACK_IMPORTED_MODULE_3__["Reward"](new _Circle__WEBPACK_IMPORTED_MODULE_2__["Circle"](new _Point__WEBPACK_IMPORTED_MODULE_1__["Point"](Math.random() * this.width, Math.random() * this.height), 50), context);
    }
    step(action) {
        this.jumper.step(action);
        let reward = 0;
        if (_Circle__WEBPACK_IMPORTED_MODULE_2__["Circle"].Intersect(this.jumper.Body, this.reward.Body)) {
            this.reward.Body.coords.x = Math.random() * this.width;
            this.reward.Body.coords.y = Math.random() * this.height;
            reward++;
        }
        return reward;
    }
    getState() {
        return [this.jumper.Body.coords.x / this.width, this.jumper.Body.coords.y / this.height, this.jumper.dx / this.jumperSpeed, this.jumper.dy / this.jumperSpeed, this.reward.Body.coords.x / this.width, this.reward.Body.coords.y / this.height];
    }
    render() {
        this.context.clearRect(0, 0, this.width, this.height);
        this.jumper.render();
        this.reward.render();
    }
}
Game.state_space_size = 6;
Game.action_space_size = 4;


/***/ }),

/***/ "./src/games/game_slide/Jumper.ts":
/*!****************************************!*\
  !*** ./src/games/game_slide/Jumper.ts ***!
  \****************************************/
/*! exports provided: Jumper */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Jumper", function() { return Jumper; });
class Jumper {
    constructor(body, maxSpeed, _acc, context, width, height) {
        this.Body = body;
        this.maxSpeed = maxSpeed;
        this.context = context;
        this.width = width;
        this.height = height;
        this.acc = _acc;
        this.dx = 0;
        this.dy = 0;
    }
    step(action) {
        // move
        switch (action) {
            case 0:
                {
                    if (this.dx > -this.maxSpeed)
                        this.dx -= this.acc;
                    break;
                }
            case 1:
                {
                    if (this.dy > -this.maxSpeed)
                        this.dy -= this.acc;
                    break;
                }
            case 2:
                {
                    if (this.dx < this.maxSpeed)
                        this.dx += this.acc;
                    break;
                }
            case 3:
                {
                    if (this.dy < this.maxSpeed)
                        this.dy += this.acc;
                    break;
                }
        }
        this.Body.coords.y += this.dy;
        this.Body.coords.x += this.dx;
        this.dy *= 0.99;
        this.dx *= 0.99;
        this.enforceBounderies();
    }
    enforceBounderies() {
        // Enforce x bounderies
        if (this.Body.coords.x + this.Body.radius > this.width) {
            this.dx *= -1;
            this.Body.coords.x = this.width - this.Body.radius;
        }
        if (this.Body.coords.x - this.Body.radius < 0) {
            this.dx *= -1;
            this.Body.coords.x = this.Body.radius;
        }
        //Enforce y bounderies
        if (this.Body.coords.y + this.Body.radius >= this.height) {
            this.dy *= -1;
            this.Body.coords.y = this.height - this.Body.radius;
        }
        if (this.Body.coords.y - this.Body.radius < 0) {
            this.dy *= -1;
            this.Body.coords.y = this.Body.radius;
        }
    }
    render() {
        this.context.beginPath();
        this.context.arc(this.Body.coords.x, this.Body.coords.y, this.Body.radius, 0, 2 * Math.PI, false);
        this.context.fillStyle = 'black';
        this.context.fill();
        //this.context.lineWidth = 5;
        //this.context.strokeStyle = '#003300';
        //this.context.stroke();
    }
}


/***/ }),

/***/ "./src/games/game_slide/Point.ts":
/*!***************************************!*\
  !*** ./src/games/game_slide/Point.ts ***!
  \***************************************/
/*! exports provided: Point */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Point", function() { return Point; });
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    static distance(a, b) {
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
}


/***/ }),

/***/ "./src/games/game_slide/Reward.ts":
/*!****************************************!*\
  !*** ./src/games/game_slide/Reward.ts ***!
  \****************************************/
/*! exports provided: Reward */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Reward", function() { return Reward; });
class Reward {
    constructor(body, context) {
        this.Body = body;
        this.context = context;
    }
    step() {
    }
    render() {
        this.context.beginPath();
        this.context.arc(this.Body.coords.x, this.Body.coords.y, this.Body.radius, 0, 2 * Math.PI, false);
        this.context.fillStyle = 'green';
        this.context.fill();
    }
}


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! exports provided: canvas_width, canvas_height, context */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "canvas_width", function() { return canvas_width; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "canvas_height", function() { return canvas_height; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "context", function() { return context; });
/* harmony import */ var _banditswarmRaw_banditswarm__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./banditswarmRaw/banditswarm */ "./src/banditswarmRaw/banditswarm.ts");
/* harmony import */ var _Utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Utils */ "./src/Utils.ts");
//import { BuildWorker, Calc } from './worker';
//import * as ppo from './ppo/ppo'
//import * as neat from './neat/neat'


const canvas_width = 700;
const canvas_height = 700;
const canv = document.createElement("canvas");
const context = canv.getContext("2d");
canv.id = "canvasID";
canv.height = canvas_height;
canv.width = canvas_width;
canv.style.border = "thick solid black";
document.body.appendChild(canv);
//(window as any).ppo = ppo;
//(window as any).neat = neat;
window.banditswarm = _banditswarmRaw_banditswarm__WEBPACK_IMPORTED_MODULE_0__;
window.utils = _Utils__WEBPACK_IMPORTED_MODULE_1__;


/***/ })

/******/ });
//# sourceMappingURL=main.js.map