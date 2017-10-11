const fs = require("fs"); //подключить модуль fs для работы с файлами

const mode = process.argv[2];         //режим работы
const inputFile = process.argv[3];    //откуда читать
const outputFile = process.argv[4];   //куда записывать

var RLE = {
    fromFile: function(fileName) {      //чтение из файла
        return fs.readFileSync(fileName, "ascii");
    },
    encode: function(message) {         //функция кодирования сообщения
        let length = message.length;
    	let encoded = "";
    	let repeatsCount = 1;
        let commonMessageCount = 0;

        while (commonMessageCount < length) {
            //подсчёт повторяющихся символов
    	    while ((message.charAt(commonMessageCount) === message.charAt(commonMessageCount + 1)) && (repeatsCount < 127)) {
    		    repeatsCount++;
    		    commonMessageCount++;
    		}
            //обработка случаев: нам попадается экранирующий символ # или число повторений символа больше 3
            if ((message.charAt(commonMessageCount) === "#") || (repeatsCount > 3)) {
            	encoded += "#" + String.fromCharCode(repeatsCount) + message.charAt(commonMessageCount);
            } else {
    	    	encoded += message.substr(commonMessageCount + 1 - repeatsCount, repeatsCount);
            }

    	    commonMessageCount++;
            repeatsCount = 1;
    	}

    	return encoded;
    },
    decode: function(encodedMessage) {      //функция декодирования
        let length = encodedMessage.length;
        let decoded = "";
    	let count = 0;

        while (count < length) {            //без #
    	    if (encodedMessage.charAt(count) != "#") {
    		    decoded += encodedMessage.charAt(count);
    			count++;
    		} else {
    		    for (let index = 0; index < encodedMessage.charCodeAt(count + 1); index++) {
    			    decoded += encodedMessage.charAt(count + 2);
                }
    			count += 3;
    		}
        }
        return decoded;
    },
    compressionQuantity: function(message, encoded) {       //определение коэффициента сжатия
        return (message.length / encoded.length);
    }
};

var message = RLE.fromFile(inputFile);

if (mode === "code") {      //обработка выбранного режима
    let encoded = RLE.encode(message);
    fs.writeFileSync(outputFile, encoded, "ascii");
    let compressionQuantity = RLE.compressionQuantity(message, encoded);
    console.log("Compression quantity: " + compressionQuantity);

} else if (mode === "decode") {
    fs.writeFileSync(outputFile, RLE.decode(message), "ascii");
} else {
    console.log("Wrong 1st argument: mode is not supported.");
}
