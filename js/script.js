
let element = document.getElementById("blackjack");
let languages = {
    pl : lang_pl,
    en : lang_en
}

let gameUI = new GameUI(element);
gameUI.setLanguages(languages);