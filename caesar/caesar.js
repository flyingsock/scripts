const fs = require('fs');

const mode = process.argv[2];
const input = process.argv[3];
const output = process.argv[4];

const POPULAR_LETTER_CODE = 69;

function cypher(message, shift) {
    //return message.toUpperCase().split("").map(c => String.fromCharCode((c.charCodeAt(0) - 65 + shift) % 25 + 65)).join("");
    return message.toUpperCase().replace(/[A-Z]/g, c => String.fromCharCode(c.charCodeAt(0) + shift))
}

function decypher(message, shift) {
    //return message.toUpperCase().split("").map(c => String.fromCharCode((c.charCodeAt(0) - 65 - shift) % 25 + 65)).join("");
    return message.toUpperCase().replace(/[A-Z]/g, c => String.fromCharCode(c.charCodeAt(0) - shift))
}

function hack(message) {
    let uniques = message.split("").filter(function(item, i, ar) { return ar.indexOf(item) === i; });

    let mSize = message.split("").length;
    let freqs = [];
    for (let i = 0; i < uniques.length; i++) {
        freqs.push({ letter: uniques[i], freq: 0 });
    }

    for (let i = 0; i < message.length; i++) {
        freqs.find(ob => ob.letter === message.split("")[i]).freq++;
    }

    let theMostFrequent = freqs.reduce((a, b) => Math.max(a.freq) > Math.max(b.freq) ? a : b);
    return decypher(message, theMostFrequent.letter.charCodeAt(0) - POPULAR_LETTER_CODE);
}

const message = fs.readFileSync(input, "ascii");
if (message.length < 1) {
    throw new Error("Input file is empty");
}

var shift;

switch (mode) {
    case "cypher":
        shift = process.argv[5];
        if (shift < 1) {
            throw new Error("Invalid SHift Value");
        }
        fs.writeFileSync(output, cypher(message, parseInt(shift)), 'ascii');
        console.log("CYPHERED TO " + output);
        break;

    case "decypher":
        shift = process.argv[5];
        if (shift < 1) {
            throw new Error("Invalid SHift Value");
        }
        fs.writeFileSync(output, decypher(message, parseInt(shift)), 'ascii');
        console.log("DECYPHERED TO " + output);
        break;
    case "hack":
        fs.writeFileSync(output, hack(message), 'ascii');
        console.log("TRIED TO HACK INTO" + output);
    default:
}