(() => {
    const body = document.querySelector('body');
    const sectionCalc = document.querySelector('#calc');
    let answer;
    let expression;
    let liAlternatives;
    let correctCount = 0;
    let wrongCount = 0;
    let money = 0;
    let question = 1;
    let start;
    let sI;
    let display = document.createElement('p');
    display.classList.add('clockSeconds');

    window.onload = () => {
        start = new Calculation(1, 1, '+');
        start.calc();
    };

    let brL = `<span class="brl">R$</span>`;
    let zeros = `<span class="zeros">,00</span>`;
    insertAfter(createDivAccount(), sectionCalc);
    const divAccount = document.querySelector('div.accountValue');
    divAccount.appendChild(createPAcc('Saldo em conta'));
    divAccount.appendChild(createP(money));

    insertAfter(createDivAccountTransactions(), divAccount);
    const divAccountTransactions = document.querySelector('div.accountTransactions');
    divAccountTransactions.appendChild(createPAcc('Extrato de transações'));
    divAccountTransactions.appendChild(createDivFeedback());
    insertAfter(pInstructions(), divAccountTransactions);
    const instructions = document.querySelector('p.instructions');

    const moneyCount = document.querySelector('p.money');
    insertAfter(createShareButton(), moneyCount);
    const share = document.querySelector('a.disabled');
    insertAfter(createPShare(), share);
    const shareInstructions = document.querySelector('.shareInstructions');
    const transactions = document.querySelectorAll('p.account')[1];
    const feedbackNum = document.querySelector('.feedback');
    feedbackNum.innerText = '- -'

    class Calculation {
        constructor(num1, num2, operator) {
            this.num1 = num1;
            this.num2 = num2;
            this.operator = operator;
        }
        calc() {
            answer = eval(this.num1 + this.operator + this.num2);
            expression = sectionCalc.appendChild(document.createElement('div'));
            expression.classList.add('expression');
            expression.innerText = this.num1 + ' ' + this.operator + ' ' + this.num2;
            if (this.operator === '-') {
                if (this.num1 < this.num2) {
                    answer = eval(this.num2 + this.operator + this.num1);
                    expression.innerText = this.num2 + ' ' + this.operator + ' ' + this.num1;
                }
            }
            insertAfter(createUlAlternative(), expression)
            const ul = document.querySelector('.group');

            let options = [randomAnswer(answer), randomAnswer(answer), answer];
            if (options[0] === options[1]) options = [options[0], options[1] + 12, options[2]];

            for (let i of shuffle(options)) {
                ul.appendChild(createLiAlternative(i));
            };

            liAlternatives = Array.from(document.querySelectorAll('.alternative'));
            for (let i in liAlternatives) {
                liAlternatives[i].addEventListener('click', e => {
                    clearInterval(sI);
                    question++;
                    checkAnswer(answer, e);
                    setTimeout(() => {
                        sectionCalc.innerHTML = '';
                        instructions.innerHTML = '';
                        this.countdown(5);
                        //sectionCalc.style.background = randomSectionColors();
                        sectionCalc.style.background = `linear-gradient(45deg, ${randomSectionColors()}, ${randomSectionColors()})`;
                        new Calculation(randomAlternativeNum(this.num1), randomAlternativeNum(this.num2), randomOperator()).calc();
                    }, 1500);
                    feedbackNum.innerHTML = `Acertos: <strong>${correctCount}</strong> | Erros: <strong>${wrongCount}</strong>`;
                    insertAfter(transactionsList(expression, answer, e), transactions);
                    moneyCount.innerHTML = brL + ' ' + numberPoint(money) + zeros;
                    if (money >= 1000) {
                        share.href = urlShare(`Eu fiz ${money} reais neste jogo!`);
                        share.innerText = 'Compartilhar';
                        share.classList.add('share');
                        shareInstructions.style.display = 'none';
                    }
                });
            }
        }
        timeOut() {
            question++;
            wrongCount++;
            display.innerText = '--:--';
            money = money - answer;
            if (money < 0) moneyCount.style.color = 'red';
            //if (money < 0 || money === 'NaN') money = 0;
            setTimeout(() => {
                sectionCalc.innerHTML = '';
                this.countdown(5);
                sectionCalc.style.background = randomSectionColors();
                new Calculation(randomAlternativeNum(this.num1), randomAlternativeNum(this.num2), randomOperator()).calc();
            }, 10);
            feedbackNum.innerHTML = `Acertos: <strong>${correctCount}</strong> | Erros: <strong>${wrongCount}</strong>`;
            insertAfter(transactionsList(expression, answer, false), transactions);
            moneyCount.innerHTML = brL + ' ' + numberPoint(money) + zeros;
            return;
        }

        countdown(duration) {
            let timer = duration, seconds;
            display.innerText = '--:--';
            sI = setInterval(() => {
                if (timer >= 0) {
                    seconds = parseInt(timer % 60, 10);
                    display.textContent = `00:0${seconds}`;
                    insertAfter(display, sectionCalc);
                }
                //if (--timer === 0) timer = duration;
                timer--;
                if (timer === -1) {
                    clearInterval(sI);
                    this.timeOut();
                }
            }, 1000);
        }
    }

    function checkAnswer(answer, e) {
        if (Number(e.target.innerText) === answer) {
            e.target.classList.add('correct');
            correctCount++;
            money = money + answer;
            if (moneyCount.style.color === 'red' && money >= 0) moneyCount.style.color = '';
        } else {
            e.target.classList.add('wrong');
            wrongCount++;
            money = money - answer;
            if (money < 0) moneyCount.style.color = 'red';
            //if (money < 0 || typeof money !== 'number') money = 0;
        }
        for (let i of liAlternatives) {
            !i.classList.contains('correct') && !i.classList.contains('wrong') ? i.classList.add('liRest') : null;
        }
    }

    function numberPoint(number) {
        if (number > 999 || number < -999) {
            let array = number.toString();
            array = Array.from(array);
            array.splice(-3, 0, '.');
            let x = array.join('');
            return x;
        }
        return number;
    }

    function randomOperator() {
        const operators = ['+', '-'];
        let n = (Math.floor(Math.random() * (operators.length) + 1)) - 1;
        return operators[n];
    }

    function randomAnswer(answer) {
        let number = eval(answer + randomOperator() + Math.floor(Math.random() * (9 - 1) + 1));
        number === answer ? number = number + Math.floor(Math.random() * 5) : number;
        number < 0 ? number = 7 : number;
        return number;
    }

    function randomAlternativeNum(excluded) {
        let n = Math.floor(Math.random() * (99 - 0) + 0);
        if (n === excluded) n++;
        return n;
    }

    function createUlAlternative() {
        const ul = document.createElement('ul');
        ul.classList.add('group');
        return ul;
    }

    function createLiAlternative(number) {
        const alternative = document.createElement('li');
        alternative.classList.add('alternative');
        alternative.innerText = number;
        return alternative;
    }

    function createPAcc(text) {
        const p = document.createElement('p');
        p.classList.add('account');
        p.innerText = text;
        return p;
    }

    function urlShare(text) {
        const textEncoded = text.replaceAll(' ', '%20');
        return 'https://wa.me/?text=' + textEncoded + ' ' + window.location.href;
    }

    function createShareButton() {
        const a = document.createElement('a');
        a.classList.add('disabled');
        a.innerText = 'Compartilhe pelo WhatsApp';
        a.target = '_blank';
        return a;
    }

    function createPShare() {
        const p = document.createElement('p');
        p.classList.add('shareInstructions');
        p.innerText = 'Desbloqueie o botão a partir de R$ 1.000';
        return p;
    }

    function pInstructions() {
        const p = document.createElement('p');
        p.classList.add('instructions');
        p.innerHTML = `<strong>Responda as expressões matemáticas e ganhe ou perca o total da resposta no seu saldo em conta.</strong><br><br><i>Os valores abordados neste jogo são apenas para fins lúdicos, sem uso monetário.<i>`;
        return p;
    }

    function randomSectionColors() {
        const colors = ['2BBA22', 'BA8418', 'BA3D87', 'ED731F', 'C3965D', '22AFBA', 'BAA518', '6E4224', '6E610E', '0E346E', 'BA4C3D', '586E14'];
        const num = Math.floor(Math.random() * colors.length);
        return '#' + colors[num];
    }

    function createP(content) {
        const p = document.createElement('p');
        p.classList.add('money');
        p.innerHTML = brL + ' ' + content + zeros;
        return p;
    }

    function createDivFeedback() {
        const div = document.createElement('div');
        div.classList.add('feedback');
        return div;
    }

    function createDivAccount() {
        const div = document.createElement('div');
        div.classList.add('accountValue');
        return div;
    }

    function createDivAccountTransactions() {
        const div = document.createElement('div');
        div.classList.add('accountTransactions');
        return div;
    }

    function transactionsList(expression, answer, click) {
        const div = document.createElement('div');
        div.classList.add('list');
        const p = document.createElement('p');
        p.classList.add('each');
        let divExpression = document.createElement('div');
        divExpression.classList.add('divExpression');
        divExpression.innerText = expression.innerText;
        let divAnswer = document.createElement('div');
        divAnswer.classList.add('divAnswer');
        divAnswer.innerText = answer;
        if (click) {
            if (Number(click.target.innerText) === answer) {
                divAnswer.classList.add('correctTransaction');
                divAnswer.innerText = '+' + answer;
                divExpression.innerHTML = expression.innerText + ` <span class="correct">ACERTOU</span>`;
            }
        }
        if (click) {
            if (Number(click.target.innerText) !== answer) {
                divAnswer.classList.add('wrongTransaction');
                divAnswer.innerText = '-' + answer;
                divExpression.innerHTML = expression.innerText + ` <span class="wrong">ERROU</span>`;
            }
        }
        if (!click) {
            divAnswer.classList.add('wrongTransaction');
            divAnswer.innerText = '-' + answer;
            divExpression.innerHTML = expression.innerText + ` <span class="wrong">ERROU</span>`;
        }
        p.appendChild(divExpression);
        p.appendChild(divAnswer);
        div.appendChild(p);
        return div;
    }

    function insertAfter(newNode, existingNode) {
        existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
    }

    function shuffle(array) {
        let currentIndex = array.length
        let randomIndex;

        // While there remain elements to shuffle.
        while (currentIndex != 0) {

            // Pick a remaining element.
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }

        return array;
    }
})();
