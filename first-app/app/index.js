const calc = require('./calc')
const concat = require('./concat')

const numbersToAdd = [
    1, 2, 3, 4, 5
]

const numbersToContact1 = [
    1, 2, 3, 4, 5
]
const numbersToContact2 = [
    6, 7, 8, 9, 10
]

const result = calc.sum(numbersToAdd)
const result2 = concat.concat(numbersToContact1, numbersToContact2)

console.log(`The result of the sum is ${result}`)

console.log(`The result of the sum is ${result2}`)