
const CALCULATOR = {
    '+': (num) => num2 => Number(num) + Number(num2),
    '-': (num) => num2 => Number(num) - Number(num2),
    '*': (num) => num2 => Number(num) * Number(num2),
    '/': (num) => num2 => Number(num2) == 0? undefined: Number(num) / Number(num2),
    "^": (num) => num2 => Math.pow(Number(num), Number(num2)),
    "!": (num) => {
        num = Number(num)

        if(num === 0)
            return 1

        for(let i = num - 1; i > 1; i--)
        {
            num *= i;
        }

        return num
    },
}

const DISPLAY = document.querySelector("#calc-display p");

const NUMBERS_KEYS = document.querySelectorAll(".numb");
const OPERATOR_KEYS = document.querySelectorAll(".operator");

const DOT_KEY = document.querySelector(".dot");
const FACTORIAL_KEY = document.querySelector(".factorial");
const EXPONENT_KEY = document.querySelector(".exponent");
const AC_KEY = document.querySelector(".clear");
const EQUAL_KEY = document.querySelector(".equals");

NUMBERS_KEYS.forEach(key => {
    key.addEventListener("click", e => {
        let currentString = DISPLAY.innerText;
        let lastChar = currentString.charAt(currentString.length - 1);

        //Don't let it write next to a factorial
        if(lastChar != "!")
            addToDisplay(key.innerText);
    })
})

OPERATOR_KEYS.forEach(key => {
    key.addEventListener("click", e => {
        let currentString = DISPLAY.innerText;
        let lastChar = currentString.charAt(currentString.length - 1);

        //If the last character is an operator do not write
        if(!(/[\+\-\*\/\.\^]/).test(lastChar) && lastChar != "")
            addToDisplay(key.innerText);
    })
})


DOT_KEY.addEventListener("click", e => {
    let currentString = DISPLAY.innerText;
    let lastChar = currentString.charAt(currentString.length - 1);

    let expresionArray = currentString.split(/[\+\-\*\/\^]/);
    currentNumber = expresionArray[expresionArray.length -1]

    //If the last character is an operator do not write, also if the current number has . don't let put another one
    if(!(/[\+\-\*\/\.\^]/).test(lastChar) && lastChar != "" && !currentNumber.includes("."))
        addToDisplay(".");
})

FACTORIAL_KEY.addEventListener("click", e => {
    let currentString = DISPLAY.innerText;
    let lastChar = currentString.charAt(currentString.length - 1);
    
    //If the last character is an operator do not write
    if(!(/[\+\-\*\/\.\^]/).test(lastChar) && lastChar != "")
        addToDisplay("!");
})

EXPONENT_KEY.addEventListener("click", e => {
    let currentString = DISPLAY.innerText;
    let lastChar = currentString.charAt(currentString.length - 1);

    //If the last character is an operator do not write
    if(!(/[\+\-\*\/\.\^]/).test(lastChar) && lastChar != "")
        addToDisplay("^");
})

AC_KEY.addEventListener("click", e => {
    DISPLAY.innerText = "";
})

EQUAL_KEY.addEventListener("click", e => {
    let currentCalc = DISPLAY.innerText;
    evaluate(currentCalc)
})

function addToDisplay(str){
    DISPLAY.innerText += str;
}

// Keyboard Support


function evaluate(str){
    //Split expresion in + -
    let expresion = str.split(/(?<=[\+\-])|(?=[\+\-])/)

    const resolveExp = (expressi) => {
        let currentCalc = numb => Number(numb);
        let currentResult = 0;
    
        for(let i = 0; i < expressi.length; i++)
        {
            let element = expressi[i];
            
            // If it's a operator, make currentCalc a function with 
            // currentResult loaded in.
            // If it's not a operator(number), operate on CurrentResult
            
            if(CALCULATOR.hasOwnProperty(element))
                currentCalc = CALCULATOR[element](currentResult)
            else{
                currentResult = currentCalc(element)
            }  
        }

        return currentResult;
    }

    //This goes through an array and finds deeper layers of pemdas
    for(let i = 0; i < expresion.length; i++)
    {
        //Split * /
        if(expresion[i].length > 1)
        {
            let temp = expresion[i].split(/(?<=[\*\/])|(?=[\*\/])/);
            expresion[i] = temp;

            //Split ^
            for(let j = 0; j < temp.length; j++)
            {
                if(expresion[i][j].length > 1)
                {
                    let expo = expresion[i][j].split(/(?<=[\^])|(?=[\^])/);
                    expresion[i][j] = expo;

                    //Parse factorial operations
                    for(let k = 0; k < expo.length; k++)
                    {
                        //Check if the element has a ! at the end
                        let currentElement = expresion[i][j][k];
                        let lastChar = currentElement.charAt(currentElement.length - 1);

                        if(lastChar == "!")
                        {
                            //Remove last char
                            expresion[i][j][k] = (expresion[i][j][k]).slice(0, currentElement.length - 1);

                            //Convert to factorial
                            expresion[i][j][k] = CALCULATOR["!"](expresion[i][j][k]);
                        }
                    }

                    //Start to resolve at ^ level
                    //console.log(expo, resolveExp(expo))
                    expresion[i][j] = resolveExp(expo);
                }
            }

            //Resolve at * / level
            //console.log(temp, resolveExp(temp))
            expresion[i] = resolveExp(temp);
        }
    }

    //Now everything has been reduced to simple + -
    //console.log(resolveExp(expresion))
    

    let solution = resolveExp(expresion);

    
    //Check if solution it's a number

    if(isNaN(solution))
        DISPLAY.innerText = "Syntax error";
    else
        DISPLAY.innerText = resolveExp(expresion);

}