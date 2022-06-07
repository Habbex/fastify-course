const vatCalculator = {
    calculateVAT: (netAmount) => {
        return Math.round((netAmount * 0.20) * 1e2) / 1e2;
    },
    calculateGrossAmount: (netAmount) => {
        return Math.round((netAmount * 1.20)* 1e2) / 1e2;
    },
    calculateNetAmount: (grossAmount) => {
        return Math.round((grossAmount / 1.20)* 1e2) / 1e2;
    }
}

module.exports = vatCalculator;