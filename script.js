const confettiConfig = {
    spread: 360,
    ticks: 100,
    gravity: 0.8,
    decay: 0.94,
    startVelocity: 30,
    shapes: ["square", "circle"],
    colors: ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff"]
};

function showConfetti() {
    confetti({
        ...confettiConfig,
        particleCount: 100,
        origin: { x: 0.5, y: 0.3 }
    });
}

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
    {
        question: "地球的軸心是什麼？",
        options: ["北極", "南極", "赤道", "地球中心"],
        correct: 1
    }
    // 可以繼續添加更多問題...
];

let currentQuestion = 0;
let currentMoney = 0;
let correctCount = 0;
let wrongCount = 0;

// 定義獎金階梯
const moneyLadder = [1000, 5000, 10000, 50000, 100000, 250000, 500000, 1000000];

// 添加提示數組
const hints = [
    ["這是第一個提示", "這是第二個提示", "這是第三個提示"],
    ["提示 A", "提示 B", "提示 C"],
    ["Hint 1", "Hint 2", "Hint 3"]
    // 為每個問題添加對應的提示...
];

// 記錄已使用的提示按鈕
let usedHints = new Set();

function showHint(hintIndex) {
    if (usedHints.has(hintIndex)) return;
    
    const hintBubble = document.getElementById('hintBubble');
    const currentHints = hints[currentQuestion] || ["提示不可用"];
    const hintText = currentHints[hintIndex];
    
    hintBubble.textContent = hintText;
    hintBubble.style.display = 'block';
    
    // 禁用已使用的提示按鈕
    document.getElementsByClassName('hint-btn')[hintIndex].disabled = true;
    usedHints.add(hintIndex);
    
    // 3秒後隱藏提示
    setTimeout(() => {
        hintBubble.style.display = 'none';
    }, 3000);
}

function startGame() {
    currentQuestion = 0;
    currentMoney = 0;
    correctCount = 0;
    wrongCount = 0;
    updateStats();
    displayQuestion();
    updateMoneyLadder();
    usedHints.clear();
    const hintBtns = document.getElementsByClassName('hint-btn');
    for (let btn of hintBtns) {
        btn.disabled = false;
    }
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
    
    updateStats();
}

function checkAnswer(selectedOption) {
    const question = questions[currentQuestion];
    
    // 禁用所有選項按鈕
    const options = document.getElementsByClassName("option");
    for (let i = 0; i < options.length; i++) {
        options[i].disabled = true;
    }
    
    const questionBox = document.getElementById("question");
    
    // 顯示正確答案
    options[question.correct].classList.add('correct-answer');
    
    if (selectedOption === question.correct) {
        showConfetti();
        correctCount++;
        currentMoney++;
        updateMoneyLadder();
        
        questionBox.innerHTML = `
            <div style="color: #00ff00; font-size: 2.5rem; text-align: center;">
                答對了！
                <div style="font-size: 1.5rem; margin-top: 10px;">
                    準備下一題...
                </div>
            </div>
        `;
    } else {
        // 標記錯誤選項
        options[selectedOption].classList.add('wrong-answer');
        wrongCount++;
        currentMoney = 0;
        updateMoneyLadder();
        
        questionBox.innerHTML = `
            <div style="color: #ff0000; font-size: 2.5rem; text-align: center;">
                答錯了！
                <div style="font-size: 1.5rem; margin-top: 10px;">
                    正確答案是：${question.options[question.correct]}
                </div>
            </div>
        `;
    }
    
    currentQuestion++;
    updateStats();
    
    // 延遲後重置按鈕樣式並顯示下一題
    setTimeout(() => {
        // 重置所有按鈕的樣式
        for (let i = 0; i < options.length; i++) {
            options[i].disabled = false;
            options[i].classList.remove('correct-answer', 'wrong-answer');
        }
        
        if (currentQuestion < questions.length) {
            displayQuestion();
        } else {
            questionBox.innerHTML = `
                <div style="text-align: center;">
                    <h2>遊戲結束！</h2>
                    <p>總題數: ${questions.length}</p>
                    <p>答對: ${correctCount}</p>
                    <p>答錯: ${wrongCount}</p>
                </div>
            `;
            setTimeout(() => {
                startGame();
            }, 3000);
        }
    }, 2000);
}

function updateMoneyLadder() {
    const ladderItems = document.getElementById("moneyLadder").getElementsByTagName("li");
    
    // 先移除所有活動狀態和動畫類
    for (let i = 0; i < ladderItems.length; i++) {
        ladderItems[i].classList.remove("active", "moving-up");
    }
    
    // 找到要激活的項目
    const activeIndex = ladderItems.length - 1 - currentMoney;
    if (activeIndex >= 0 && activeIndex < ladderItems.length) {
        // 先添加上升動畫
        ladderItems[activeIndex].classList.add("moving-up");
        
        // 短暫延遲後添加活動狀態（這會觸發閃爍動畫）
        setTimeout(() => {
            ladderItems[activeIndex].classList.add("active");
        }, 100);
    }
}

// 添加更新統計的函數
function updateStats() {
    document.getElementById('questionCount').textContent = currentQuestion;
    document.getElementById('totalQuestions').textContent = questions.length;
    document.getElementById('correctCount').textContent = correctCount;
    document.getElementById('wrongCount').textContent = wrongCount;
    // 更新獎金顯示，使用千分位格式
    document.getElementById('totalMoney').textContent = moneyLadder[currentMoney - 1]?.toLocaleString() || 0;
}

// 開始遊戲
startGame(); 