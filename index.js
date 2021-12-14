let solveBtn = document.getElementById("solve");

solveBtn.addEventListener("click", () => {
    let g = document.getElementById("G").value;
    let u = document.getElementById("U").value;
    let resultDiv = document.getElementById("result");
    let tableDiv = document.getElementById("resultTable");

    let gWords = g.split(/\n/);
    let errorWords = u.split(/\n/);

    checkForErrors(gWords, errorWords);

    let subsets = findAllSubsets(gWords, 1);
    let codeWords = findWords(subsets);
    let errorCount = findErrorCount(codeWords);
    let errorLeaders = findAllLeaders(gWords[0].length, errorCount);
    let wordsWithLeaders = sumLeadersAndWords(codeWords, errorLeaders);

    if(errorCount < 1){
        let h5Holder = document.createElement("h5");
        let str = "Кодът не може да поправя грешки и няма таблица на Слепян.";
        let str1 = "Кодовите думи са: [" + codeWords.join(", ") + "]";
        h5Holder.innerHTML += str + "<br>" + str1;
        resultDiv.appendChild(h5Holder);
    } else {
        let h5Holder = document.createElement("h5");
        let str = "Кодът може да поправя " + errorCount + " грешки.";
        let str1 = "Кодовите думи са: [" + codeWords.join(", ") + "]";
        let str2 = "Вектори на грешката: [" + errorLeaders.join(", ") + "]";
        h5Holder.innerHTML += str + "<br>" + str1 + "<br>" + str2;

        for (let i = 0; i < errorWords.length; i++) {
            let str3 = "";
            let doesTableIncludesTheError = doesTheTableIncludesErrorWord(wordsWithLeaders, errorWords[i]);

            if (codeWords.includes(errorWords[i])){
                str3 = "Векторът грешка " + errorWords[i] + " е кодова дума, пристигнала без грешки.";
            }else if(doesTableIncludesTheError[0] === true){
                let tableWord = doesTableIncludesTheError[1];
                let leader = errorLeaders[doesTableIncludesTheError[2]];
                let word = codeWords[doesTableIncludesTheError[3]];
                str3 = "Векторът грешка " + tableWord + " е равен на изпратената дума " + word + " с вектор на грешката " + leader;
            }else {
                str3 = "Векторът грешка " + errorWords[i] + " съдържа повече от " + errorCount + " грешки."
            }
            h5Holder.innerHTML += "<br>" + str3;
        }
        resultDiv.appendChild(h5Holder);

        let tableElement = document.createElement("table");
        tableElement.setAttribute("class","table w-75");

        let tableBody = document.createElement("tbody");

        for (let i = 0; i < wordsWithLeaders.length; i++) {
            let row = document.createElement("tr");
            for (let j = 0; j < wordsWithLeaders[i][j]; j++) {
                let cell = document.createElement("td");
                cell.appendChild(document.createTextNode(wordsWithLeaders[i][j]));
                row.appendChild(cell);
            }
            tableBody.appendChild(row);
        }
        tableElement.appendChild(tableBody);
        tableDiv.appendChild(tableElement);

    }
})

function doesTheTableIncludesErrorWord(table, error){
    let areEquals = false;
    let tableWord = "";
    for (let i = 0; i < table.length; i++) {
        for (let j = 0; j < table[i].length; j++) {
            if (error === table[i][j]){
                areEquals = true;
                tableWord = table[i][j];
                return [areEquals, tableWord, i, j];
            }
        }
    }
    return [false];
}

function sumLeadersAndWords(wordsArr, leadersArr) {
    let matrix = [];

    for (let i = 0; i < leadersArr.length; i++) {
        let row = [];
        for (let j = 0; j < wordsArr.length; j++) {
            let matrixWord = binaryAddition(leadersArr[i], wordsArr[j]);
            row.push(matrixWord);
        }
        matrix[i] = row;
    }
    return matrix;
}

function findLeaders(lengthOfG, errors) {
    let result = [];
    for (const bits of getPermutations(Array.from(Array(lengthOfG).keys()), errors)) {
        let s = Array(lengthOfG).fill('0');
        for (const bit of bits) {
            s[bit] = '1';
        }
        result.push(s.join(''));
    }
    return result;
}

function findAllLeaders(lengthOfG, errors) {
    let allLeaders = [];
    for (let i = 1; i <= errors; i++) {
        let arr = findLeaders(lengthOfG, i);
        allLeaders.push(...arr);
    }
    return allLeaders;
}

function getPermutations(array, size) {

    let result = [];

    function p(t, i) {
        if (t.length === size) {
            result.push(t);
            return;
        }
        if (i + 1 > array.length) {
            return;
        }
        p(t.concat(array[i]), i + 1);
        p(t, i + 1);
    }

    p([], 0);
    return result;
}

function findErrorCount(arr) {
    let count = 999;
    for (let i = 1; i < arr.length; i++) {
        let temp = (arr[i].match(/1/g) || []).length;
        if (temp < count) {
            count = temp;
        }
    }
    return Math.floor((count - 1) / 2);
}

function findWords(arr) {
    let zeroWord = "0".repeat(arr[0][0].length)
    let arrayWords = [];
    arrayWords.push(zeroWord);

    for (let i = 0; i < arr.length; i++) {
        let word = zeroWord;
        for (let j = 0; j < arr[i].length; j += 2) {
            word = binaryAddition(word, binaryAddition(arr[i][j], arr[i][j + 1]));
        }
        arrayWords.push(word);
    }
    return arrayWords;
}

function findAllSubsets(a, min) {
    let fn = function (n, src, got, all) {
        if (n == 0) {
            if (got.length > 0) {
                all[all.length] = got;
            }
            return;
        }
        for (let j = 0; j < src.length; j++) {
            fn(n - 1, src.slice(j + 1), got.concat([src[j]]), all);
        }
        return;
    };
    let all = [];
    for (let i = min; i < a.length; i++) {
        fn(i, a, [], all);
    }
    all.push(a);
    return all;
}

function binaryAddition(a, b) {
    let result = "";

    while (a || b) {
        if (!b) {
            b = '0'.repeat(a.length)
        }
        let sum = +a.slice(-1) + +b.slice(-1); // get last digit from each number and sum

        if (sum > 1) {
            result = sum % 2 + result;
        } else {
            result = sum + result;
        }

        // trim last digit (110 -> 11)
        a = a.slice(0, -1);
        b = b.slice(0, -1);
    }
    return result;
}

function checkForErrors(gWords, errorWords) {
    gWords.forEach(el => {
        if (el.length != gWords[0].length) alert("Думите в матрица G са с различна дължина.");
    })
    errorWords.forEach(el => {
        if (el.length != errorWords[0].length) alert("Думите в U са с различна дължина.");
    })
    if (errorWords.length > 1) {
        gWords.forEach((el, i) => {
            if (el.length != errorWords[0].length) alert("Думите в двете матрици са с различни дължини.");
        })
    } else {
        if (errorWords[0].length != gWords[0].length) alert("Дължината на думите U не отговаря на матрицата G.");
    }
}