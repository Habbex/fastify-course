const validateIsbn= (isbn)=> {
    const isbnLength= isbn.length
    if (isbnLength === 10 || isbnLength ===13) {
        return true
    }
    return false
}

module.exports= validateIsbn