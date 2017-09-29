class Human extends Player {
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

