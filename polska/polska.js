var readline = require('readline');     //модуль для чтения из консоли

var rl = readline.createInterface({     //подключаем стандартные потоки ввода-вывода
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

//вывод приглашения ко вводу
rl.setPrompt('Type expression (infix notation, separeted with whitespace)> ');

const Polska = {
    operators: "+-*/^()",
    //проверка наличия оператора
    checkOperator: function (member) {
        return this.operators.indexOf(member) != -1;
    },
    //вычисление приоритетов для каждого оператора
    priorityOf: function (operator) {
        if (operator == '+' || operator == '-')
            return 1;
        if (operator == '/' || operator == '*')
            return 2;
        if (operator == '^')
            return 3;
        return 0;
    },
    //функция перевода в ОПН
    transform: function (expr) {
        let result = "";
        let symbols = expr.split(' ');
        let stack = new Array();

        //алгоритм Дейкстры
        symbols.forEach((symbol) => {
            if (!Polska.checkOperator(symbol)) {
                result += symbol + ' ';
            //случай со скобками
            } else if(symbol == '(') {
                stack.push(symbol)
            } else if(symbol == ')') {
                let operator = stack.pop();
                while (operator !== '(') {
                    result += operator + ' ';
                    operator = stack.pop();
                }
            } else {
                let operator = stack.pop();
                while (Polska.priorityOf(symbol) <= Polska.priorityOf(operator)) {
                    result += operator + ' ';
                    operator = stack.pop();
                }
                stack.push(operator);
                stack.push(symbol);
            }
        });
        //когда закончилась входная стока
        while (stack.length > 1)
            result += stack.pop() + ' ';

        return result;
    }
}

rl.prompt();        //вывод приглашения ко вводу
//обработка входной строки
rl.on('line', function (expr) {
    if (expr.length > 1) {
        console.log("Infix Notation: " + expr);
        console.log("RPN: " + Polska.transform(expr));
    } else {
        console.log("Expression missed");
    }

    rl.prompt();
});
