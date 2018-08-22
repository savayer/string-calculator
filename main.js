document.addEventListener('DOMContentLoaded', function() {
    var field      = document.querySelector('input#expression'),
        buttons    = document.querySelectorAll('.btn'),
        calculate  = document.getElementById('calculate'),
        deleteLast = document.getElementById('delete'),
        clear      = document.getElementById('clear'),
        operators  = {
            '+'   : (x, y) => x + y,
            '-'   : (x, y) => x - y,
            '*'   : (x, y) => x * y,
            '/'   : (x, y) => x / y,
            'pow' :     x => Math.pow(x,2),
            'sqrt':     x => Math.sqrt(x)
        };

    for (var i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', function() {
            if (this.getAttribute('data-action')) {
                field.value += this.getAttribute('data-action');
            }
        })
    }
    
    const evaluate = (expr) => {
        let stack = [];
        
        expr.split(' ').forEach((token) => {
            //console.log(`token = ${token}, stack = ${stack} `);
            if (token in operators) {
                let [y, x] = [stack.pop(), stack.pop()];
                stack.push(operators[token](x, y));
            } else {
                stack.push(parseFloat(token));
            }
        });
    
        return stack.pop();
    };

    calculate.addEventListener('click', () => {
        let expression  = field.value.split(''),
            outputArray = [],
            stack       = [],
            countOperand = 0;
            // (6+10-4)/(1+1*2)+1
        expression.forEach( (cur, index) => {
            if (!isNaN( Number(cur) ) || cur == '.') { //если число              
                outputArray[countOperand] == undefined //если операнд не записан
                    ? outputArray[countOperand] = cur //запишем
                    : outputArray[countOperand] += cur; //в случае если операнд не одна цифра, а число, то продолжим записывать
            } else {
                countOperand++;
                function openBracket() {
                    if (cur == ')') {
                        let poped, length = stack.length;

                        for (let i = 0; i < length; i++) {
                            poped = stack.pop();          
                            if (poped == '(') break;
                            outputArray[countOperand] = poped;
                            countOperand++; 
                        }
                    }
                }
                if (stack.length === 0 || cur == '(') { 
                    stack.push(cur);
                    return false;
                }
                switch (stack[stack.length-1]) {
                    case '+':
                        if ( (cur == '-' || cur == '+') ) { //сравнение предыдущей операции с текущей. Их приоритет равен - всё равно меняем
                            outputArray[countOperand] = stack.pop();
                            stack.push(cur);
                            countOperand++;
                            break;
                        }
                        if (( (expression.length - stack.length - outputArray.length) > 0 && (cur == '*' || cur == '/') )) { //приоритет * и / выше, поэтому просто добавляем в стэк?...если в выражении имеются скобки
                            stack.push(cur);
                            break;
                        }
                        if (cur == '*' || cur == '/') {
                            outputArray[countOperand] = cur;
                            countOperand++;
                        }
                        openBracket();                        
                        break;
                    case '-':
                        if (cur == '+' || cur == '-') {
                            outputArray[countOperand] = stack.pop();
                            stack.push(cur);
                            countOperand++;                            
                        }
                        if (( (expression.length - stack.length - outputArray.length) > 0 && (cur == '*' || cur == '/') )) { //приоритет * и / выше, поэтому просто добавляем в стэк?...если в выражении имеются скобки
                            stack.push(cur);
                            break;
                        }
                        if (cur == '*' || cur == '/') {
                            outputArray[countOperand] = cur;
                            countOperand++;
                        }
                        openBracket();
                        break;
                    case '*':
                        if (cur == '+' || cur == '-' || cur == '*' || cur == '/') {
                            outputArray[countOperand] = stack.pop();
                            stack.push(cur);
                            countOperand++;                            
                        }
                        openBracket();
                        break;
                    case '/':
                        if (cur == '+' || cur == '-' || cur == '*' || cur == '/') {
                            outputArray[countOperand] = stack.pop();
                            stack.push(cur);
                            countOperand++;
                        }
                        openBracket();
                        break;
                    default: 
                        stack.push(cur);
                        break;
                }
                //console.log(`cur = ${cur}; stack = ${stack}; output = ${outputArray}`)

            }
            if ( index === expression.length-1 ) {
                outputArray[outputArray.length] = stack.pop();
                countOperand++;
                length = stack.length;
                if (length !== 0) {
                    for (let i = 0; i < length; i++) {
                        countOperand++;
                        outputArray[countOperand] = stack.pop();
                    }
                }
            } 
        });

        

        stack = [];
        //console.log(outputArray.join(' '))
        let OPN = outputArray.filter(item => {
            return item != ' ';
        }).join(' ');
        console.log(OPN);
        field.value = evaluate(OPN);
        outputArray = [];
        //console.log('result '+ evaluate('5 2 8 * +'));
        //console.log(evaluate('6 10 + 4 - 1 1 2 * + / 1 +'));

    })

    field.addEventListener('keypress', function(e) {
        if (e.keyCode == 13) calculate.click();
    });


    clear.addEventListener('click', function() {
        field.value = '';
    });

    deleteLast.addEventListener('click', function() {
        field.value = field.value.substr(0, field.value.length-1);
    })
    
    
});
