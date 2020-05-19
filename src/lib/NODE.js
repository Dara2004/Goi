class NODE {
    // file stuff commented out for now: uncomment if needed
    // fs = require('fs');
    // writeDataFile(data) {
    //     fs.writeFile('DataFile.txt', data, (err) => {
    //         if (err) throw err;
    //     })
    // }
    // readDataFile() {
    //     fs.readFile('DataFile.txt', (err, data) => {
    //         if (err) throw err;
    //         return data;
    //     })
    // }
    tokenizer = null; // = getTokenizer(); // TODO: uncomment this after tokenizer is merged

    parse() {
        throw new Error('Not implemented');
    }

    evaluate() {
        throw new Error('Not implemented');
    }
}

