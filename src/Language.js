export default class Language{
	
    constructor(element,languageFiles){
        this.element = element;
        this.currentLanguage = 'en'
        this.languageFiles = languageFiles;
    } 

    setLanguage(lang){
        this.currentLanguage = this.languageFiles[lang];
        this.element.querySelector(".start").innerHTML = this.translate('play');
        this.element.querySelector(".new").innerHTML = this.translate('play');
        this.element.querySelector(".next").innerHTML = this.translate('next');
        this.element.querySelector(".get-card").innerHTML = this.translate('drawCart');
        this.element.querySelector(".get-card").innerHTML = this.translate('drawCart');
        this.element.querySelector(".check").innerHTML = this.translate('stand');

        let cashLabels = this.element.querySelectorAll('.cash-label');
        for (let i = 0; i < cashLabels.length; i++){
            cashLabels[i].innerHTML = this.translate('cash');
        }

        this.element.querySelector('.bet-label').innerHTML = this.translate('bet'); 
        this.element.querySelector('.set-bet-label').innerHTML = this.translate('setBet'); 
        this.element.querySelector('.value-label').innerHTML = this.translate('cartValue'); 
        this.element.querySelector('.opponent-value-label').innerHTML = this.translate('opponentCartValue'); 


    }

    translate(word){
        return this.currentLanguage[word];
    }

}