

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

class StateOption{
    constructor(){
        this.keyOperation = [];
    }

    setGameUI(gameUI){
        this.gameUI = gameUI;
    }
}

class StartState extends StateOption{
    constructor(){
        super();
        this.keyOperation[enums.keyboard.ENTER] = () => {
            console.log("StartState");
            this.gameUI.startEvent();
        }
    }
}

class SetBidState extends StateOption{
    constructor(){
        super();
        this.keyOperation[enums.keyboard.ENTER] = () => {
            console.log("StartState");
            this.gameUI.nextEvent();         
        }
    }
}

class GameState extends StateOption{
    constructor(){
        super();
        this.keyOperation[enums.keyboard.ENTER] = () => {
            console.log("Game");  
            this.gameUI.checkEvent();        
        }
        
        this.keyOperation[enums.keyboard.SPACE] = () => {
            console.log("Game");  
            this.gameUI.getCardEvent();;        
        }
    }
}

class FinishState extends StateOption{
    constructor(){
        super();
        this.keyOperation[enums.keyboard.ENTER] = () => {
            console.log("End");
            this.gameUI.newGameEvent();           
        }        
    }
}   