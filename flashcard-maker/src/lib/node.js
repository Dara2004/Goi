class Node {
    fs = require('fs');
    writeDataFile(data) {
        fs.writeFile('DataFile.txt', data, (err) => {
            if (err) throw err;
        })
    }
    readDataFile() {
        fs.readFile('DataFile.txt', (err, data) => {
            if (err) throw err;
            return data;
        })
    }
    tokenizer = null; // = getTokenizer(); // TODO: uncomment this after tokenizer is merged
}
