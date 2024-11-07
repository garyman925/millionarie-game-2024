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

const questions = [
    {
        question: "Which is the largest planet in our solar system?",
        options: ["Jupiter", "Saturn", "Uranus", "Neptune"],
        correct: 0
    },
    {
        question: "How long is the Great Wall of China?",
        options: ["5,000 km", "6,000 km", "7,000 km", "8,000 km"],
        correct: 2
    },
    {
        question: "What is Earth's axis?",
        options: ["North Pole", "South Pole", "Equator", "Earth's Core"],
        correct: 1
    }
];

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

function startGame() {
    currentQuestion = 0;
    currentMoney = 0;
    correctCount = 0;
    wrongCount = 0;
    currentScore = 0;  // 重置分數
    usedHintOnCurrentQuestion = false;
    updateStats();
    displayQuestion();
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
        alert("恭喜你！你贏得了遊戲！");
        startGame();
        return;
    }

    const question = questions[currentQuestion];
    document.getElementById("question").textContent = question.question;
    
    const options = document.getElementsByClassName("option");
    for (let i = 0; i < options.length; i++) {
        options[i].style.opacity = "1";
        options[i].disabled = false;
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
        SoundManager.playCorrect();
        showConfetti();
        correctCount++;
        currentMoney++;
        updateMoneyLadder();
        
        // 計算分數
        if (usedHintOnCurrentQuestion) {
            currentScore += 990;  // 使用提示後只得到 990 分
        } else {
            currentScore += 1000; // 沒使用提示得到 1000 分
        }
        
        // 更新分數顯示
        document.getElementById('scoreCount').textContent = currentScore;
        
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
        
        // 2秒後移除彈出元素
        setTimeout(() => {
            popup.remove();
        }, 2000);
        
        // 保持問題框的顯示
        questionBox.style.opacity = '0.3';
        
        // 切換到正確動畫
        if (bugAnimation && bugCorrectAnimation) {
            bugAnimation.canvas.style.display = 'none';
            bugCorrectAnimation.canvas.style.display = 'block';
            bugWrongAnimation.canvas.style.display = 'none';
            
            // 3秒後切換回一般動畫
            setTimeout(() => {
                bugAnimation.canvas.style.display = 'block';
                bugCorrectAnimation.canvas.style.display = 'none';
                bugWrongAnimation.canvas.style.display = 'none';
            }, 3000);
        }
        showDialogue('correct');
    } else {
        SoundManager.playWrong();
        // 標記錯誤選項
        options[selectedOption].classList.add('wrong-answer');
        wrongCount++;
        currentMoney = 0;
        updateMoneyLadder();
        
        questionBox.innerHTML = `
            <div style="color: #ff0000; font-size: 2.5rem; text-align: center;">
                Wrong!
                <div style="font-size: 1.5rem; margin-top: 10px;">
                    Correct answer: ${question.options[question.correct]}
                </div>
            </div>
        `;
        
        // 切換到錯誤動畫
        if (bugAnimation && bugWrongAnimation) {
            bugAnimation.canvas.style.display = 'none';
            bugCorrectAnimation.canvas.style.display = 'none';
            bugWrongAnimation.canvas.style.display = 'block';
            
            // 3秒後切換回一般動畫
            setTimeout(() => {
                bugAnimation.canvas.style.display = 'block';
                bugCorrectAnimation.canvas.style.display = 'none';
                bugWrongAnimation.canvas.style.display = 'none';
            }, 3000);
        }
        showDialogue('wrong');
    }
    
    currentQuestion++;
    updateStats();
    
    setTimeout(() => {
        // 重置所有按鈕的樣式
        for (let i = 0; i < options.length; i++) {
            options[i].disabled = false;
            options[i].classList.remove('correct-answer', 'wrong-answer');
        }
        
        // 恢復問題框的透明度
        questionBox.style.opacity = '1';
        
        if (currentQuestion < questions.length) {
            displayQuestion();
        } else {
            // 保存遊戲結果
            const gameResults = {
                money: moneyLadder[currentMoney - 1] || 0,
                score: currentScore, // 添加分數
                correct: correctCount,
                wrong: wrongCount,
                questions: questions.map((q, index) => ({
                    ...q,
                    userAnswer: index < currentQuestion ? (
                        options[index].classList.contains('correct-answer') ? q.correct : 
                        options[index].classList.contains('wrong-answer') ? index : q.correct
                    ) : null
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
        AnimationManager.animateNumber(moneyElement, currentAmount, newAmount);
        AnimationManager.addBounceEffect(moneyElement.parentElement);
    }
    
    document.getElementById('scoreCount').textContent = currentScore;
}

// 開始遊戲
startGame();

// 在文件開頭添加 debug 模式變量
let debugMode = false;

// 添加鍵盤事件監聽器
document.addEventListener('keydown', function(event) {
    // 按下 'D' 鍵切換 debug 模式
    if (event.key === 'd' || event.key === 'D') {
        debugMode = !debugMode;
        const question = questions[currentQuestion];
        if (debugMode) {
            console.log(`Debug Mode ON`);
            console.log(`Current Question: ${currentQuestion + 1}`);
            console.log(`Correct Answer: ${String.fromCharCode(65 + question.correct)} (${question.options[question.correct]})`);
            
            // 在問題框中顯示正確答案
            const questionBox = document.getElementById('question');
            const originalText = questionBox.textContent;
            questionBox.innerHTML = `
                <div style="color: yellow; font-size: 1.2rem; margin-bottom: 10px;">
                    Debug: Correct Answer is ${String.fromCharCode(65 + question.correct)}
                </div>
                ${originalText}
            `;
        } else {
            console.log('Debug Mode OFF');
            displayQuestion(); // 重新顯示問題，移除 debug 息
        }
    }
    
    // 修改 'C' 鍵的測試部分
    if (event.key === 'c' || event.key === 'C') {
        const question = questions[currentQuestion];
        showConfetti();
        
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

    // 添加 'R' 鍵來測試結果頁面
    if (event.key === 'r' || event.key === 'R') {
        // 創建測試用的遊戲結果數據
        const testResults = {
            money: 100000,
            correct: 2,
            wrong: 1,
            questions: questions.map((q, index) => ({
                ...q,
                userAnswer: index % 2 === 0 ? q.correct : (q.correct + 1) % 4 // 模擬一些答對一些答錯
            }))
        };
        
        // 保存測試數據到 localStorage
        localStorage.setItem('gameResults', JSON.stringify(testResults));
        
        // 跳轉到結果頁面
        window.location.href = 'result.html';
    }
}); 

// 在選項按鈕的點擊事件中
document.querySelectorAll('.option').forEach(button => {
    button.addEventListener('mouseover', () => {
        SoundManager.playSelect();
    });
});