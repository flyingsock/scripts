const fs = require("fs");

var HASHES = {
    fromFile: function(fileName) {      //чтение из файла
        return fs.readFileSync(fileName, "utf8");
    },

    search: function(message, substring) {
        indexes = [];
        let substringSize = substring.length;

                //сравнение хешей подстроки с элементами из subStrings
        for (let i = 0; i < message.length; i++) {
            let currentSubstring = message.slice(i, i + substringSize);
            if (this.hashFunction(currentSubstring) === this.hashFunction(substring)) {
                if (currentSubstring === substring) {
                    indexes.push(i);
                }
            }
        }
        return indexes;
    },

    hashFunction: function(str) {            //хеш-функция
        let letters = str.split("");
        let result = 0;
        for (let i=0; i < str.length; i++) {
            result += str.charCodeAt(i) - i;
        }
        return result % 256;
    }
}

const inputFile = process.argv[2];    //откуда читать
const substring = process.argv[3];    //какую подстроку читать

try {
    var message = HASHES.fromFile(inputFile);

    /*обработчик неверных событий*/
    if ((substring.length > message.length) || (substring.length === 0) || (message.length === 0)) {
        console.log("no!");
    } else {
        var indexes = HASHES.search(message, substring);
        console.log(indexes);
    }
} catch (error) {
    console.log("error");
}
