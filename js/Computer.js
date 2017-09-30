class Computer extends Player {
    
    isPassed() {
        if (this.points >= 15) {
            return true;
        }
        return false;
    }
}