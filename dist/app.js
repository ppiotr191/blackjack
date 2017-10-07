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
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Player {
    
    constructor(game) {
        this.game = game;
        this.points = 0;
        this.cards = [];
    }

    resetPoints(){
        this.points = 0;
        this.cards = [];
    }

    isLost() {
        const MAXIMUM_VALUE = 21;
        if (this.points > MAXIMUM_VALUE) {
            return true;
        }
        return false;
    }

    drawCard() {
        var card = this.game.getRandomCard();
        this.cards.push(card);
        this.points = this.countPoints();
        return card;
    }

    sumValues(){
        if (this.cards == null){
            return 0;
        } 
        return this.cards.reduce((a,b) => {
            let value = b['value'];

            return b['value'] == null ? a : a + b['value'];
        },0);       
    }

    countPoints(){
        let sum = this.sumValues();
        if (sum > 21){
            for(let i in this.cards) {
                let obj = this.cards[i];
                if (obj.type === 'ace' && obj.value !== obj.additionalValue){
                    this.cards[i].value = obj.additionalValue;
                    return this.countPoints();  
                }
            };
        }
        return sum;
    }

}
/* harmony export (immutable) */ __webpack_exports__["a"] = Player;


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__GameUI_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__language_en_js__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__language_pl_js__ = __webpack_require__(10);




let element = document.getElementById("blackjack");
let languages = {
    pl : __WEBPACK_IMPORTED_MODULE_2__language_pl_js__["a" /* langPl */],
    en : __WEBPACK_IMPORTED_MODULE_1__language_en_js__["a" /* langEn */]
}

let gameUI = new __WEBPACK_IMPORTED_MODULE_0__GameUI_js__["a" /* GameUI */](element);
gameUI.setLanguages(languages);

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Game_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Player_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Human_js__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Computer_js__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__State_js__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__Language_js__ = __webpack_require__(8);







class GameUI{
	constructor(element){
		this.game = new __WEBPACK_IMPORTED_MODULE_0__Game_js__["a" /* default */]();
		this.player = new __WEBPACK_IMPORTED_MODULE_2__Human_js__["a" /* default */](this.game);
		this.computer = new __WEBPACK_IMPORTED_MODULE_3__Computer_js__["a" /* default */](this.game);
		this.element = element;
		this.state = new __WEBPACK_IMPORTED_MODULE_4__State_js__["e" /* State */](this);
		this.createEvents();
	}

	createEvents(){
		this.element.querySelector(".page-start").style.display = 'block';
		this.element.querySelector(".page-game").style.display = 'none';

		this.element.querySelector(".start").addEventListener("click", () => {
			this.startEvent();
		});
		this.element.querySelector(".new").addEventListener("click", () => {
			this.newGameEvent();
		});
		this.element.querySelector(".get-card").addEventListener("click", () => {
			this.getCardEvent();
		});
		this.element.querySelector(".check").addEventListener("click", () => {
			this.checkEvent();
		});
		this.element.querySelector(".next").addEventListener("click", () => {
			this.nextEvent();
		});

		document.addEventListener('keydown', (event) => {
			this.state.keyboardInvokeOperation(event.keyCode);
		  });

		this.element.querySelector(".flag-poland").addEventListener("click",() => {
			this.language.setLanguage('pl');
		});
		this.element.querySelector(".flag-england").addEventListener("click",() => {
			this.language.setLanguage('en');
		});
	}

	startEvent(){
		this.player.reset();
		this.start();
	}

	newGameEvent(){
		this.start();		
	}
	
	getCardEvent(){
		this.getCard();
	}
	
	checkEvent(){
		this.check();
		this.state.setState(new __WEBPACK_IMPORTED_MODULE_4__State_js__["a" /* FinishState */]());
	}
	
	nextEvent(){
		this.player.bid = parseInt(this.element.querySelector("input[name='bid']").value);
		let validateResult = this.validateBid(this.player.bid);

		if (!validateResult.status){
			document.querySelector('.bid-error').innerHTML = validateResult.message;
			return false;
		}

		this.element.querySelector(".cash_player").innerHTML = this.player.cash;
		this.element.querySelector(".bid").innerHTML = this.player.bid;
		this.element.querySelector(".page-bid").style.display = 'none';
		this.element.querySelector(".page-game").style.display = 'block';
		this.state.setState(new __WEBPACK_IMPORTED_MODULE_4__State_js__["b" /* GameState */]());
	}

	setLanguages(languages){
		this.language = new __WEBPACK_IMPORTED_MODULE_5__Language_js__["a" /* default */](this.element, languages);
		
		var userLang = navigator.language || navigator.userLanguage; 

		if (userLang.toLowerCase() === 'pl'){
			this.language.setLanguage('pl');
		}
		else {
			this.language.setLanguage('en');
		}

	}

    validateBid(bid){
        let validateResult = {status : false};
        if (isNaN(bid)){
            validateResult.message = this.language.translate('enterNumber');
            
            return validateResult;               
        }
        if(bid < 0){
            validateResult.message = this.language.translate('tooSmallBid');
            return validateResult;
        }
        if(bid > this.player.cash){
            validateResult.message = this.language.translate('notEnoughMoney');
            return validateResult;
        }
        validateResult.status = true;
        return validateResult;
    }

	restartGame(){
		this.game.initGame();
		this.player.resetPoints();
		this.computer.resetPoints();
		this.state.setState(new __WEBPACK_IMPORTED_MODULE_4__State_js__["c" /* SetBidState */]());	

		if (this.player.cash <= 0){
			this.element.querySelector(".lose-message").innerHTML = this.language.translate('loseTryAgain');
			this.state.setState(new __WEBPACK_IMPORTED_MODULE_4__State_js__["d" /* StartState */]());	
			this.element.querySelector(".page-start").style.display = 'block';
			this.element.querySelector(".page-game").style.display = 'none';
			return;
		}
		
		this.element.querySelector(".bid-error").innerHTML = "";
		this.element.querySelector(".player-card-container").innerHTML = "";
		this.element.querySelector(".message").innerHTML = "";
		this.element.querySelector(".points").innerHTML = 0;
		this.element.querySelector(".cash").innerHTML = this.player.cash;
		this.element.querySelector(".computer-card-container").innerHTML = "";
		this.element.querySelector(".computer-points").innerHTML = 0;

		this.element.querySelector(".page-start").style.display = 'none';
		this.element.querySelector(".page-bid").style.display = 'block';
		this.element.querySelector(".page-game").style.display = 'none';
		
		this.element.querySelector(".get-card").style.display = 'inline-block';
		this.element.querySelector(".check").style.display = 'inline-block';
		this.element.querySelector(".new").style.display = 'none';
		this.element.querySelector(".opponent").style.display = 'none';

		this.element.querySelector("input[name='bid']").focus();
        this.element.querySelector("input[name='bid']").select();
	}

	start(){
		this.restartGame();
	}

	getCard(){
		let card = this.player.drawCard();
		
		let cardElement = document.createElement("div");
		cardElement.className = "card " + card.class;
		this.element.querySelector(".player-card-container").appendChild(cardElement);
		this.element.querySelector(".points").innerHTML = this.player.points;

		if (this.player.isLost()) {
			this.state.setState(new __WEBPACK_IMPORTED_MODULE_4__State_js__["a" /* FinishState */]());
			this.player.cash -= this.player.bid;
			this.element.querySelector('.message').innerHTML = this.language.translate('exceedLimit');
			this.element.querySelector(".get-card").style.display = 'none';
			this.element.querySelector(".check").style.display = 'none';
			this.element.querySelector(".new").style.display = 'inline-block';
		}
	}

	check(){
		while (!this.computer.isPassed()) {
			let card = this.computer.drawCard();
			let cardElement = document.createElement("div");
			cardElement.className = "card " + card.class;
			this.element.querySelector(".computer-card-container").appendChild(cardElement);
		}
		this.element.querySelector(".computer-points").innerHTML = this.computer.points;
	
		let message;
		if (this.computer.isLost() || this.computer.points < this.player.points) {
			message = this.language.translate('win');
			this.player.cash += this.player.bid;
		}
		else if(this.computer.points === this.player.points){
			message = this.language.translate('draw');
		}
		else {
			message = this.language.translate('lose');
			this.player.cash -= this.player.bid;
		}
		this.element.querySelector('.message').innerHTML = message;
		this.element.querySelector(".get-card").style.display = 'none';
		this.element.querySelector(".check").style.display = 'none';
		this.element.querySelector(".new").style.display = 'inline-block';
		this.element.querySelector(".opponent").style.display = 'block';
	}
}
/* harmony export (immutable) */ __webpack_exports__["a"] = GameUI;


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

class Game {
    
        constructor() {
            this.initGame();
        }
    
        initGame() {
    
            this.cardPoints = [];
            let cardTypes = ['clubs', 'hearts', 'spades', 'diamonds'];
            let cardValues = {
                'ace': 11, 'two': 2, 'three': 3, 'four': 4, 'five': 5, 'six': 6,
                'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10, 'jack': 10, 'queen': 10, 'king': 10
            };
    
            for (let i in cardTypes) {
                for (let name in cardValues) {
                    let card = {
                        value: cardValues[name],
                        type: name,
                        class: name + '_' + cardTypes[i],
                    };
                    if (name === 'ace'){
                        card.additionalValue = 1;
                    }
                    this.cardPoints.push(card)
                }
            }
        }
        
        getRandomCard() {
            var desiredIndex = Math.floor(Math.random() * this.cardPoints.length);
            var card = this.cardPoints[desiredIndex];
            this.cardPoints.splice(desiredIndex, 1);
            return card;
        }
    }
/* harmony export (immutable) */ __webpack_exports__["a"] = Game;


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Player_js__ = __webpack_require__(0);


class Human extends __WEBPACK_IMPORTED_MODULE_0__Player_js__["a" /* Player */] {
	constructor(game) {
		super(game);
        this.reset();
	}

    reset(){        
		this.cash = 10000;
		this.bid = 0;
    }

	setBid(bid){
		this.bid = bid;
	}
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Human;




/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Player_js__ = __webpack_require__(0);


class Computer extends __WEBPACK_IMPORTED_MODULE_0__Player_js__["a" /* Player */] {
    
    isPassed() {
        if (this.points >= 15) {
            return true;
        }
        return false;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Computer;


/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__keyboard_code_enums_js__ = __webpack_require__(7);


class State{
    constructor(gameUI){
        this.gameUI = gameUI;
        this.setState(new StartState());
    }

    setState(state){
        this.state = state;
        this.state.setGameUI(this.gameUI);
    }

    keyboardInvokeOperation(keycode){
        let operation = this.state.keyOperation[keycode];
        if (typeof operation !== 'undefined'){
            operation();
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["e"] = State;


class StateOption{
    constructor(){
        this.keyOperation = [];
    }

    setGameUI(gameUI){
        this.gameUI = gameUI;
    }
}
/* unused harmony export StateOption */


class StartState extends StateOption{
    constructor(){
        super();
        this.keyOperation[__WEBPACK_IMPORTED_MODULE_0__keyboard_code_enums_js__["a" /* enums */].keyboard.ENTER] = () => {
            this.gameUI.startEvent();
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["d"] = StartState;


class SetBidState extends StateOption{
    constructor(){
        super();
        this.keyOperation[__WEBPACK_IMPORTED_MODULE_0__keyboard_code_enums_js__["a" /* enums */].keyboard.ENTER] = () => {
            this.gameUI.nextEvent();         
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["c"] = SetBidState;


class GameState extends StateOption{
    constructor(){
        super();
        this.keyOperation[__WEBPACK_IMPORTED_MODULE_0__keyboard_code_enums_js__["a" /* enums */].keyboard.ENTER] = () => {
            this.gameUI.checkEvent();        
        }
        
        this.keyOperation[__WEBPACK_IMPORTED_MODULE_0__keyboard_code_enums_js__["a" /* enums */].keyboard.SPACE] = () => {
            this.gameUI.getCardEvent();;        
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["b"] = GameState;


class FinishState extends StateOption{
    constructor(){
        super();
        this.keyOperation[__WEBPACK_IMPORTED_MODULE_0__keyboard_code_enums_js__["a" /* enums */].keyboard.ENTER] = () => {
            this.gameUI.newGameEvent();           
        }        
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = FinishState;
   

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return enums; });
var enums = {};   
enums.keyboard = {
      BACKSPACE: 8,
      TAB: 9,
      ENTER: 13,
      SHIFT: 16,
      CTRL: 17,
      ALT: 18,
      PAUSE: 19,
      CAPS_LOCK: 20,
      ESCAPE: 27,
      SPACE: 32,
      PAGE_UP: 33,
      PAGE_DOWN: 34,
      END: 35,
      HOME: 36,
      LEFT_ARROW: 37,
      UP_ARROW: 38,
      RIGHT_ARROW: 39,
      DOWN_ARROW: 40,
      INSERT: 45,
      DELETE: 46,
      KEY_0: 48,
      KEY_1: 49,
      KEY_2: 50,
      KEY_3: 51,
      KEY_4: 52,
      KEY_5: 53,
      KEY_6: 54,
      KEY_7: 55,
      KEY_8: 56,
      KEY_9: 57,
      KEY_A: 65,
      KEY_B: 66,
      KEY_C: 67,
      KEY_D: 68,
      KEY_E: 69,
      KEY_F: 70,
      KEY_G: 71,
      KEY_H: 72,
      KEY_I: 73,
      KEY_J: 74,
      KEY_K: 75,
      KEY_L: 76,
      KEY_M: 77,
      KEY_N: 78,
      KEY_O: 79,
      KEY_P: 80,
      KEY_Q: 81,
      KEY_R: 82,
      KEY_S: 83,
      KEY_T: 84,
      KEY_U: 85,
      KEY_V: 86,
      KEY_W: 87,
      KEY_X: 88,
      KEY_Y: 89,
      KEY_Z: 90,
      LEFT_META: 91,
      RIGHT_META: 92,
      SELECT: 93,
      NUMPAD_0: 96,
      NUMPAD_1: 97,
      NUMPAD_2: 98,
      NUMPAD_3: 99,
      NUMPAD_4: 100,
      NUMPAD_5: 101,
      NUMPAD_6: 102,
      NUMPAD_7: 103,
      NUMPAD_8: 104,
      NUMPAD_9: 105,
      MULTIPLY: 106,
      ADD: 107,
      SUBTRACT: 109,
      DECIMAL: 110,
      DIVIDE: 111,
      F1: 112,
      F2: 113,
      F3: 114,
      F4: 115,
      F5: 116,
      F6: 117,
      F7: 118,
      F8: 119,
      F9: 120,
      F10: 121,
      F11: 122,
      F12: 123,
      NUM_LOCK: 144,
      SCROLL_LOCK: 145,
      SEMICOLON: 186,
      EQUALS: 187,
      COMMA: 188,
      DASH: 189,
      PERIOD: 190,
      FORWARD_SLASH: 191,
      GRAVE_ACCENT: 192,
      OPEN_BRACKET: 219,
      BACK_SLASH: 220,
      CLOSE_BRACKET: 221,
      SINGLE_QUOTE: 222
    };

/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Language{
	
    constructor(element,languageFiles){
        this.element = element;
        this.currentLanguage = 'en'
        this.languageFiles = languageFiles;
    }

    setLanguage(lang){
        this.currentLanguage = this.languageFiles[lang];
        this.element.querySelector(".start").innerHTML = this.translate('play');
        this.element.querySelector(".next").innerHTML = this.translate('next');
        this.element.querySelector(".get-card").innerHTML = this.translate('drawCart');
        this.element.querySelector(".get-card").innerHTML = this.translate('drawCart');
        this.element.querySelector(".check").innerHTML = this.translate('stand');

        let cashLabels = this.element.querySelectorAll('.cash-label');
        for (let i = 0; i < cashLabels.length; i++){
            cashLabels[i].innerHTML = this.translate('cash');
        }

        this.element.querySelector('.bet-label').innerHTML = this.translate('bet'); 
        this.element.querySelector('.set-bet-label').innerHTML = this.translate('setBet'); 
        this.element.querySelector('.value-label').innerHTML = this.translate('cartValue'); 
        this.element.querySelector('.opponent-value-label').innerHTML = this.translate('opponentCartValue'); 


    }

    translate(word){
        return this.currentLanguage[word];
    }

}
/* harmony export (immutable) */ __webpack_exports__["a"] = Language;


/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return langEn; });
var langEn = {
    play: 'Play',
    next: 'Next',
    drawCart: 'Draw a cart',
    stand: 'Stand',
    enterNumber: "Please, enter a number",
    tooSmallBid: "Too small bet",
    notEnoughMoney: "You have not enough money",
    loseTryAgain: "You lost. Can you try again??",
    exceedLimit: "ExceedLimit 21.",
    win : 'Congratulation, you won!',
    draw : "Draw",
    lose : 'Opponent won',
    cash : 'Cash',
    setBet : 'Enter your bet',
    bet : 'Bet',
    cartValue : 'Value of cart',
    opponentCartValue : 'Value of opponent cart',
}

/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return langPl; });
var langPl = {
    play : 'Graj',
    next : 'Dalej',
    drawCart : 'Pobierz karte',
    stand : 'Pas',
    enterNumber : "Nie podano liczby",
    tooSmallBid : "Za mała stawka",
    notEnoughMoney : "Nie masz tyle pieniędzy",
    loseTryAgain :"Niestety przegraleś. Może zaczniemy od nowa?",
    exceedLimit : "Przekroczono wartość 21.",
    win : 'Gratulacje, wygraleś!',
    draw : "Remis",
    lose : 'Wygrał przeciwnik',
    cash : 'Kasa',
    setBet : 'Ustaw wysokość stawki',
    bet : 'Stawka',
    cartValue : 'Wartość kart',
    opponentCartValue : 'Wartość kart przeciwnika'
}

/***/ })
/******/ ]);