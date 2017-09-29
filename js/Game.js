
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