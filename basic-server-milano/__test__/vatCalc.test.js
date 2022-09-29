
const vatCalc= require('../src/utlis/vatCalc')

describe("VAT calc", () => {
    test('Should return the correct VAT excluded amount for 20% VAT', () => {
        // arranged and act of input 16.67
        const result = vatCalc.calcVAT(16.67)
        // assert 
        expect(result).toBe(3.33)
    })

    test('Should return the correct gross amount for 20% VAT', () => {
        // arrange and act of input 16.67
        const result = vatCalc.calcGrossAmount(16.67)
        // assert
        expect(result).toBe(20.00)
    })

    test('Should return the correct net amount for 20% VAT', () => {
        // arrange and act of input 20.00
        const result = vatCalc.calcNetAmount(20.00)
        // assert
        expect(result).toBe(16.67)
    })
})