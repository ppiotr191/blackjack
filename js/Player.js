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