class GameUI{
	constructor(element){
		this.game = new Game();
		this.player = new Human(this.game);
		this.computer = new Computer(this.game);
		this.element = element;
		this.state = new State(this);
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
		this.state.setState(new FinishState());
	}
	
	nextEvent(){
		this.player.bid = parseInt(element.querySelector("input[name='bid']").value);
		let validateResult = this.validateBid(this.player.bid);


		if (!validateResult.status){
			document.querySelector('.bid-error').innerHTML = validateResult.message;
			return false;
		}

		this.element.querySelector(".cash_player").innerHTML = this.player.cash;
		this.element.querySelector(".bid").innerHTML = this.player.bid;
		this.element.querySelector(".page-bid").style.display = 'none';
		this.element.querySelector(".page-game").style.display = 'block';
		this.state.setState(new GameState());
	}

	setLanguages(languages){
		this.language = new Language(this.element, languages);
		
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
		this.player.points = 0;
		this.computer.points = 0;
		this.state.setState(new SetBidState());	

		if (this.player.cash <= 0){
			this.element.querySelector(".lose-message").innerHTML = this.language.translate('loseTryAgain');
			this.state.setState(new StartState());	
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
			this.state.setState(new FinishState());
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