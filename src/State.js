import {enums} from './keyboard_code_enums.js';

export class State{
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

export class StateOption{
    constructor(){
        this.keyOperation = [];
    }

    setGameUI(gameUI){
        this.gameUI = gameUI;
    }
}

export class StartState extends StateOption{
    constructor(){
        super();
        this.keyOperation[enums.keyboard.ENTER] = () => {
            this.gameUI.startEvent();
        }
    }
}

export class SetBidState extends StateOption{
    constructor(){
        super();
        this.keyOperation[enums.keyboard.ENTER] = () => {
            this.gameUI.nextEvent();         
        }
    }
}

export class GameState extends StateOption{
    constructor(){
        super();
        this.keyOperation[enums.keyboard.ENTER] = () => {
            this.gameUI.checkEvent();        
        }
        
        this.keyOperation[enums.keyboard.SPACE] = () => {
            this.gameUI.getCardEvent();;        
        }
    }
}

export class FinishState extends StateOption{
    constructor(){
        super();
        this.keyOperation[enums.keyboard.ENTER] = () => {
            this.gameUI.newGameEvent();           
        }        
    }
}   