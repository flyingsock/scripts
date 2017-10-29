var Utils = {             //утилитные функции
    /*comparator: function(a, b) {        //сортировка списка объектов
        if (a.freq > b.freq) {
            return 1;
        } else if (a.freq < b.freq) {
            return -1;
        }
        return 0;
    },*/
    minLetter: function(tree) {
        let minLetter = tree[0];
        for (let i = 1; i < tree.length; i++) {
            if (tree[i].value.freq < minLetter.value.freq) {
                minLetter = tree[i];
            }
        }
        tree.splice(tree.indexOf(minLetter), 1);
        return minLetter;

    },
    Node: function(value, left, right) { //создаём конструктор узла бинарного дерева
        this.value = value;
        this.left = left;
        this.right = right;
    },
    buildTree: function(alphabet) {     //сторим бинарное дерево по входном алфавтиу с частотами
        let tree = alphabet.map((obj) => new Utils.Node(obj, null, null));
        while (tree.length > 1) {
            let leave1 = Utils.minLetter(tree);
            let leave2 = Utils.minLetter(tree);
            let result = {
                letter: leave1.value.letter + leave2.value.letter,
                freq: leave1.value.freq + leave2.value.freq
            };
            tree.push(new Utils.Node(result, leave1, leave2));
        }
        return tree[0];
    },
    traverse: function(root, alphabet, code) {      //обход в глубину для вычисления кода каждой буквы
        if (root.value.letter.length != 1) {
            Utils.traverse(root.left, alphabet, code + "0");
            Utils.traverse(root.right, alphabet, code + "1");
        } else {
            alphabet.find(obj => obj.letter === root.value.letter).code = code;
        }

    }
}

var huffman = new Vue({
    el: "#huffman",
    data: {
        message: ""
    },
    computed: {
        alphabet: function() {
            let alphabet = []; // алфавит (буквы и частоты)
            let letters = this.message.split(''); // сообщение, как массив

            // находим уникальные буквы
            let uniqueLetters = letters
            .filter(function(item, i, ar) { return ar.indexOf(item) === i; });

            // для каждой буквы создаём объект с пока нулевой частотой
            for (let i = 0; i < uniqueLetters.length; i++) {
                alphabet.push({letter: uniqueLetters[i], freq: 0, code: ""});
            }

            // вычисляем частоту для каждой буквы
            for (let i = 0; i < this.message.length; i++) {
                alphabet.find(obj => obj.letter === letters[i]).freq++;
            }
            // Сортируем по возрастанию частот.
            // Это важно, чтобы соединять соседнии буквы в родительские листы.
            //alphabet.sort(Utils.comparator);
            return alphabet;
        },
        encodedMessage: function() {
            if (this.alphabet.length > 1) {
                // Строим дерево по входному алфавиту
                let tree = Utils.buildTree(this.alphabet);

                // Совершаем обход в глубину, вычисляя коды символов
                Utils.traverse(tree, this.alphabet, "");
                //кодирование входного сообщения
                let messageCode = [];
                for (let i = 0; i < this.message.length; i++) {
                    let letterCode = this.alphabet
                    .find(obj => obj.letter === this.message[i]).code;
                    messageCode.push(letterCode);
                }
                return messageCode.join("");
            } else if (this.alphabet.length === 1) {
                this.alphabet[0].code = "0";
                return this.message.split("").map((ch) => this.alphabet[0].code).join("");
            }
        },
        decodedMessage: function() {
            if (this.alphabet.length > 1) {
                // Строим дерево
                let tree = Utils.buildTree(this.alphabet);
                let decoded = [];
                for (let i = 0; i < this.encodedMessage.length; ) {
                    // Пока не добрались до верхних листов
                    while (tree.value.letter.length != 1) {
                        if (this.encodedMessage[i] === "0") {
                            tree = tree.left;
                        } else {
                            tree = tree.right;
                        }
                        // Следующий бит - часть кода одной буквы
                        i++;
                    }
                    // Нашли букву
                    decoded.push(tree.value.letter);
                    // Пересобираем дерево, нужно искать новую букву
                    tree = Utils.buildTree(this.alphabet);
                }
                return decoded.join("");
            } else if (this.alphabet.length === 1) {
                return this.encodedMessage.split("").map((ch) => this.alphabet[0].letter).join("");
            }
        }
    }
});
