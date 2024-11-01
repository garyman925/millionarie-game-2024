const questions = [
    {
        question: "太陽系中最大的行星是？",
        options: ["木星", "土星", "天王星", "海王星"],
        correct: 0
    },
    {
        question: "長城有多長？",
        options: ["5000公里", "6000公里", "7000公里", "8000公里"],
        correct: 2
    },
    // 可以繼續添加更多問題...
];

let currentQuestion = 0;
let currentMoney = 0;

function startGame() {
    currentQuestion = 0;
    currentMoney = 0;
    displayQuestion();
    updateMoneyLadder();
}

function displayQuestion() {
    if (currentQuestion >= questions.length) {
        alert("恭喜你！你贏得了遊戲！");
        startGame();
        return;
    }

    const question = questions[currentQuestion];
    document.getElementById("question").textContent = question.question;
    
    const options = document.getElementsByClassName("option");
    for (let i = 0; i < options.length; i++) {
        options[i].textContent = `${String.fromCharCode(65 + i)}: ${question.options[i]}`;
    }
}

function checkAnswer(selectedOption) {
    const question = questions[currentQuestion];
    
    if (selectedOption === question.correct) {
        currentQuestion++;
        currentMoney++;
        updateMoneyLadder();
        
        if (currentQuestion < questions.length) {
            displayQuestion();
        } else {
            alert("恭喜你！你贏得了遊戲！");
            startGame();
        }
    } else {
        alert("答錯了！遊戲結束！");
        startGame();
    }
}

function updateMoneyLadder() {
    const ladderItems = document.getElementById("moneyLadder").getElementsByTagName("li");
    for (let i = 0; i < ladderItems.length; i++) {
        ladderItems[i].classList.remove("active");
        if (i === ladderItems.length - 1 - currentMoney) {
            ladderItems[i].classList.add("active");
        }
    }
}

// 開始遊戲
startGame(); 