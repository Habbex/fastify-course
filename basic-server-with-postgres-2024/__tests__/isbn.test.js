const validateIsbn = require("../src/library/validations/ibsn")

describe("vaidateIsbn", ()=>{
    it("should return true if the length is 13 digits ISBN-13", ()=>{
        //arrange
        const testIsbn = "9780060934348"
        // act
        const result= validateIsbn(testIsbn)
        //assets
        expect(result).toBe(true)
    })

    it("should return true if the length is 10 digits for ISBN-10", ()=>{
        //arrange
        const testIsbn = "1234567891"
        // act
        const result= validateIsbn(testIsbn)
        //assets
        expect(result).toBe(true)
    })

    it("should return false if the length is less than 10 digits", ()=>{
        //arrange
        const testIsbn = "123456789"
        // act
        const result= validateIsbn(testIsbn)
        //assets
        expect(result).toBe(false)
    })
})