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

// 定義獎金階梯
const moneyLadder = [1000, 5000, 10000, 50000, 100000, 250000, 500000, 1000000];

// 添加提示數
const hints = [
    ["This planet has a big red spot", "It's a gas giant", "Largest by mass and volume"],
    ["Hint A", "Hint B", "Hint C"],
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
        SoundManager.playCorrect();
        showConfetti();
        correctCount++;
        currentMoney++;
        updateMoneyLadder();
        
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
    // 更新獎金顯示，使用千分位格式
    document.getElementById('totalMoney').textContent = moneyLadder[currentMoney - 1]?.toLocaleString() || 0;
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
            displayQuestion(); // 重新顯示問題，移除 debug 信息
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