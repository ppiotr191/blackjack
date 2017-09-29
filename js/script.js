
class Game {

	constructor() {
		this.initGame();
	}

	initGame() {
		this.points = 0;
		this.computerPoints = 0;

		this.cardPoints = [];
		let cardTypes = ['clubs', 'hearts', 'spades', 'diamonds'];
		let cardValues = {
			'ace': 11, 'two': 2, 'three': 3, 'four': 4, 'five': 5, 'six': 6,
			'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10, 'jack': 10, 'queen': 10, 'king': 10
		};

		for (let i in cardTypes) {
			for (let name in cardValues) {
				this.cardPoints.push({
					value: cardValues[name],
					class: name + '_' + cardTypes[i],
				})
			}
		}
	}

	getRandomCard() {
		var desiredIndex = Math.floor(Math.random() * this.cardPoints.length);
		var card = this.cardPoints[desiredIndex];
		this.cardPoints.splice(desiredIndex, 1);
		this.points += card.value;
		return card;
	}
}

class Player {

	constructor(game) {
		this.game = game;
		this.points = 0;
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
		this.points += card.value;
		return card;
	}
}

class Human extends Player {}

class Computer extends Player {

	isPassed() {
		if (this.points >= 16) {
			return true;
		}
		return false;
	}
}

class GameUI{
	constructor(element){

		this.element = element;
		this.restartGame();

		this.element.querySelector(".page-start").style.display = 'block';
		this.element.querySelector(".page-game").style.display = 'none';

		element.querySelector(".start").addEventListener("click",() => {
			this.start();
		});
		element.querySelector(".new").addEventListener("click",() => {
			this.start();
		});
		element.querySelector(".get-card").addEventListener("click",() => {
			this.getCard();
		});
		element.querySelector(".check").addEventListener("click",() => {
			this.check();
		});

	}

	restartGame(){
		this.game = new Game();
		this.player = new Human(this.game);
		this.computer = new Computer(this.game);

		document.querySelector(".player-card-container").innerHTML = "";
		document.querySelector(".message").innerHTML = "";
		document.querySelector(".points").innerHTML = 0;
	
		document.querySelector(".computer-card-container").innerHTML = "";
		document.querySelector(".computer-points").innerHTML = 0;

		this.element.querySelector(".page-start").style.display = 'none';
		this.element.querySelector(".page-game").style.display = 'block';
		
		this.element.querySelector(".get-card").style.display = 'inline-block';
		this.element.querySelector(".check").style.display = 'inline-block';
		this.element.querySelector(".new").style.display = 'none';
		this.element.querySelector(".opponent").style.display = 'none';
	}

	start(){
		this.restartGame();
	}

	getCard(){
		let card = this.player.drawCard();
		let cardElement = document.createElement("div");
		cardElement.className = "card " + card.class;
		this.element.querySelector(".player-card-container").appendChild(cardElement);
		this.element.querySelector(".points").innerHTML = this.game.points;
		if (this.player.isLost()) {
			this.element.querySelector('.message').innerHTML = "Przekroczono limit. Koniec gry";
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
			message = "Gratulacje! Wygrales!";
		}
		else if(this.computer.points === this.player.points){
			message = "Remis";
		}
		else {
			message = "Wygral przeciwnik";
		}
		this.element.querySelector('.message').innerHTML = message;
		this.element.querySelector(".get-card").style.display = 'none';
		this.element.querySelector(".check").style.display = 'none';
		this.element.querySelector(".new").style.display = 'inline-block';
		this.element.querySelector(".opponent").style.display = 'block';
	}
}

let element = document.getElementById("blackjack");
let gameUI = new GameUI(element);
