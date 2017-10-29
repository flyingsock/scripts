const fs = require('fs');       //модуль для чтения файла

const mode = process.argv[2];   //режим работы (cipher, decipher, hack)
const input = process.argv[3];  //откуда читать
const output = process.argv[4]; //куда записывать

const POPULAR_LETTER_CODE = 69; //e - самая популярная буква

function fromFile(name) {       //есл файл input пустой
    const message = fs.readFileSync(input, "ascii");
    if (message.length < 1) {
        throw new ReferenceError("Input file is empty");
    }
    return message;
}

function cipher(message, shift) {
    //преобразует в текст из больших букв, шифрует сообщение
    return message.toUpperCase().replace(/[A-Z]/g, c => String.fromCharCode((c.charCodeAt(0)-65+shift)%26+65));
}
function decipher(message, shift) {
    //преобразует в текст из больших букв, дешифрует сообщение
    return message.toUpperCase().replace(/[A-Z]/g, c => String.fromCharCode((c.charCodeAt(0)-65-shift+26)%26+65));
}
function hack(incoming) {
    //избавляемся от пробелов, т.к. их в тексте может быть больше
    let message = incoming.toUpperCase().split(" ").join("");
    //получаем алфавит
    let uniques = message.split("").filter(function(item, i, ar) { return ar.indexOf(item) === i; });
    //размер сообщения
    let mSize = message.split("").length;
    //получаем и заполняем массив из объектов буква:частота
    let freqs = [];
    for (let i = 0; i < uniques.length; i++) {
        freqs.push({ letter: uniques[i], freq: 0 });
    }
    for (let i = 0; i < message.length; i++) {
        freqs.find(ob => ob.letter === message.split("")[i]).freq++;
    }
    //получаем самую повторяющуюся букву в зашифрованном сообщении
    let theMostFrequent = freqs.reduce((a, b) => Math.max(a.freq) > Math.max(b.freq) ? a : b);
    //получаем дешифрованное сообщение без пробелов
    let deciphered = decipher(message, theMostFrequent.letter.charCodeAt(0) - POPULAR_LETTER_CODE).split("");
    //обратно вставляем пробелы в сообщение
    for (let i = 0; i < incoming.length; i++) {
        if (incoming.split("")[i] === " ") {
            deciphered.splice(i, 0, " ");
        }
    }

    return deciphered.join("");
}

//обработка исключений
try {
    var shift;
    var message = fromFile(input);
    switch (mode) {
        case "cipher":
            shift = process.argv[5];
            if (shift < 1) {
                throw new Error("Invalid Shift Value");
            }
            fs.writeFileSync(output, cipher(message, parseInt(shift)), 'ascii');
            console.log("CIPHERED TO " + output);
            break;
        case "decipher":
            shift = process.argv[5];
            if (shift < 1) {
                throw new Error("Invalid Shift Value");
            }
            fs.writeFileSync(output, decipher(message, parseInt(shift)), 'ascii');
            console.log("DECIPHERED TO " + output);
            break;
        case "hack":
            fs.writeFileSync(output, hack(message), 'ascii');
            console.log("TRIED TO HACK INTO" + output);
            break;
        default:
            console.log("Wrong 1st argument: mode is not supported.");
    }
} catch (ReferenceError) {
    console.log("Error: Input file missing or empty");
}
