
var entropy = new Vue({
    el: "#entropy",
    data: {             //объявляем блок данных
        message: "",    //входящая строка
        alphabet: [],   //список объектов буква:частота
        freqs: [],
        entropyValue: 0 //переменная для хранения значения энтропии
    },
    methods: {
        calculate: function() {     // обработчик нажатия кнопки
            if (this.message.length < 1) {      //если входная строка пустая
                alert("Incoming string is empty!");
            }

            this.alphabet = [];
            this.freqs = [];
            this.entropyValue = 0;

            let messageAsArray = this.message.split('');    //входящую строку разбиваем на символы

            this.prepareAlphabet(messageAsArray);
            this.processFreqs(messageAsArray);
            this.calculateEntropy();

        },
        prepareAlphabet: function(messageAsArray) {
            this.alphabet = messageAsArray
            .filter(function(item, i, ar) { return ar.indexOf(item) === i; });  //получаем уникальные символы
        },
        processFreqs: function(messageAsArray) {
            let mSize = messageAsArray.length;
            for (let i = 0; i < this.alphabet.length; i++) { //создаем объекты буква:частота
                this.freqs.push({letter: this.alphabet[i], freq: 0}); //заполняем его буквами, частота пока что нулевая
            }

            for (let i = 0; i < this.message.length; i++) { // заполняем объекты частотами
                this.freqs.find(ob => ob.letter === messageAsArray[i]).freq++;
            }

            for (let i = 0; i < this.freqs.length; i++) {   //высчитываем относительные частоты
                this.freqs[i].freq /= mSize;
            }
        },

        calculateEntropy: function() {      //применяем формулу для расчёта энтропии

            if (this.freqs[0].freq === 1) {
                this.entropyValue = 0;
            } else {
                let alphSizeLog = Math.log(this.alphabet.length);
                for (let i = 0; i < this.freqs.length; i++) {
                    let part = (Math.log(this.freqs[i].freq) / alphSizeLog);
                    this.entropyValue += this.freqs[i].freq * part;
                }
                this.entropyValue *= -1;
            }

        }
    }
});
