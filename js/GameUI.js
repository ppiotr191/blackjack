class GameUI{
	constructor(element){
		this.game = new Game();
		this.player = new Human(this.game);
		this.computer = new Computer(this.game);
		this.element = element;

		this.element.querySelector(".page-start").style.display = 'block';
		this.element.querySelector(".page-game").style.display = 'none';

		element.querySelector(".start").addEventListener("click",() => {
            this.player.reset();

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
		element.querySelector(".next").addEventListener("click",() => {
            this.player.bid = parseInt(element.querySelector("input[name='bid']").value);
            let validateResult = this.validateBid(this.player.bid);

            if (!validateResult.status){
                document.querySelector('.bid-error').innerHTML = validateResult.message;
                return false;
            }

			document.querySelector(".cash_player").innerHTML = this.player.cash;
			document.querySelector(".bid").innerHTML = this.player.bid;
			this.element.querySelector(".page-bid").style.display = 'none';
			this.element.querySelector(".page-game").style.display = 'block';
		});
	}

    validateBid(bid){
        let validateResult = {status : false};
        if (isNaN(bid)){
            validateResult.message = "Nie podano liczby";
            
            return validateResult;               
        }
        if(bid < 0){
            validateResult.message = "Za mala stawka";
            return validateResult;
        }
        if(bid > this.player.cash){
            validateResult.message = "Nie masz tyle pieniedzy";
            return validateResult;
        }
        validateResult.status = true;
        return validateResult;
    }

	restartGame(){
		this.game.initGame();
		this.player.points = 0;
		this.computer.points = 0;
		
		if (this.player.cash <= 0){
			document.querySelector(".lose-message").innerHTML ="Niestety przegrales. Moze zaczniemy od nowa?";
			
			this.element.querySelector(".page-start").style.display = 'block';
			this.element.querySelector(".page-game").style.display = 'none';
			return;
		}
		
		document.querySelector(".bid-error").innerHTML = "";
		document.querySelector(".player-card-container").innerHTML = "";
		document.querySelector(".message").innerHTML = "";
		document.querySelector(".points").innerHTML = 0;
		document.querySelector(".cash").innerHTML = this.player.cash;
		document.querySelector(".computer-card-container").innerHTML = "";
		document.querySelector(".computer-points").innerHTML = 0;

		this.element.querySelector(".page-start").style.display = 'none';
		this.element.querySelector(".page-bid").style.display = 'block';
		this.element.querySelector(".page-game").style.display = 'none';
		
		this.element.querySelector(".get-card").style.display = 'inline-block';
		this.element.querySelector(".check").style.display = 'inline-block';
		this.element.querySelector(".new").style.display = 'none';
		this.element.querySelector(".opponent").style.display = 'none';
	}

	start(){
        this.element.querySelector("input[name='bid']").focus();
        this.element.querySelector("input[name='bid']").select();
		this.restartGame();
	}

	getCard(){
		let card = this.player.drawCard();
		let cardElement = document.createElement("div");
		cardElement.className = "card " + card.class;
		this.element.querySelector(".player-card-container").appendChild(cardElement);
		this.element.querySelector(".points").innerHTML = this.player.points;
		if (this.player.isLost()) {
			this.player.cash -= this.player.bid;
			this.element.querySelector('.message').innerHTML = "Przekroczono wartosc 21.";
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
			this.player.cash += this.player.bid;
		}
		else if(this.computer.points === this.player.points){
			message = "Remis";
		}
		else {
			message = "Wygral przeciwnik";
			this.player.cash -= this.player.bid;
		}
		this.element.querySelector('.message').innerHTML = message;
		this.element.querySelector(".get-card").style.display = 'none';
		this.element.querySelector(".check").style.display = 'none';
		this.element.querySelector(".new").style.display = 'inline-block';
		this.element.querySelector(".opponent").style.display = 'block';
	}
}