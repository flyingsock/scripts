
var hashes = new Vue({
    el: "#hashes",
    data: {             //блок данных
        message: "",    //входящая строка
        substring: "",  //входящая подстрока
        indexes: []     //индекс вхождения подстроки в строку
    },
    methods: {
        search: function() {
            this.indexes = [];
            let substringSize = this.substring.length;
            let subStrings = [];
            /*обработчик неверных событий*/
            if ((substringSize > this.message.length) || (substringSize === 0) || (this.message.length === 0)) {
                alert("NO!");
                return;
            }
            //в массив subStrings кладутся все подстроки из строки длиной в искомую
            for (let i = 0; i < this.message.length; i++) {
                subStrings.push(this.message.slice(i, i + substringSize));
            }
            //сравнение хешей подстроки с элементами из subStrings
            for (let i = 0; i < subStrings.length; i++) {
                if (hashFunction(subStrings[i]) === hashFunction(this.substring)) {
                    this.indexes.push(i);
                }
            }
        }
    },
});
function hashFunction(str) {            //хеш-функция
    return str.split("").reduce((previous, current) => {
        previous += (previous - current.charCodeAt(0));
        return previous;
    }, 0);
}
