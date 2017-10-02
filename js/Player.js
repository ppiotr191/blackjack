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