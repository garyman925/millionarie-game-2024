// 動畫管理模組
const AnimationManager = {
    // 跳動數字動畫
    animateNumber: function(element, start, end, duration = 1000) {
        // 確保 anime.js 已載入
        if (typeof anime === 'undefined') {
            console.error('Anime.js is not loaded!');
            return;
        }

        // 將數字轉換為字符串並補零，確保相同長度
        const startStr = start.toString().padStart(7, '0');
        const endStr = end.toString().padStart(7, '0');
        
        // 清空元素並創建容器
        element.innerHTML = '';
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.justifyContent = 'flex-end';
        element.appendChild(container);
        
        // 為每個數字位置創建一個 span
        const digitElements = [];
        for (let i = 0; i < startStr.length; i++) {
            const span = document.createElement('span');
            span.style.display = 'inline-block';
            span.style.width = '0.6em';  // 固定寬度
            span.style.textAlign = 'center';
            span.textContent = startStr[i];
            container.appendChild(span);
            digitElements.push(span);
        }

        // 為每個數字創建動畫
        digitElements.forEach((span, index) => {
            const startNum = parseInt(startStr[index]);
            const endNum = parseInt(endStr[index]);
            
            if (startNum !== endNum) {  // 只為變化的數字創建動畫
                anime({
                    targets: span,
                    translateY: [
                        { value: -20, duration: 100 },
                        { value: 0, duration: 200 }
                    ],
                    scale: [
                        { value: 1.5, duration: 100 },
                        { value: 1, duration: 200 }
                    ],
                    delay: index * 50,  // 依序動畫
                    begin: function() {
                        span.textContent = endNum;
                    }
                });
            }
        });

        // 最後的整體放大效果
        setTimeout(() => {
            anime({
                targets: container,
                scale: [1, 1.2, 1],
                duration: 400,
                easing: 'easeOutElastic(1, .5)'
            });
        }, duration);
    },

    // 添加彈跳效果
    addBounceEffect: function(element) {
        anime({
            targets: element,
            scale: [1, 1.2, 1],
            duration: 500,
            easing: 'easeOutElastic(1, .5)'
        });
    }
}; 