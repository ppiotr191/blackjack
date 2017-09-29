class Computer extends Player {
    
    isPassed() {
        if (this.points >= 16) {
            return true;
        }
        return false;
    }
}