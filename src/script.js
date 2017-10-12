import {GameUI} from './GameUI.js';
import {langEn} from './language-en.js';
import {langPl} from './language-pl.js';
require('./../scss/styles.scss');
require('./../scss/buttons.scss');
 
let element = document.getElementById("blackjack");
let languages = {
    pl : langPl,
    en : langEn
}

let gameUI = new GameUI(element);
gameUI.setLanguages(languages);

