class AiCoordGenerator {

    constructor() {
        this.usedNumbers = new Set()
    }
    reset() {
        this.usedNumbers.clear()
    }
    getRandomUniqueNumber() {
        const min = 0
        const max = 99
        let randomNum 

        do {
            randomNum = Math.floor(Math.random() * (max - min + 1)) + min
        } while (this.usedNumbers.has(randomNum))

        this.usedNumbers.add(randomNum)

        return randomNum
    }
}

module.exports = {
    AiCoordGenerator
}