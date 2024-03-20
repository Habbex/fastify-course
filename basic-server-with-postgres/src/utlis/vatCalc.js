const VatCalc = {
    calcVAT: (netAmount) => {
        return Math.round((netAmount * 0.20) * 1e2) / 1e2
    },
    calcGrossAmount: (netAmount) => {
        return Math.round((netAmount * 1.20) * 1e2) / 1e2
    },
    calcNetAmount: (grossAmount) => {
        return Math.round((grossAmount / 1.20) * 1e2) / 1e2
    }
}

module.exports = VatCalc