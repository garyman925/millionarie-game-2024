const confettiConfig = {
    particleCount: 200,
    spread: 150,
    origin: { y: 0 },
    gravity: 3,
    ticks: 100,
    startVelocity: 150,
    shapes: ["square"],
    colors: [
        "#FFD700",
        "#DAA520",
        "#B8860B",
        "#FFA500",
        "#F0E68C"
    ],
    scalar: 3,
    zIndex: 100,
    disableForReducedMotion: true
};

function showConfetti() {
    confetti({
        ...confettiConfig,
        origin: { x: 0.5, y: 0 },
        angle: 90,
        drift: 1
    });

    setTimeout(() => {
        confetti({
            ...confettiConfig,
            origin: { x: 0.4, y: 0 },
            angle: 85,
            particleCount: 50
        });
        confetti({
            ...confettiConfig,
            origin: { x: 0.6, y: 0 },
            angle: 95,
            particleCount: 50
        });
    }, 1000);
}

// 修改問題加載函數
function loadQuestions() {
    fetch('questions.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load questions');
            }
            return response.json();
        })
        .then(data => {
            if (!data || !data.questions || !Array.isArray(data.questions)) {
                throw new Error('Invalid question data format');
            }
            questions = data.questions;
            startGame();
        })
        .catch(error => {
            console.error('Error:', error);
            // 顯示錯誤信息給玩家
            const errorMessage = document.createElement('div');
            errorMessage.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(255, 0, 0, 0.9);
                color: white;
                padding: 20px;
                border-radius: 10px;
                font-size: 1.5rem;
                text-align: center;
                z-index: 1000;
            `;
            errorMessage.innerHTML = `
                <h2>Error Loading Questions</h2>
                <p>Unable to load the game questions. Please try again later.</p>
                <button onclick="location.reload()" style="
                    padding: 10px 20px;
                    margin-top: 10px;
                    background: white;
                    color: black;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                ">Retry</button>
            `;
            document.body.appendChild(errorMessage);
        });
}

// 在頁面加載時調用
window.addEventListener('load', loadQuestions);

let currentQuestion = 0;
let currentMoney = 0;
let correctCount = 0;
let wrongCount = 0;

// 修改獎金階梯數組
const moneyLadder = [
    1000,
    1500,
    2500,
    5000,
    7500,
    10000,
    15000,
    25000,
    50000,
    100000,
    250000,
    500000,
    1000000
];

// 添加提示數
const hints = [
    ["This planet has a big red spot", "It's a gas giant", "Largest by mass and volume"],
    ["Hint A", "Hint B", "Hint C"],
    ["Hint 1", "Hint 2", "Hint 3"]
    // 為每個問題添加對應的提示...
];

// 記錄已使用的提示按鈕
let usedHints = new Set();

// 添加分數變量
let currentScore = 0;
let usedHintOnCurrentQuestion = false;

// 添加對話內容
const dialogues = {
    welcome: "Welcome! Let's see if you can become a millionaire!",
    correct: [
        "Excellent! Keep going!",
        "You're doing great!",
        "That's the right answer!",
        "Perfect! You're on fire!"
    ],
    wrong: [
        "Oops! That's not correct...",
        "Don't worry, try again!",
        "Better luck next time!"
    ],
    hint: "Using a hint? Choose wisely!",
    finalQuestion: "This is the million dollar question!",
    gameOver: "Congratulations on completing the game!"
};

// 顯示對話的函數
function showDialogue(type, index = null) {
    const bubbleBox = document.getElementById('bubbleBox');
    let message;

    if (Array.isArray(dialogues[type])) {
        // 如果是數組，隨機選擇一條消息
        const randomIndex = Math.floor(Math.random() * dialogues[type].length);
        message = dialogues[type][randomIndex];
    } else {
        message = dialogues[type];
    }

    bubbleBox.querySelector('.bubble-content').textContent = message;
    bubbleBox.classList.add('show');

    // 3秒後隱藏對話框
    setTimeout(() => {
        bubbleBox.classList.remove('show');
    }, 3000);
}

// 在不同情況下調用對話顯示
// 在遊戲開始時
window.addEventListener('load', () => {
    setTimeout(() => {
        showDialogue('welcome');
    }, 4000); // 等待倒計時結束後顯示
});

function showHint(hintIndex) {
    if (usedHints.has(hintIndex)) return;
    
    showDialogue('hint');
    
    // 標記當前問題使用了提示
    usedHintOnCurrentQuestion = true;
    
    // 禁用已使用的提示按鈕
    document.getElementsByClassName('hint-btn')[hintIndex].disabled = true;
    usedHints.add(hintIndex);
    
    // 獲取當前問題
    const question = questions[currentQuestion];
    const correctAnswer = question.correct;
    
    // 獲取所有選項按鈕
    const options = document.getElementsByClassName("option");
    
    // 創建錯誤答案的索引數組（排除正確答案）
    const wrongAnswers = [0, 1, 2, 3].filter(i => i !== correctAnswer);
    
    // 隨機選擇兩個錯誤答案
    const shuffled = wrongAnswers.sort(() => 0.5 - Math.random());
    const toHide = shuffled.slice(0, 2);
    
    // 將選中的錯誤答案變暗
    toHide.forEach(index => {
        options[index].style.opacity = "0.3";
        options[index].disabled = true;
    });
}

// 添加一個數組來記錄用戶的答案
let userAnswers = [];

function checkAnswer(selectedOption) {
    // 記錄用戶的答案
    userAnswers[currentQuestion] = selectedOption;
    
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
        SoundManager.playCorrect();
        AnimationModule.showConfetti();
        correctCount++;
        currentMoney++;
        updateMoneyLadder();
        
        // 計算分數
        if (usedHintOnCurrentQuestion) {
            currentScore += 990;
        } else {
            currentScore += 1000;
        }
        
        document.getElementById('scoreCount').textContent = currentScore;
        
        // 創建彈出元素 - 答對
        const popup = document.createElement('div');
        popup.className = 'correct-popup';
        popup.innerHTML = `
            <h1 class="correct-text">YOU ARE CORRECT!</h1>
            <div style="color: #00ff00; font-size: 1.5rem; margin-top: 20px;">
                The answer is: ${question.options[question.correct]}
            </div>
        `;
        
        document.body.appendChild(popup);
        
        // 切換到正確動畫
        if (bugAnimation && bugCorrectAnimation) {
            bugAnimation.canvas.style.display = 'none';
            bugCorrectAnimation.canvas.style.display = 'block';
            bugWrongAnimation.canvas.style.display = 'none';
        }
        showDialogue('correct');
    } else {
        SoundManager.playWrong();
        options[selectedOption].classList.add('wrong-answer');
        wrongCount++;
        currentMoney = 0;
        updateMoneyLadder();
        
        // 創建彈出元素 - 答錯
        const popup = document.createElement('div');
        popup.className = 'correct-popup';
        popup.innerHTML = `
            <h1 class="correct-text" style="color: #ff0000;">WRONG ANSWER!</h1>
            <div style="color: #ff0000; font-size: 1.5rem; margin-top: 20px;">
                The correct answer is: ${question.options[question.correct]}
            </div>
        `;
        
        document.body.appendChild(popup);
        
        // 切換到錯誤動畫
        if (bugAnimation && bugWrongAnimation) {
            bugAnimation.canvas.style.display = 'none';
            bugCorrectAnimation.canvas.style.display = 'none';
            bugWrongAnimation.canvas.style.display = 'block';
        }
        showDialogue('wrong');
    }
    
    // 使問題框變暗
    questionBox.style.opacity = '0.3';
    
    currentQuestion++;
    updateStats();
    
    setTimeout(() => {
        // 移除彈出元素
        const popup = document.querySelector('.correct-popup');
        if (popup) popup.remove();
        
        // 重置所有按鈕的樣式
        for (let i = 0; i < options.length; i++) {
            options[i].disabled = false;
            options[i].classList.remove('correct-answer', 'wrong-answer');
        }
        
        // 恢復問題框的透明度
        questionBox.style.opacity = '1';
        
        // 切換回正常動畫
        if (bugAnimation) {
            bugAnimation.canvas.style.display = 'block';
            if (bugCorrectAnimation) bugCorrectAnimation.canvas.style.display = 'none';
            if (bugWrongAnimation) bugWrongAnimation.canvas.style.display = 'none';
        }
        
        if (currentQuestion < questions.length) {
            displayQuestion();
        } else {
            // 保存遊戲結果
            const gameResults = {
                money: moneyLadder[currentMoney - 1] || 0,
                score: currentScore,
                correct: correctCount,
                wrong: wrongCount,
                questions: questions.map((q, i) => ({
                    question: q.question,
                    options: q.options,
                    correct: q.correct,
                    userAnswer: userAnswers[i] // 使用記錄的答案
                }))
            };
            localStorage.setItem('gameResults', JSON.stringify(gameResults));
            
            // 跳轉到結果頁面
            window.location.href = 'result.html';
            return;
        }
    }, 2000);
    
    // 重置提示使用標記
    usedHintOnCurrentQuestion = false;
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
    if (currentMoney > 0) {
        SoundManager.playLevelUp();
    }
}

// 添加更新統計的函數
function updateStats() {
    document.getElementById('questionCount').textContent = currentQuestion;
    document.getElementById('totalQuestions').textContent = questions.length;
    document.getElementById('correctCount').textContent = correctCount;
    document.getElementById('wrongCount').textContent = wrongCount;
    
    // 獲取當前和新的金額
    const currentAmount = moneyLadder[currentMoney - 2] || 0;
    const newAmount = moneyLadder[currentMoney - 1] || 0;
    
    // 如果金額有變化，使用動畫
    if (newAmount > currentAmount) {
        const moneyElement = document.getElementById('totalMoney');
        AnimationModule.animateNumber(moneyElement, currentAmount, newAmount);
        AnimationModule.addBounceEffect(moneyElement.parentElement);
    }
    
    document.getElementById('scoreCount').textContent = currentScore;
}

// 開始遊戲
startGame();

// 添加鍵盤事件監聽器
document.addEventListener('keydown', function(event) {
    // 修改 'C' 鍵的測試部分
    if (event.key === 'c' || event.key === 'C') {
        const question = questions[currentQuestion];
        AnimationModule.showConfetti();
        
        // 創建彈出元素
        const popup = document.createElement('div');
        popup.className = 'correct-popup';
        popup.innerHTML = `
            <h1 class="correct-text">YOU ARE CORRECT!</h1>
            <div style="color: #00ff00; font-size: 1.5rem; margin-top: 20px;">
                The answer is: ${question.options[question.correct]}
            </div>
        `;
        
        // 添加到頁面
        document.body.appendChild(popup);
        
        // 使問題框變暗
        const questionBox = document.getElementById("question");
        questionBox.style.opacity = '0.3';
        
        // 2秒後移除彈出元素並恢復問題框
        setTimeout(() => {
            popup.remove();
            questionBox.style.opacity = '1';
            displayQuestion();
        }, 2000);
    }
}); 

// 在選項按鈕的點擊事件中
document.querySelectorAll('.option').forEach(button => {
    button.addEventListener('mouseover', () => {
        SoundManager.playSelect();
    });
});

// 在 startGame 函數中重置答案記錄
function startGame() {
    currentQuestion = 0;
    currentMoney = 0;
    correctCount = 0;
    wrongCount = 0;
    currentScore = 0;
    userAnswers = [];
    usedHintOnCurrentQuestion = false;
    updateStats();
    updateMoneyLadder();
    
    // 重置提示按鈕和選項透明度
    usedHints.clear();
    const options = document.getElementsByClassName('option');
    const hintBtns = document.getElementsByClassName('hint-btn');
    
    // 重置所有按鈕狀態
    for (let btn of hintBtns) {
        btn.disabled = false;
    }
    
    for (let option of options) {
        option.style.opacity = "1";
        option.disabled = false;
    }
}

function displayQuestion() {
    if (currentQuestion >= questions.length) {
        startGame();
        return;
    }

    const question = questions[currentQuestion];
    
    // 獲取 money ladder 的當前高亮位置的金額
    const ladderItems = document.getElementById("moneyLadder").getElementsByTagName("li");
    const activeIndex = ladderItems.length - 1 - currentMoney;
    const currentQuestionMoney = ladderItems[activeIndex].textContent;
    
    // 先隱藏所有選項
    const options = document.getElementsByClassName("option");
    for (let i = 0; i < options.length; i++) {
        options[i].style.opacity = "0";
        options[i].disabled = true;
    }
    
    // 更新問題顯示，包含獎金金額
    const questionElement = document.getElementById("question");
    questionElement.style.opacity = "0";
    questionElement.innerHTML = `
        <div style="color: #ffaa00; font-family: 'Sancreek', cursive; font-size: 1.5rem;">
            ${currentQuestionMoney} Question
        </div>
        <div>${question.question}</div>
    `;

    // 問題淡入動畫
    anime({
        targets: questionElement,
        opacity: [0, 1],
        duration: 1000,
        easing: 'easeInOutQuad',
        complete: function() {
            // 問題顯示完成後，依次顯示選項
            for (let i = 0; i < options.length; i++) {
                setTimeout(() => {
                    options[i].textContent = `${String.fromCharCode(65 + i)}: ${question.options[i]}`;
                    options[i].disabled = false;
                    
                    // 選項淡入動畫
                    anime({
                        targets: options[i],
                        opacity: [0, 1],
                        duration: 500,
                        easing: 'easeInOutQuad'
                    });
                }, i * 500); // 每個選項間隔 500ms
            }
        }
    });
    
    updateStats();
}

// 在 script.js 中添加測試函數
function showVictoryScreen() {
    // 創建特殊的勝利畫面
    const victoryOverlay = document.createElement('div');
    victoryOverlay.className = 'victory-overlay';
    victoryOverlay.innerHTML = `
        <div class="victory-content">
            <h1 class="victory-text">CONGRATULATIONS!</h1>
            <h2 class="victory-subtext">You Are A Millionaire!</h2>
            <div class="money-amount">$1,000,000</div>
        </div>
    `;
    document.body.appendChild(victoryOverlay);

    // 添加持續的金色 confetti 效果
    const interval = setInterval(() => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            gravity: 0.8,
            ticks: 300,
            startVelocity: 30,
            shapes: ["circle"],
            colors: ["#FFD700", "#FFFF00", "#F0E68C", "#DAA520"],
            scalar: 1.2,
            zIndex: 100,
            angle: 90,
            drift: 1
        });
    }, 1000);

    // 60秒後停止 confetti
    setTimeout(() => clearInterval(interval), 60000);
}

// 添加鍵盤事件監聽器
document.addEventListener('keydown', function(event) {
    // 按 'V' 鍵顯示勝利畫面
    if (event.key === 'v' || event.key === 'V') {
        showVictoryScreen();
    }
});