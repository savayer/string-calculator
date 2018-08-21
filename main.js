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
        },
        priority   = {
            '+': 1,
            '-': 1,
            '*': 2,
            '/': 2
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
            //(6+10-4)/(1+1*2)+1
        expression.forEach( (cur, i) => {
            if (!isNaN( Number(cur) ) || cur == '.') { //если число              
                outputArray[countOperand] == undefined //если операнд не записан
                    ? outputArray[countOperand] = cur //запишем
                    : outputArray[countOperand] += cur; //в случае если операнд не одна цифра, а число, то продолжим записывать
            } else {
                countOperand++;
/*                 if (stack.length === 0) {
                    stack.push(cur);
                } else if (stack[stack.length-1] == '*' || stack[stack.length-1] == '/' && cur == '+' || cur == '-') {
                    outputArray[countOperand] = stack.pop();
                    stack.push(cur);
                    countOperand++;
                } else if (stack[stack.length-1] == '+' || stack[stack.length-1] == '-' && cur == '*' || cur == '/') {
                    outputArray[countOperand] = cur;
                    countOperand++;
                } else stack.push(cur); */
     /*            if (stack.length === 0) { 
                    stack.push(cur);
                    return false;
                }
                switch (stack[stack.length-1]) {
                    case '(':
                        
                        break;
                    default: 
                        stack.push(cur);
                        break;
                }

                function changeOperator() {
                    outputArray[countOperand] = stack.pop();
                    stack.push(cur);
                } */

            }
            if ( i === expression.length-1 ) outputArray[outputArray.length] = stack.pop();
        });

        

        stack = [];
        console.log(outputArray.join(' '))
        field.value = evaluate(outputArray.join(' '));
        outputArray = [];
        //console.log('result '+ evaluate('5 2 * 10 +'));
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
